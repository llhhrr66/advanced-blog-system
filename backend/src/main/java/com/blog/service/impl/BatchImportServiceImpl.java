package com.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.blog.domain.dto.*;
import com.blog.domain.entity.InterviewQuestion;
import com.blog.domain.entity.InterviewCategory;
import com.blog.mapper.InterviewQuestionMapper;
import com.blog.mapper.InterviewCategoryMapper;
import com.blog.service.IBatchImportService;
import com.blog.util.MarkdownParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * 批量导入服务实现
 * 
 * @author 梁俊荣
 * @since 2025-09-25
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BatchImportServiceImpl implements IBatchImportService {
    
    private final InterviewQuestionMapper interviewQuestionMapper;
    private final InterviewCategoryMapper interviewCategoryMapper;
    private final MarkdownParser markdownParser;
    
    // 导入任务缓存
    private final Map<String, ImportProgress> importTaskCache = new ConcurrentHashMap<>();
    
    @Override
    public List<ImportFileInfo> scanDirectory(String directory) {
        List<ImportFileInfo> fileInfoList = new ArrayList<>();
        
        try {
            Path startPath = Paths.get(directory);
            
            if (!Files.exists(startPath) || !Files.isDirectory(startPath)) {
                throw new RuntimeException("目录不存在或不是有效的目录：" + directory);
            }
            
            // 递归扫描目录下的所有Markdown文件
            try (Stream<Path> stream = Files.walk(startPath)) {
                List<Path> markdownFiles = stream
                    .filter(Files::isRegularFile)
                    .filter(path -> path.toString().toLowerCase().endsWith(".md"))
                    .collect(Collectors.toList());
                
                for (Path mdFile : markdownFiles) {
                    try {
                        ImportFileInfo fileInfo = new ImportFileInfo();
                        fileInfo.setId(UUID.randomUUID().toString());
                        fileInfo.setName(mdFile.getFileName().toString());
                        fileInfo.setPath(mdFile.toString());
                        fileInfo.setSize(Files.size(mdFile));
                        fileInfo.setSelected(true);
                        
                        // 读取文件内容
                        String content = Files.readString(mdFile);
                        fileInfo.setContent(content);
                        
                        // 使用MarkdownParser解析文件
                        markdownParser.parseMarkdownFile(fileInfo);
                        
                        // 从路径提取分类
                        String category = markdownParser.extractCategoryFromPath(mdFile.toString());
                        fileInfo.setCategory(category);
                        
                        // 设置默认值
                        if (fileInfo.getStatus() == null) {
                            fileInfo.setStatus("ready");
                        }
                        
                        fileInfoList.add(fileInfo);
                        
                    } catch (IOException e) {
                        log.error("读取文件失败: {}", mdFile, e);
                    }
                }
            }
            
            log.info("成功扫描目录 {}，找到 {} 个Markdown文件", directory, fileInfoList.size());
            
        } catch (IOException e) {
            log.error("扫描目录失败: {}", directory, e);
            throw new RuntimeException("扫描目录失败：" + e.getMessage());
        }
        
        return fileInfoList;
    }
    
    @Override
    @Async
    @Transactional(rollbackFor = Exception.class)
    public BatchImportResponse batchImport(BatchImportRequest request) {
        String taskId = UUID.randomUUID().toString();
        List<ImportFileInfo> files = request.getFiles();
        ImportConfig config = request.getConfig();
        
        // 初始化进度
        ImportProgress progress = ImportProgress.builder()
            .total(files.size())
            .processed(0)
            .success(0)
            .failed(0)
            .skipped(0)
            .status("importing")
            .errors(new ArrayList<>())
            .build();
        
        importTaskCache.put(taskId, progress);
        
        // 批量导入响应
        BatchImportResponse response = BatchImportResponse.builder()
            .taskId(taskId)
            .progress(progress)
            .results(new ArrayList<>())
            .build();
        
        // 预处理：创建分类映射
        Map<String, Long> categoryCache = new HashMap<>();
        
        if (config.getCreateCategories()) {
            preloadCategories(categoryCache);
        }
        
        // 批量处理文件
        int batchSize = config.getBatchSize() != null ? config.getBatchSize() : 10;
        for (int i = 0; i < files.size(); i += batchSize) {
            int end = Math.min(i + batchSize, files.size());
            List<ImportFileInfo> batch = files.subList(i, end);
            
            for (ImportFileInfo fileInfo : batch) {
                try {
                    // 更新当前处理文件
                    progress.setCurrentFile(fileInfo.getName());
                    
                    // 导入单个文件
                    BatchImportResponse.ImportResult result = processSingleFile(fileInfo, config, categoryCache, null);
                    response.getResults().add(result);
                    
                    // 更新进度
                    progress.setProcessed(progress.getProcessed() + 1);
                    
                    if ("success".equals(result.getStatus())) {
                        progress.setSuccess(progress.getSuccess() + 1);
                    } else if ("skipped".equals(result.getStatus())) {
                        progress.setSkipped(progress.getSkipped() + 1);
                    } else {
                        progress.setFailed(progress.getFailed() + 1);
                        progress.getErrors().add(new ImportProgress.ImportError(fileInfo.getName(), result.getMessage()));
                    }
                    
                } catch (Exception e) {
                    log.error("导入文件失败: {}", fileInfo.getName(), e);
                    progress.setFailed(progress.getFailed() + 1);
                    progress.setProcessed(progress.getProcessed() + 1);
                    progress.getErrors().add(new ImportProgress.ImportError(fileInfo.getName(), e.getMessage()));
                    
                    response.getResults().add(BatchImportResponse.ImportResult.builder()
                        .file(fileInfo.getName())
                        .status("error")
                        .message(e.getMessage())
                        .build());
                }
            }
        }
        
        // 更新最终状态
        progress.setStatus("completed");
        log.info("批量导入完成，成功：{}，失败：{}，跳过：{}", 
            progress.getSuccess(), progress.getFailed(), progress.getSkipped());
        
        return response;
    }
    
    /**
     * 处理单个文件导入
     */
    private BatchImportResponse.ImportResult processSingleFile(
            ImportFileInfo fileInfo, 
            ImportConfig config,
            Map<String, Long> categoryCache,
            Map<String, Long> tagCache) {
        
        try {
            // 验证文件
            if (!validateFile(fileInfo)) {
                return BatchImportResponse.ImportResult.builder()
                    .file(fileInfo.getName())
                    .status("skipped")
                    .message("文件验证失败")
                    .build();
            }
            
            // 检查是否已存在
            String title = fileInfo.getTitle();
            LambdaQueryWrapper<InterviewQuestion> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(InterviewQuestion::getTitle, title);
            InterviewQuestion existingQuestion = interviewQuestionMapper.selectOne(wrapper);
            
            if (existingQuestion != null) {
                // 根据配置处理重复
                if ("skip".equals(config.getMode())) {
                    return BatchImportResponse.ImportResult.builder()
                        .file(fileInfo.getName())
                        .status("skipped")
                        .message("面试题已存在")
                        .build();
                } else if ("update".equals(config.getMode())) {
                    // 更新面试题
                    updateInterviewQuestion(existingQuestion, fileInfo, config, categoryCache);
                    return BatchImportResponse.ImportResult.builder()
                        .file(fileInfo.getName())
                        .articleId(existingQuestion.getId())
                        .status("success")
                        .message("更新成功")
                        .build();
                }
                // overwrite模式：删除旧面试题，创建新面试题
                interviewQuestionMapper.deleteById(existingQuestion.getId());
            }
            
            // 创建新面试题
            InterviewQuestion question = createInterviewQuestion(fileInfo, config, categoryCache);
            Long questionId = question.getId();
            
            return BatchImportResponse.ImportResult.builder()
                .file(fileInfo.getName())
                .articleId(questionId)
                .status("success")
                .message("导入成功")
                .build();
            
        } catch (Exception e) {
            log.error("处理文件失败: {}", fileInfo.getName(), e);
            return BatchImportResponse.ImportResult.builder()
                .file(fileInfo.getName())
                .status("error")
                .message(e.getMessage())
                .build();
        }
    }
    
    /**
     * 创建面试题
     */
    private InterviewQuestion createInterviewQuestion(
            ImportFileInfo fileInfo,
            ImportConfig config,
            Map<String, Long> categoryCache) {
        
        InterviewQuestion question = new InterviewQuestion();
        question.setTitle(fileInfo.getTitle());
        question.setContent(fileInfo.getContent());
        question.setStatus(config.getDefaultStatus());
        question.setCreateBy(1L); // TODO: 从当前登录用户获取
        
        // 设置分类
        if (StringUtils.hasText(fileInfo.getCategory())) {
            Long categoryId = getOrCreateInterviewCategory(fileInfo.getCategory(), categoryCache, config);
            question.setCategoryId(categoryId);
        }
        
        // 设置难度等级（从标签中提取或默认为中等）
        question.setDifficulty(2); // 默认中等难度
        if (fileInfo.getTags() != null) {
            for (String tag : fileInfo.getTags()) {
                if ("简单".equals(tag) || "easy".equalsIgnoreCase(tag)) {
                    question.setDifficulty(1);
                } else if ("困难".equals(tag) || "hard".equalsIgnoreCase(tag)) {
                    question.setDifficulty(3);
                }
            }
        }
        
        // 设置文件路径
        question.setFilePath(fileInfo.getPath());
        
        // 设置时间
        question.setImportTime(LocalDateTime.now());
        if (config.getPreserveTime() && fileInfo.getCreateTime() != null) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                LocalDateTime createTime = LocalDateTime.parse(fileInfo.getCreateTime(), formatter);
                question.setCreateTime(createTime);
            } catch (Exception e) {
                log.warn("解析创建时间失败: {}", fileInfo.getCreateTime());
            }
        }
        
        if (config.getPreserveTime() && fileInfo.getUpdateTime() != null) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                LocalDateTime updateTime = LocalDateTime.parse(fileInfo.getUpdateTime(), formatter);
                question.setUpdateTime(updateTime);
                question.setLastUpdateTime(updateTime);
            } catch (Exception e) {
                log.warn("解析更新时间失败: {}", fileInfo.getUpdateTime());
            }
        }
        
        // 设置原文链接
        if (StringUtils.hasText(fileInfo.getOriginalUrl())) {
            question.setSourceUrl(fileInfo.getOriginalUrl());
        }
        
        // 设置其他默认值
        question.setViewCount(0);
        question.setLikeCount(0);
        question.setCollectCount(0);
        question.setCommentCount(0);
        question.setSortOrder(0);
        question.setIsDeleted(false);
        
        interviewQuestionMapper.insert(question);
        
        return question;
    }
    
    /**
     * 更新面试题
     */
    private void updateInterviewQuestion(
            InterviewQuestion question,
            ImportFileInfo fileInfo,
            ImportConfig config,
            Map<String, Long> categoryCache) {
        
        question.setTitle(fileInfo.getTitle());
        question.setContent(fileInfo.getContent());
        
        // 更新分类
        if (StringUtils.hasText(fileInfo.getCategory())) {
            Long categoryId = getOrCreateInterviewCategory(fileInfo.getCategory(), categoryCache, config);
            question.setCategoryId(categoryId);
        }
        
        // 更新时间
        if (config.getPreserveTime() && fileInfo.getUpdateTime() != null) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                LocalDateTime updateTime = LocalDateTime.parse(fileInfo.getUpdateTime(), formatter);
                question.setUpdateTime(updateTime);
                question.setLastUpdateTime(updateTime);
            } catch (Exception e) {
                log.warn("解析更新时间失败: {}", fileInfo.getUpdateTime());
            }
        } else {
            question.setUpdateTime(LocalDateTime.now());
            question.setLastUpdateTime(LocalDateTime.now());
        }
        
        interviewQuestionMapper.updateById(question);
    }
    
    /**
     * 获取或创建面试题分类
     */
    private Long getOrCreateInterviewCategory(String categoryName, Map<String, Long> cache, ImportConfig config) {
        // 先从缓存查找
        if (cache.containsKey(categoryName)) {
            return cache.get(categoryName);
        }
        
        // 从数据库查找
        LambdaQueryWrapper<InterviewCategory> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(InterviewCategory::getCategoryName, categoryName);
        InterviewCategory category = interviewCategoryMapper.selectOne(wrapper);
        
        if (category != null) {
            cache.put(categoryName, category.getId());
            return category.getId();
        }
        
        // 创建新分类
        if (config.getCreateCategories()) {
            category = new InterviewCategory();
            category.setCategoryName(categoryName);
            category.setSortOrder(0);
            category.setStatus(1);
            category.setQuestionCount(0);
            category.setParentId(0L);
            interviewCategoryMapper.insert(category);
            cache.put(categoryName, category.getId());
            return category.getId();
        }
        
        return null;
    }
    
    /**
     * 预加载面试题分类
     */
    private void preloadCategories(Map<String, Long> cache) {
        List<InterviewCategory> categories = interviewCategoryMapper.selectList(null);
        for (InterviewCategory category : categories) {
            cache.put(category.getCategoryName(), category.getId());
        }
    }
    
    @Override
    public ImportProgress getImportProgress(String taskId) {
        return importTaskCache.get(taskId);
    }
    
    @Override
    public boolean cancelImport(String taskId) {
        ImportProgress progress = importTaskCache.get(taskId);
        if (progress != null) {
            progress.setStatus("cancelled");
            return true;
        }
        return false;
    }
    
    @Override
    public boolean validateFile(ImportFileInfo fileInfo) {
        if (fileInfo == null) {
            return false;
        }
        
        // 检查必要字段
        if (!StringUtils.hasText(fileInfo.getTitle())) {
            log.warn("文件 {} 缺少标题", fileInfo.getName());
            return false;
        }
        
        if (!StringUtils.hasText(fileInfo.getContent())) {
            log.warn("文件 {} 内容为空", fileInfo.getName());
            return false;
        }
        
        return true;
    }
    
    @Override
    public BatchImportResponse.ImportResult importSingleFile(ImportFileInfo fileInfo, ImportConfig config) {
        Map<String, Long> categoryCache = new HashMap<>();
        
        if (config.getCreateCategories()) {
            preloadCategories(categoryCache);
        }
        
        return processSingleFile(fileInfo, config, categoryCache, null);
    }
}

package com.blog.controller;

import com.blog.annotation.OperationLog;
import com.blog.common.result.Result;
import com.blog.domain.dto.*;
import com.blog.service.IBatchImportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * 批量导入控制器
 * 
 * @author 梁俊荣
 * @since 2025-09-25
 */
@Slf4j
@RestController
@RequestMapping("/import")
@RequiredArgsConstructor
@Validated
@Tag(name = "批量导入管理", description = "批量导入Markdown文件相关接口")
public class BatchImportController {
    
    private final IBatchImportService batchImportService;
    
    /**
     * 扫描目录获取Markdown文件列表
     */
    @GetMapping("/scan")
    @Operation(summary = "扫描目录", description = "递归扫描指定目录，获取所有Markdown文件信息")
    @OperationLog(
        operationType = "SCAN_DIRECTORY",
        description = "扫描目录获取文件列表",
        targetType = "IMPORT",
        level = 1
    )
    public Result<List<ImportFileInfo>> scanDirectory(
            @Parameter(description = "目录路径", required = true)
            @RequestParam @NotBlank(message = "目录路径不能为空") String directory) {
        
        log.info("开始扫描目录: {}", directory);
        List<ImportFileInfo> files = batchImportService.scanDirectory(directory);
        log.info("扫描完成，找到 {} 个文件", files.size());
        
        return Result.success(files);
    }
    
    /**
     * 上传文件并解析
     */
    @PostMapping("/upload")
    @Operation(summary = "上传文件", description = "上传Markdown文件并解析内容")
    @OperationLog(
        operationType = "UPLOAD_FILES",
        description = "上传Markdown文件",
        targetType = "IMPORT",
        level = 1
    )
    public Result<List<ImportFileInfo>> uploadFiles(
            @Parameter(description = "文件列表", required = true)
            @RequestParam("files") MultipartFile[] files) throws IOException {
        
        log.info("开始处理上传的 {} 个文件", files.length);
        List<ImportFileInfo> fileInfoList = new ArrayList<>();
        
        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }
            
            String filename = file.getOriginalFilename();
            if (filename == null || !filename.toLowerCase().endsWith(".md")) {
                log.warn("跳过非Markdown文件: {}", filename);
                continue;
            }
            
            try {
                ImportFileInfo fileInfo = new ImportFileInfo();
                fileInfo.setId(UUID.randomUUID().toString());
                fileInfo.setName(filename);
                fileInfo.setPath(filename);
                fileInfo.setSize(file.getSize());
                fileInfo.setContent(new String(file.getBytes(), "UTF-8"));
                fileInfo.setSelected(true);
                fileInfo.setStatus("ready");
                
                fileInfoList.add(fileInfo);
                
            } catch (IOException e) {
                log.error("处理文件失败: {}", filename, e);
            }
        }
        
        log.info("文件上传处理完成，成功处理 {} 个文件", fileInfoList.size());
        return Result.success(fileInfoList);
    }
    
    /**
     * 批量导入文章
     */
    @PostMapping("/batch")
    @Operation(summary = "批量导入", description = "批量导入Markdown文件为文章")
    @OperationLog(
        operationType = "BATCH_IMPORT",
        description = "批量导入文章",
        targetType = "ARTICLE",
        recordParams = true,
        level = 2
    )
    public Result<BatchImportResponse> batchImport(
            @Valid @RequestBody BatchImportRequest request) {
        
        log.info("开始批量导入，文件数: {}, 配置: {}", 
            request.getFiles().size(), request.getConfig());
        
        BatchImportResponse response = batchImportService.batchImport(request);
        
        log.info("批量导入完成，任务ID: {}", response.getTaskId());
        return Result.success(response);
    }
    
    /**
     * 获取导入进度
     */
    @GetMapping("/progress/{taskId}")
    @Operation(summary = "获取导入进度", description = "根据任务ID获取导入进度")
    public Result<ImportProgress> getImportProgress(
            @Parameter(description = "任务ID", required = true)
            @PathVariable String taskId) {
        
        ImportProgress progress = batchImportService.getImportProgress(taskId);
        if (progress == null) {
            return Result.error("任务不存在");
        }
        
        return Result.success(progress);
    }
    
    /**
     * 取消导入任务
     */
    @PostMapping("/cancel/{taskId}")
    @Operation(summary = "取消导入", description = "取消正在执行的导入任务")
    @OperationLog(
        operationType = "CANCEL_IMPORT",
        description = "取消导入任务",
        targetType = "IMPORT",
        level = 2
    )
    public Result<Boolean> cancelImport(
            @Parameter(description = "任务ID", required = true)
            @PathVariable String taskId) {
        
        log.info("取消导入任务: {}", taskId);
        boolean success = batchImportService.cancelImport(taskId);
        
        if (success) {
            return Result.success(true);
        } else {
            return Result.error("取消失败，任务可能已完成或不存在");
        }
    }
    
    /**
     * 导入单个文件
     */
    @PostMapping("/single")
    @Operation(summary = "导入单个文件", description = "导入单个Markdown文件")
    @OperationLog(
        operationType = "IMPORT_SINGLE",
        description = "导入单个文件",
        targetType = "ARTICLE",
        recordParams = true,
        level = 1
    )
    public Result<BatchImportResponse.ImportResult> importSingle(
            @Valid @RequestBody ImportSingleRequest request) {
        
        log.info("导入单个文件: {}", request.getFileInfo().getName());
        
        BatchImportResponse.ImportResult result = batchImportService.importSingleFile(
            request.getFileInfo(), 
            request.getConfig()
        );
        
        if ("success".equals(result.getStatus())) {
            return Result.success(result);
        } else {
            return Result.error(result.getMessage());
        }
    }
    
    /**
     * 验证文件
     */
    @PostMapping("/validate")
    @Operation(summary = "验证文件", description = "验证Markdown文件是否符合导入要求")
    public Result<ValidationResult> validateFiles(
            @RequestBody List<ImportFileInfo> files) {
        
        ValidationResult result = new ValidationResult();
        result.setTotal(files.size());
        
        List<String> validFiles = new ArrayList<>();
        List<String> invalidFiles = new ArrayList<>();
        
        for (ImportFileInfo file : files) {
            if (batchImportService.validateFile(file)) {
                validFiles.add(file.getName());
            } else {
                invalidFiles.add(file.getName());
            }
        }
        
        result.setValid(validFiles.size());
        result.setInvalid(invalidFiles.size());
        result.setValidFiles(validFiles);
        result.setInvalidFiles(invalidFiles);
        
        return Result.success(result);
    }
    
    /**
     * 单文件导入请求DTO
     */
    @lombok.Data
    public static class ImportSingleRequest {
        @Valid
        private ImportFileInfo fileInfo;
        
        @Valid
        private ImportConfig config;
    }
    
    /**
     * 验证结果DTO
     */
    @lombok.Data
    public static class ValidationResult {
        private int total;
        private int valid;
        private int invalid;
        private List<String> validFiles;
        private List<String> invalidFiles;
    }
}

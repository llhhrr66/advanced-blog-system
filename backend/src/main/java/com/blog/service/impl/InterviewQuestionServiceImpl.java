package com.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.blog.common.exception.BusinessException;
import com.blog.common.result.ResultEnum;
import com.blog.domain.dto.InterviewQuestionCreateDTO;
import com.blog.domain.dto.InterviewQuestionQueryDTO;
import com.blog.domain.dto.InterviewQuestionResponseDTO;
import com.blog.domain.dto.InterviewQuestionUpdateDTO;
import com.blog.domain.entity.InterviewCategory;
import com.blog.domain.entity.InterviewQuestion;
import com.blog.mapper.InterviewCategoryMapper;
import com.blog.mapper.InterviewQuestionMapper;
import com.blog.service.IInterviewQuestionService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 面试题服务实现类
 */
@Service
public class InterviewQuestionServiceImpl extends ServiceImpl<InterviewQuestionMapper, InterviewQuestion> 
        implements IInterviewQuestionService {
    
    @Autowired
    private InterviewQuestionMapper interviewQuestionMapper;
    
    @Autowired
    private InterviewCategoryMapper interviewCategoryMapper;
    
    @Override
    public IPage<InterviewQuestion> getQuestionsByPage(InterviewQuestionQueryDTO queryDTO) {
        // 创建分页对象
        Page<InterviewQuestion> page = queryDTO.toMpPageDefaultSortByCreateTimeDesc();
        
        // 构建查询条件
        QueryWrapper<InterviewQuestion> queryWrapper = new QueryWrapper<>();
        
        // 添加分类过滤
        if (queryDTO.getCategoryId() != null) {
            queryWrapper.eq("category_id", queryDTO.getCategoryId());
        }
        
        // 添加关键词搜索（标题和内容）
        if (StringUtils.hasText(queryDTO.getKeyword())) {
            queryWrapper.and(wrapper -> wrapper
                    .like("title", queryDTO.getKeyword())
                    .or()
                    .like("content", queryDTO.getKeyword())
            );
        }
        
        // 添加难度过滤
        if (queryDTO.getDifficultyLevel() != null) {
            queryWrapper.eq("difficulty_level", queryDTO.getDifficultyLevel());
        }
        
        // 添加状态过滤
        if (queryDTO.getStatus() != null) {
            queryWrapper.eq("status", queryDTO.getStatus());
        }
        
        // 添加来源过滤
        if (StringUtils.hasText(queryDTO.getSource())) {
            queryWrapper.like("source", queryDTO.getSource());
        }
        
        // 默认排序
        queryWrapper.orderByAsc("sort_order").orderByDesc("create_time");
        
        // 执行查询
        IPage<InterviewQuestion> questionPage = interviewQuestionMapper.selectPage(page, queryWrapper);
        
        return questionPage;
    }
    
    @Override
    public InterviewQuestion getQuestionById(Long id) {
        InterviewQuestion question = interviewQuestionMapper.selectById(id);
        if (question == null) {
            throw new BusinessException(ResultEnum.DATA_NOT_FOUND, "面试题不存在");
        }
        
        // 增加查看次数
        question.setViewCount(question.getViewCount() + 1);
        interviewQuestionMapper.updateById(question);
        
        return question;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public InterviewQuestion create(InterviewQuestionCreateDTO createDTO) {
        // 验证分类是否存在
        InterviewCategory category = interviewCategoryMapper.selectById(createDTO.getCategoryId());
        if (category == null) {
            throw new BusinessException(ResultEnum.DATA_NOT_FOUND, "分类不存在");
        }
        
        // 创建面试题实体
        InterviewQuestion question = new InterviewQuestion();
        BeanUtils.copyProperties(createDTO, question);
        question.setCreateTime(LocalDateTime.now());
        question.setUpdateTime(LocalDateTime.now());
        question.setViewCount(0);
        question.setCollectCount(0);
        question.setLikeCount(0);
        question.setCommentCount(0);
        
        // 保存到数据库
        int result = interviewQuestionMapper.insert(question);
        if (result <= 0) {
            throw new BusinessException(ResultEnum.OPERATION_FAILED, "创建面试题失败");
        }
        
        return question;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public InterviewQuestion updateQuestion(Long id, InterviewQuestionUpdateDTO updateDTO) {
        updateDTO.setId(id);
        // 验证面试题是否存在
        InterviewQuestion existingQuestion = interviewQuestionMapper.selectById(updateDTO.getId());
        if (existingQuestion == null) {
            throw new BusinessException(ResultEnum.DATA_NOT_FOUND, "面试题不存在");
        }
        
        // 如果修改了分类，验证新分类是否存在
        if (updateDTO.getCategoryId() != null) {
            InterviewCategory category = interviewCategoryMapper.selectById(updateDTO.getCategoryId());
            if (category == null) {
                throw new BusinessException(ResultEnum.DATA_NOT_FOUND, "分类不存在");
            }
        }
        
        // 更新面试题信息
        InterviewQuestion question = new InterviewQuestion();
        BeanUtils.copyProperties(updateDTO, question);
        question.setUpdateTime(LocalDateTime.now());
        
        // 只更新非空字段
        int result = interviewQuestionMapper.updateById(question);
        if (result <= 0) {
            throw new BusinessException(ResultEnum.OPERATION_FAILED, "更新面试题失败");
        }
        
        // 重新查询并返回
        InterviewQuestion updatedQuestion = interviewQuestionMapper.selectById(updateDTO.getId());
        return updatedQuestion;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteById(Long id) {
        // 验证面试题是否存在
        InterviewQuestion question = interviewQuestionMapper.selectById(id);
        if (question == null) {
            throw new BusinessException(ResultEnum.DATA_NOT_FOUND, "面试题不存在");
        }
        
        int result = interviewQuestionMapper.deleteById(id);
        if (result <= 0) {
            throw new BusinessException(ResultEnum.OPERATION_FAILED, "删除面试题失败");
        }
        
        return true;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean batchDelete(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new BusinessException(ResultEnum.PARAMETER_ERROR, "删除ID列表不能为空");
        }
        
        int result = interviewQuestionMapper.deleteBatchIds(ids);
        if (result <= 0) {
            throw new BusinessException(ResultEnum.OPERATION_FAILED, "批量删除面试题失败");
        }
        
        return true;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateStatus(Long id, Integer status) {
        if (id == null) {
            throw new BusinessException(ResultEnum.PARAMETER_ERROR, "ID不能为空");
        }
        
        if (status == null || (status != 0 && status != 1)) {
            throw new BusinessException(ResultEnum.PARAMETER_ERROR, "状态值无效");
        }
        
        InterviewQuestion question = interviewQuestionMapper.selectById(id);
        if (question == null) {
            throw new BusinessException(ResultEnum.DATA_NOT_FOUND, "面试题不存在");
        }
        
        question.setStatus(status);
        question.setUpdateTime(LocalDateTime.now());
        
        int result = interviewQuestionMapper.updateById(question);
        if (result <= 0) {
            throw new BusinessException(ResultEnum.OPERATION_FAILED, "更新状态失败");
        }
        
        return true;
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateQuestionsStatus(List<Long> ids, Integer status) {
        if (ids == null || ids.isEmpty()) {
            return true;
        }
        
        for (Long id : ids) {
            updateStatus(id, status);
        }
        
        return true;
    }
    
    @Override
    public List<InterviewQuestion> getQuestionsByCategoryId(Long categoryId) {
        if (categoryId == null) {
            throw new BusinessException(ResultEnum.PARAMETER_ERROR, "分类ID不能为空");
        }
        
        QueryWrapper<InterviewQuestion> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("category_id", categoryId)
                   .eq("status", 1)
                   .orderByAsc("sort_order")
                   .orderByDesc("create_time");
        
        return interviewQuestionMapper.selectList(queryWrapper);
    }
    
    @Override
    public Long countQuestions() {
        return interviewQuestionMapper.selectCount(null);
    }
    
    @Override
    public Long countQuestionsByDifficulty(Integer difficulty) {
        QueryWrapper<InterviewQuestion> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("difficulty_level", difficulty);
        return interviewQuestionMapper.selectCount(queryWrapper);
    }
    
    @Override
    public Long countQuestionsByStatus(Integer status) {
        QueryWrapper<InterviewQuestion> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", status);
        return interviewQuestionMapper.selectCount(queryWrapper);
    }
    
    @Override
    public IPage<InterviewQuestion> search(String keyword, Integer pageNo, Integer pageSize) {
        Page<InterviewQuestion> page = new Page<>(pageNo != null ? pageNo : 1, pageSize != null ? pageSize : 10);
        
        QueryWrapper<InterviewQuestion> queryWrapper = new QueryWrapper<>();
        
        if (StringUtils.hasText(keyword)) {
            queryWrapper.and(wrapper -> wrapper
                    .like("title", keyword)
                    .or()
                    .like("content", keyword)
            );
        }
        
        queryWrapper.eq("status", 1)
                   .orderByAsc("sort_order")
                   .orderByDesc("create_time");
        
        return interviewQuestionMapper.selectPage(page, queryWrapper);
    }
    
    @Override
    public InterviewQuestion getRandomQuestion(Long categoryId) {
        QueryWrapper<InterviewQuestion> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", 1);
        
        if (categoryId != null) {
            queryWrapper.eq("category_id", categoryId);
        }
        
        queryWrapper.last("ORDER BY RAND() LIMIT 1");
        
        List<InterviewQuestion> questions = interviewQuestionMapper.selectList(queryWrapper);
        return questions.isEmpty() ? null : questions.get(0);
    }
}

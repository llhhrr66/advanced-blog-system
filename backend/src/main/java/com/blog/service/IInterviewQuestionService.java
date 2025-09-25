package com.blog.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.blog.domain.entity.InterviewQuestion;
import com.blog.domain.dto.InterviewQuestionCreateDTO;
import com.blog.domain.dto.InterviewQuestionUpdateDTO;
import com.blog.domain.dto.InterviewQuestionQueryDTO;

import java.util.List;

/**
 * 面试题服务接口
 */
public interface IInterviewQuestionService extends IService<InterviewQuestion> {

    /**
     * 分页查询面试题
     */
    IPage<InterviewQuestion> getQuestionsByPage(InterviewQuestionQueryDTO queryDTO);

    /**
     * 根据ID获取面试题详情
     */
    InterviewQuestion getQuestionById(Long id);

    /**
     * 创建面试题
     */
    InterviewQuestion create(InterviewQuestionCreateDTO createDTO);

    /**
     * 更新面试题
     */
    InterviewQuestion updateQuestion(Long id, InterviewQuestionUpdateDTO updateDTO);

    /**
     * 根据ID删除面试题
     */
    boolean deleteById(Long id);

    /**
     * 批量删除面试题
     */
    boolean batchDelete(List<Long> ids);

    /**
     * 更新面试题状态
     */
    boolean updateStatus(Long id, Integer status);

    /**
     * 批量更新面试题状态
     */
    boolean updateQuestionsStatus(List<Long> ids, Integer status);

    /**
     * 根据分类ID获取面试题列表
     */
    List<InterviewQuestion> getQuestionsByCategoryId(Long categoryId);

    /**
     * 统计面试题数量
     */
    Long countQuestions();

    /**
     * 根据难度统计面试题数量
     */
    Long countQuestionsByDifficulty(Integer difficulty);

    /**
     * 根据状态统计面试题数量
     */
    Long countQuestionsByStatus(Integer status);
    
    /**
     * 搜索面试题
     */
    IPage<InterviewQuestion> search(String keyword, Integer pageNo, Integer pageSize);
    
    /**
     * 随机获取面试题
     */
    InterviewQuestion getRandomQuestion(Long categoryId);
}

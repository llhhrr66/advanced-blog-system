package com.blog.domain.dto;

import lombok.Data;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * 面试题更新DTO
 */
@Data
public class InterviewQuestionUpdateDTO {
    
    /**
     * 题目ID
     */
    @NotNull(message = "题目ID不能为空")
    private Long id;
    
    /**
     * 分类ID
     */
    private Long categoryId;
    
    /**
     * 题目标题
     */
    private String title;
    
    /**
     * 题目内容（Markdown格式）
     */
    private String content;
    
    /**
     * 难度等级（1-简单，2-中等，3-困难）
     */
    @Min(value = 1, message = "难度等级最小为1")
    @Max(value = 3, message = "难度等级最大为3")
    private Integer difficulty;
    
    /**
     * 状态（0-禁用，1-启用）
     */
    private Integer status;
    
    /**
     * 来源
     */
    private String source;
    
    /**
     * 来源URL
     */
    private String sourceUrl;
    
    /**
     * 排序
     */
    private Integer sortOrder;
}

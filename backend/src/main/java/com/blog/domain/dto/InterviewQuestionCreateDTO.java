package com.blog.domain.dto;

import lombok.Data;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * 面试题创建DTO
 */
@Data
public class InterviewQuestionCreateDTO {
    
    /**
     * 分类ID
     */
    @NotNull(message = "分类ID不能为空")
    private Long categoryId;
    
    /**
     * 题目标题
     */
    @NotBlank(message = "题目标题不能为空")
    private String title;
    
    /**
     * 题目内容（Markdown格式）
     */
    @NotBlank(message = "题目内容不能为空")
    private String content;
    
    /**
     * 难度等级（1-简单，2-中等，3-困难）
     */
    @NotNull(message = "难度等级不能为空")
    @Min(value = 1, message = "难度等级最小为1")
    @Max(value = 3, message = "难度等级最大为3")
    private Integer difficulty;
    
    /**
     * 状态（0-禁用，1-启用）
     */
    private Integer status = 1;
    
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
    private Integer sortOrder = 0;
}

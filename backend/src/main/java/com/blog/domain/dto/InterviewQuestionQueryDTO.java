package com.blog.domain.dto;

import com.blog.domain.query.PageQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 面试题查询DTO
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "面试题查询请求")
public class InterviewQuestionQueryDTO extends PageQuery {
    
    /**
     * 题目标题
     */
    @Schema(description = "题目标题", example = "什么是Java")
    private String title;
    
    /**
     * 分类ID
     */
    @Schema(description = "分类ID", example = "1")
    private Long categoryId;
    
    /**
     * 难度等级（1-简单，2-中等，3-困难）
     */
    @Schema(description = "难度等级：1-简单，2-中等，3-困难", example = "1")
    private Integer difficultyLevel;
    
    /**
     * 状态（0-禁用，1-启用）
     */
    @Schema(description = "状态：0-禁用，1-启用", example = "1")
    private Integer status;
    
    /**
     * 关键词（搜索标题和内容）
     */
    @Schema(description = "关键词", example = "多线程")
    private String keyword;
    
    /**
     * 来源
     */
    @Schema(description = "来源", example = "手写")
    private String source;
}

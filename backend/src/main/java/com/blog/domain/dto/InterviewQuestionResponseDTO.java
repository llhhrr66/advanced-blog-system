package com.blog.domain.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 面试题响应DTO
 */
@Data
public class InterviewQuestionResponseDTO {
    
    /**
     * 题目ID
     */
    private Long id;
    
    /**
     * 分类ID
     */
    private Long categoryId;
    
    /**
     * 分类名称
     */
    private String categoryName;
    
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
    private Integer difficultyLevel;
    
    /**
     * 难度等级名称
     */
    private String difficultyName;
    
    /**
     * 状态（0-禁用，1-启用）
     */
    private Integer status;
    
    /**
     * 状态名称
     */
    private String statusName;
    
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
    
    /**
     * 查看次数
     */
    private Integer viewCount;
    
    /**
     * 收藏次数
     */
    private Integer favoriteCount;
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    private LocalDateTime updateTime;
    
    /**
     * 获取难度等级名称
     */
    public String getDifficultyName() {
        if (difficultyLevel == null) {
            return null;
        }
        switch (difficultyLevel) {
            case 1:
                return "简单";
            case 2:
                return "中等";
            case 3:
                return "困雾";
            default:
                return "未知";
        }
    }
    
    /**
     * 获取状态名称
     */
    public String getStatusName() {
        if (status == null) {
            return null;
        }
        return status == 1 ? "启用" : "禁用";
    }
}

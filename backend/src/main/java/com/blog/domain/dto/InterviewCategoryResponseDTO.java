package com.blog.domain.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 面试题分类响应DTO
 */
@Data
public class InterviewCategoryResponseDTO {
    
    /**
     * 分类ID
     */
    private Long id;
    
    /**
     * 父分类ID
     */
    private Long parentId;
    
    /**
     * 分类名称
     */
    private String categoryName;
    
    /**
     * 分类路径
     */
    private String categoryPath;
    
    /**
     * 分类描述
     */
    private String description;
    
    /**
     * 分类图标
     */
    private String icon;
    
    /**
     * 状态（0-禁用，1-启用）
     */
    private Integer status;
    
    /**
     * 状态名称
     */
    private String statusName;
    
    /**
     * 排序
     */
    private Integer sortOrder;
    
    /**
     * 题目数量
     */
    private Integer questionCount;
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    private LocalDateTime updateTime;
    
    /**
     * 子分类列表
     */
    private List<InterviewCategoryResponseDTO> children;
    
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

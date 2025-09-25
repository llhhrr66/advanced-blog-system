package com.blog.domain.dto;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 面试分类创建DTO
 */
@Data
@Schema(description = "面试分类创建请求")
public class InterviewCategoryCreateDTO {
    
    /**
     * 父分类ID
     */
    @Schema(description = "父分类ID", example = "0")
    private Long parentId;
    
    /**
     * 分类名称
     */
    @NotBlank(message = "分类名称不能为空")
    @Size(max = 50, message = "分类名称长度不能超过50个字符")
    @Schema(description = "分类名称", example = "Java基础")
    private String categoryName;
    
    /**
     * 分类路径
     */
    @Schema(description = "分类路径", example = "java-basic")
    private String categoryPath;
    
    /**
     * 分类描述
     */
    @Size(max = 200, message = "分类描述长度不能超过200个字符")
    @Schema(description = "分类描述", example = "Java基础知识相关面试题")
    private String description;
    
    /**
     * 分类图标
     */
    @Schema(description = "分类图标", example = "icon-java")
    private String icon;
    
    /**
     * 排序
     */
    @Schema(description = "排序优先级", example = "1")
    private Integer sortOrder;
    
    /**
     * 状态（0-禁用，1-启用）
     */
    @Schema(description = "状态：0-禁用，1-启用", example = "1")
    private Integer status = 1;
}

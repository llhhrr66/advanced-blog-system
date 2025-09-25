package com.blog.domain.dto;

import com.blog.domain.query.PageQuery;
import lombok.Data;
import lombok.EqualsAndHashCode;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 面试分类查询DTO
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "面试分类查询请求")
public class InterviewCategoryQueryDTO extends PageQuery {
    
    /**
     * 分类名称（模糊查询）
     */
    @Schema(description = "分类名称", example = "Java基础")
    private String categoryName;
    
    /**
     * 父分类ID
     */
    @Schema(description = "父分类ID", example = "1")
    private Long parentId;
    
    /**
     * 状态（0-禁用，1-启用）
     */
    @Schema(description = "状态：0-禁用，1-启用", example = "1")
    private Integer status;
}

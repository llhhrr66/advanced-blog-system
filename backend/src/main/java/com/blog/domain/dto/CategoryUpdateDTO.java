package com.blog.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * 分类更新请求DTO
 *
 * @author 梁俊荣
 * @since 2025-09-25
 */
@Data
@Accessors(chain = true)
@JsonIgnoreProperties(ignoreUnknown = true)
@Schema(description = "分类更新请求")
public class CategoryUpdateDTO {

    @NotNull(message = "分类ID不能为空")
    @Schema(description = "分类ID", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long id;

    @NotBlank(message = "分类名称不能为空")
    @Size(min = 1, max = 50, message = "分类名称长度必须在1-50字符之间")
    @Schema(description = "分类名称", example = "技术博客", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;

    @Size(max = 200, message = "分类描述长度不能超过200字符")
    @Schema(description = "分类描述", example = "技术相关文章分类")
    private String description;

    @Size(max = 100, message = "图标名称长度不能超过100字符")
    @Schema(description = "图标名称", example = "CodeOutlined")
    private String icon;

    @Schema(description = "排序值，数值越小排序越前", example = "1")
    private Integer sortOrder;
}

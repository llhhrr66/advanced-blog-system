package com.blog.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * 标签更新请求DTO
 *
 * @author 梁俊荣
 * @since 2025-09-25
 */
@Data
@Accessors(chain = true)
@JsonIgnoreProperties(ignoreUnknown = true)
@Schema(description = "标签更新请求")
public class TagUpdateDTO {

    @NotNull(message = "标签ID不能为空")
    @Schema(description = "标签ID", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long id;

    @NotBlank(message = "标签名称不能为空")
    @Size(min = 1, max = 30, message = "标签名称长度必须在1-30字符之间")
    @Schema(description = "标签名称", example = "Java", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;

    @Size(max = 200, message = "标签描述长度不能超过200字符")
    @Schema(description = "标签描述", example = "Java编程语言")
    private String description;

    @Size(min = 4, max = 7, message = "颜色值格式必须为 #xxxxxx")
    @Schema(description = "标签颜色(十六进制)", example = "#f50")
    private String color;
}

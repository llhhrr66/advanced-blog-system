package com.blog.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.Accessors;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * 文章状态变更请求DTO
 *
 * @author 梁俊荣
 * @since 2024-09-24
 */
@Data
@Accessors(chain = true)
@Schema(description = "文章状态变更请求")
public class ArticleStatusDTO {

    @NotNull(message = "文章ID不能为空")
    @Schema(description = "文章ID", example = "1", required = true)
    private Long id;

    @NotNull(message = "文章状态不能为空")
    @Schema(description = "文章状态：0-草稿，1-已发布，2-已下架", example = "1", required = true)
    private Integer status;

    @Schema(description = "发布时间（仅在发布时设置）", example = "2024-09-20T14:30:00")
    private LocalDateTime publishTime;

    @Schema(description = "状态变更原因/备注", example = "内容质量不符合规范")
    private String reason;
}

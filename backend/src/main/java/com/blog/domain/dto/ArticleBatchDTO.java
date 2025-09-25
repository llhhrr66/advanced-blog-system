package com.blog.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.Accessors;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import com.blog.enums.OperationType;

/**
 * 文章批量操作请求DTO
 *
 * @author 梁俊荣
 * @since 2024-09-24
 */
@Data
@Accessors(chain = true)
@Schema(description = "文章批量操作请求")
public class ArticleBatchDTO {

    @NotEmpty(message = "文章ID列表不能为空")
    @Schema(description = "文章ID列表", example = "[1, 2, 3]", required = true)
    private List<Long> ids;

    @NotNull(message = "操作类型不能为空")
    @Schema(description = "操作类型：1-批量发布，2-批量下架，3-批量删除，4-批量置顶，5-取消置顶，6-批量精选，7-取消精选，8-分类移动", 
            example = "BATCH_PUBLISH", required = true)
    private OperationType operationType;

    @Schema(description = "目标分类ID（仅分类移动时使用）", example = "2")
    private Long targetCategoryId;

    @Schema(description = "发布时间（仅批量发布时使用）", example = "2024-09-20T14:30:00")
    private LocalDateTime publishTime;

    @Schema(description = "操作原因/备注", example = "统一调整分类结构")
    private String reason;
}

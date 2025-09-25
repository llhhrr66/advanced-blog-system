package com.blog.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 文章统计响应DTO
 *
 * @author AI Assistant
 * @since 2025-01-25
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "文章统计信息")
public class ArticleStatsResponse {

    @Schema(description = "总文章数", example = "100")
    private Integer total;

    @Schema(description = "已发布文章数", example = "85")
    private Integer published;

    @Schema(description = "草稿文章数", example = "15")
    private Integer draft;

    @Schema(description = "总浏览量", example = "50000")
    private Long totalViews;

    @Schema(description = "总点赞数", example = "2500")
    private Long totalLikes;

    @Schema(description = "总评论数", example = "800")
    private Long totalComments;
}

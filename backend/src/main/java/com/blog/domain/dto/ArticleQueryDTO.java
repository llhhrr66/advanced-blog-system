package com.blog.domain.dto;

import com.blog.domain.query.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.time.LocalDate;

/**
 * 文章查询请求DTO
 * 
 * @author 梁俊荣
 * @since 2024-09-24
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@Schema(description = "文章查询请求")
public class ArticleQueryDTO extends PageQuery {

    @Schema(description = "关键字搜索（标题+内容）", example = "Spring Boot")
    private String keyword;

    @Schema(description = "分类ID", example = "1")
    private Long categoryId;

    @Schema(description = "文章状态：0-草稿，1-已发布，2-已下架", example = "1")
    private Integer status;

    @Schema(description = "作者ID", example = "2")
    private Long authorId;

    @Schema(description = "开始时间", example = "2024-09-01")
    private LocalDate startTime;

    @Schema(description = "结束时间", example = "2024-09-30")
    private LocalDate endTime;

    @Schema(description = "是否置顶", example = "true")
    private Boolean isTop;

    @Schema(description = "是否精选", example = "false")
    private Boolean isFeatured;

    @Schema(description = "是否允许评论", example = "true")
    private Boolean allowComment;

    @Schema(description = "文章类型：1-原创，2-转载，3-翻译", example = "1")
    private Integer articleType;

    @Schema(description = "标签ID集合", example = "[1, 2, 3]")
    private Long[] tagIds;
}

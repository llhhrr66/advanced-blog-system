package com.blog.domain.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * 文章统计信息视图对象
 *
 * @author 梁俊荣
 * @since 2024-09-24
 */
@Data
@Accessors(chain = true)
@Schema(description = "文章统计信息")
public class ArticleStatsVO {

    @Schema(description = "文章总数", example = "1256")
    private Long total;

    @Schema(description = "已发布数量", example = "1089")
    private Long published;

    @Schema(description = "草稿数量", example = "145")
    private Long draft;

    @Schema(description = "已下架数量", example = "22")
    private Long unpublished;

    @Schema(description = "置顶文章数量", example = "5")
    private Long topCount;

    @Schema(description = "精选文章数量", example = "78")
    private Long featuredCount;

    @Schema(description = "今日新增文章数", example = "3")
    private Long todayCount;

    @Schema(description = "本周新增文章数", example = "12")
    private Long weekCount;

    @Schema(description = "本月新增文章数", example = "45")
    private Long monthCount;

    @Schema(description = "总浏览量", example = "1234567")
    private Long totalViews;

    @Schema(description = "总点赞数", example = "89456")
    private Long totalLikes;

    @Schema(description = "总评论数", example = "23456")
    private Long totalComments;

    @Schema(description = "总收藏数", example = "12345")
    private Long totalCollects;

    @Schema(description = "平均浏览量", example = "986")
    private Double avgViews;

    @Schema(description = "平均点赞数", example = "71")
    private Double avgLikes;

    @Schema(description = "平均评论数", example = "19")
    private Double avgComments;
}

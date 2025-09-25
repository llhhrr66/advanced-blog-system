package com.blog.domain.po;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.FieldFill;
import java.time.LocalDateTime;
import java.io.Serializable;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 文章主表，存储博客文章的所有基础信息和内容
 * </p>
 *
 * @author 梁俊荣
 * @since 2025-09-24
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("articles")
@Schema(description="文章主表，存储博客文章的所有基础信息和内容")
public class Articles implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @Schema(description = "文章标题，5-200字符，必填，用于显示和SEO")
    private String title;

    @Schema(description = "文章正文内容，Markdown格式，最大16MB")
    private String content;

    @Schema(description = "文章摘要，最大500字符，为空时自动从content提取前200字")
    private String summary;

    @Schema(description = "文章封面图URL，支持相对路径和绝对URL")
    private String coverImage;

    @Schema(description = "作者ID，关联users表，文章归属用户")
    private Long authorId;

    @Schema(description = "文章分类ID，关联categories表，可为空")
    private Long categoryId;

    @Schema(description = "发布状态：0-草稿，1-已发布，2-已下架，3-待审核")
    @TableField(fill = FieldFill.INSERT)
    private Integer status;

    @Schema(description = "是否置顶：0-普通文章，1-置顶文章")
    @TableField(fill = FieldFill.INSERT)
    private Boolean isTop;

    @Schema(description = "是否推荐")
    private Integer isRecommend;

    @Schema(description = "浏览次数，每次访问文章详情页+1")
    @TableField(fill = FieldFill.INSERT)
    private Long viewCount;

    @Schema(description = "点赞数量，与article_likes表保持同步")
    @TableField(fill = FieldFill.INSERT)
    private Long likeCount;

    @Schema(description = "评论数量，与comments表保持同步")
    @TableField(fill = FieldFill.INSERT)
    private Long commentCount;

    @Schema(description = "收藏数量，与article_collections表保持同步")
    @TableField(fill = FieldFill.INSERT)
    private Long collectCount;

    @Schema(description = "文章类型：1-原创，2-转载，3-翻译")
    private Integer articleType;

    @Schema(description = "原文链接，转载或翻译文章的源地址")
    private String originalUrl;

    @Schema(description = "SEO关键词，逗号分隔，最多10个关键词")
    private String keywords;

    @Schema(description = "SEO描述")
    private String description;

    @Schema(description = "文章发布时间，可预设未来时间实现定时发布")
    private LocalDateTime publishTime;

    @Schema(description = "文章创建时间，草稿创建时间")
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @Schema(description = "最后编辑时间")
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @Schema(description = "逻辑删除标记：0-未删除，1-已删除")
    @TableField(fill = FieldFill.INSERT)
    private Boolean deleted;


}

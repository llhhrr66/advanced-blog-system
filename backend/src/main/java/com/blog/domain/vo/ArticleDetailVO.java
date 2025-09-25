package com.blog.domain.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 文章详情视图对象
 *
 * @author 梁俊荣
 * @since 2024-09-24
 */
@Data
@Accessors(chain = true)
@Schema(description = "文章详情")
public class ArticleDetailVO {

    @Schema(description = "文章ID", example = "1")
    private Long id;

    @Schema(description = "文章标题", example = "Spring Boot 3.0 新特性详解")
    private String title;

    @Schema(description = "URL别名", example = "spring-boot-3-new-features")
    private String slug;

    @Schema(description = "文章内容(Markdown格式)")
    private String content;

    @Schema(description = "文章摘要", example = "Spring Boot 3.0带来了革命性的更新...")
    private String summary;

    @Schema(description = "封面图URL", example = "https://example.com/cover1.jpg")
    private String coverImage;

    @Schema(description = "作者信息")
    private AuthorDetailVO author;

    @Schema(description = "分类信息")
    private CategoryDetailVO category;

    @Schema(description = "标签列表")
    private List<TagDetailVO> tags;

    @Schema(description = "文章状态：0-草稿，1-已发布，2-已下架", example = "1")
    private Integer status;

    @Schema(description = "状态文本", example = "已发布")
    private String statusText;

    @Schema(description = "是否置顶", example = "false")
    private Boolean isTop;

    @Schema(description = "是否精选", example = "true")
    private Boolean isFeatured;

    @Schema(description = "是否允许评论", example = "true")
    private Boolean allowComment;

    @Schema(description = "文章类型：1-原创，2-转载，3-翻译", example = "1")
    private Integer articleType;

    @Schema(description = "文章类型文本", example = "原创")
    private String articleTypeText;

    @Schema(description = "原文链接（转载/翻译时使用）", example = "https://example.com/original-article")
    private String originalUrl;

    @Schema(description = "SEO关键词", example = "Spring Boot,Java,微服务")
    private String keywords;

    @Schema(description = "SEO描述")
    private String metaDescription;

    @Schema(description = "浏览次数", example = "5234")
    private Long viewCount;

    @Schema(description = "点赞数量", example = "128")
    private Long likeCount;

    @Schema(description = "评论数量", example = "32")
    private Long commentCount;

    @Schema(description = "收藏数量", example = "89")
    private Long collectCount;

    @Schema(description = "分享数量", example = "45")
    private Long shareCount;

    @Schema(description = "发布时间", example = "2024-09-20T14:30:00")
    private LocalDateTime publishTime;

    @Schema(description = "创建时间", example = "2024-09-20T10:00:00")
    private LocalDateTime createTime;

    @Schema(description = "更新时间", example = "2024-09-20T14:30:00")
    private LocalDateTime updateTime;

    @Schema(description = "相关文章推荐列表（最多5篇）")
    private List<RelatedArticleVO> relatedArticles;

    /**
     * 作者详细信息
     */
    @Data
    @Accessors(chain = true)
    @Schema(description = "作者详细信息")
    public static class AuthorDetailVO {
        
        @Schema(description = "作者ID", example = "2")
        private Long id;

        @Schema(description = "作者昵称", example = "技术小哥")
        private String nickname;

        @Schema(description = "作者头像", example = "https://example.com/avatar2.jpg")
        private String avatar;

        @Schema(description = "作者简介", example = "10年Java开发经验，专注Spring生态研究")
        private String bio;

        @Schema(description = "作者签名", example = "代码改变世界")
        private String signature;

        @Schema(description = "文章数量", example = "156")
        private Integer articleCount;

        @Schema(description = "粉丝数量", example = "2340")
        private Integer fansCount;
    }

    /**
     * 分类详细信息
     */
    @Data
    @Accessors(chain = true)
    @Schema(description = "分类详细信息")
    public static class CategoryDetailVO {
        
        @Schema(description = "分类ID", example = "1")
        private Long id;

        @Schema(description = "分类名称", example = "后端开发")
        private String name;

        @Schema(description = "分类别名", example = "backend")
        private String slug;

        @Schema(description = "分类描述", example = "专注后端技术分享")
        private String description;

        @Schema(description = "分类颜色", example = "#1890ff")
        private String color;

        @Schema(description = "分类下文章数量", example = "89")
        private Integer articleCount;
    }

    /**
     * 标签详细信息
     */
    @Data
    @Accessors(chain = true)
    @Schema(description = "标签详细信息")
    public static class TagDetailVO {
        
        @Schema(description = "标签ID", example = "1")
        private Long id;

        @Schema(description = "标签名称", example = "Java")
        private String name;

        @Schema(description = "标签别名", example = "java")
        private String slug;

        @Schema(description = "标签描述", example = "Java相关技术文章")
        private String description;

        @Schema(description = "标签颜色", example = "#f50")
        private String color;

        @Schema(description = "标签下文章数量", example = "234")
        private Integer articleCount;
    }

    /**
     * 相关文章信息
     */
    @Data
    @Accessors(chain = true)
    @Schema(description = "相关文章")
    public static class RelatedArticleVO {
        
        @Schema(description = "文章ID", example = "3")
        private Long id;

        @Schema(description = "文章标题", example = "Spring Boot 2.x 升级指南")
        private String title;

        @Schema(description = "URL别名", example = "spring-boot-upgrade-guide")
        private String slug;

        @Schema(description = "封面图", example = "https://example.com/cover3.jpg")
        private String coverImage;

        @Schema(description = "浏览量", example = "3456")
        private Long viewCount;

        @Schema(description = "发布时间", example = "2024-09-18T16:20:00")
        private LocalDateTime publishTime;
    }
}

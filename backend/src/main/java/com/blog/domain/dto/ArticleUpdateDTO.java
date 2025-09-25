package com.blog.domain.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.Accessors;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 文章更新请求DTO
 *
 * @author 梁俊荣
 * @since 2024-09-24
 */
@Data
@Accessors(chain = true)
@JsonIgnoreProperties(ignoreUnknown = true)
@Schema(description = "文章更新请求")
public class ArticleUpdateDTO {

    @NotNull(message = "文章ID不能为空")
    @Schema(description = "文章ID", example = "1", required = true)
    private Long id;

    @NotBlank(message = "文章标题不能为空")
    @Size(min = 1, max = 100, message = "文章标题长度在1-100字符之间")
    @Schema(description = "文章标题", example = "Spring Boot 3.0 新特性详解", required = true)
    private String title;

    @Size(max = 100, message = "URL别名长度不能超过100字符")
    @Schema(description = "URL别名", example = "spring-boot-3-new-features")
    private String slug;

    @Schema(description = "文章内容(Markdown格式)", required = true)
    private String content;

    @Size(max = 500, message = "摘要长度不能超过500字符")
    @Schema(description = "文章摘要", example = "Spring Boot 3.0带来了革命性的更新...")
    private String summary;

    @Schema(description = "封面图URL", example = "https://example.com/cover1.jpg")
    private String coverImage;

    @Schema(description = "分类ID", example = "1")
    private Long categoryId;

    @Schema(description = "标签ID列表", example = "[1, 2, 3]")
    private List<Long> tagIds;

    @Schema(description = "文章状态：0-草稿，1-已发布，2-已下架", example = "1")
    private Integer status;

    @Schema(description = "是否置顶", example = "false")
    private Boolean isTop;

    @JsonAlias({"isRecommend"})
    @Schema(description = "是否精选", example = "true")
    private Boolean isFeatured;

    @Schema(description = "是否允许评论", example = "true")
    private Boolean allowComment;

    @Schema(description = "文章类型：1-原创，2-转载，3-翻译", example = "1")
    private Integer articleType;

    @Schema(description = "原文链接（转载/翻译时使用）", example = "https://example.com/original-article")
    private String originalUrl;

    @Size(max = 200, message = "SEO关键词长度不能超过200字符")
    @Schema(description = "SEO关键词", example = "Spring Boot,Java,微服务")
    private String keywords;

    @Size(max = 300, message = "SEO描述长度不能超过300字符")
    @Schema(description = "SEO描述", example = "详细介绍Spring Boot 3.0的新特性和升级要点")
    private String metaDescription;

    @Schema(description = "发布时间", example = "2024-09-20T14:30:00")
    private LocalDateTime publishTime;
}

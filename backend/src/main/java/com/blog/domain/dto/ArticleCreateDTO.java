package com.blog.domain.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 文章创建请求DTO
 *
 * @author 梁俊荣
 * @since 2024-09-24
 */
@Data
@Accessors(chain = true)
@JsonIgnoreProperties(ignoreUnknown = true)
@Schema(description = "文章创建请求")
public class ArticleCreateDTO {

    @NotBlank(message = "文章标题不能为空")
    @Size(min = 5, max = 200, message = "文章标题长度必须在5-200字符之间")
    @Schema(description = "文章标题", example = "Spring Boot 3.0 新特性详解", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @Size(max = 300, message = "URL别名长度不能超过300字符")
    @Schema(description = "URL别名，为空时自动生成", example = "spring-boot-3-new-features")
    private String slug;

    @Schema(description = "文章内容，Markdown格式", example = "# 文章内容\\n\\n这是文章正文...")
    private String content;

    @Size(max = 500, message = "文章摘要长度不能超过500字符")
    @Schema(description = "文章摘要，为空时自动提取前200字", example = "Spring Boot 3.0带来了革命性的更新...")
    private String summary;

    @Size(max = 500, message = "封面图URL长度不能超过500字符")
    @Schema(description = "封面图URL", example = "https://example.com/cover.jpg")
    private String coverImage;

    @Schema(description = "分类ID", example = "1")
    private Long categoryId;

    @Schema(description = "标签ID数组", example = "[1, 2, 3]")
    private List<Long> tagIds;

    @Schema(description = "文章状态：0-草稿，1-已发布，2-已下架", example = "0")
    private Integer status = 0;

    @Schema(description = "是否置顶", example = "false")
    private Boolean isTop = false;

    @JsonAlias({"isRecommend"})
    @Schema(description = "是否精选", example = "false")
    private Boolean isFeatured = false;

    @Schema(description = "是否允许评论", example = "true")
    private Boolean allowComment = true;

    @Schema(description = "文章类型：1-原创，2-转载，3-翻译", example = "1")
    private Integer articleType = 1;

    @Size(max = 500, message = "原文链接长度不能超过500字符")
    @Schema(description = "原文链接（转载/翻译时填写）", example = "https://example.com/original-article")
    private String originalUrl;

    @Size(max = 500, message = "SEO关键词长度不能超过500字符")
    @Schema(description = "SEO关键词，逗号分隔，最多10个", example = "Spring Boot,Java,后端开发")
    private String keywords;

    @Size(max = 160, message = "SEO描述长度不能超过160字符")
    @Schema(description = "SEO描述，最大160字符", example = "Spring Boot 3.0新特性详解，包含Native Image支持等核心更新")
    private String metaDescription;

    @Schema(description = "发布时间，支持定时发布", example = "2024-09-25T14:00:00")
    private LocalDateTime publishTime;
}

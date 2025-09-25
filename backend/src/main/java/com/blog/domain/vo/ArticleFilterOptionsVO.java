package com.blog.domain.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * 文章筛选选项视图对象
 *
 * @author 梁俊荣
 * @since 2024-09-24
 */
@Data
@Accessors(chain = true)
@Schema(description = "文章筛选选项")
public class ArticleFilterOptionsVO {

    @Schema(description = "分类选项列表")
    private List<CategoryOptionVO> categories;

    @Schema(description = "标签选项列表")
    private List<TagOptionVO> tags;

    @Schema(description = "作者选项列表")
    private List<AuthorOptionVO> authors;

    @Schema(description = "状态选项列表")
    private List<StatusOptionVO> statuses;

    @Schema(description = "文章类型选项列表")
    private List<TypeOptionVO> articleTypes;

    /**
     * 分类选项
     */
    @Data
    @Accessors(chain = true)
    @Schema(description = "分类选项")
    public static class CategoryOptionVO {
        
        @Schema(description = "分类ID", example = "1")
        private Long id;

        @Schema(description = "分类名称", example = "后端开发")
        private String name;

        @Schema(description = "分类别名", example = "backend")
        private String slug;

        @Schema(description = "分类颜色", example = "#1890ff")
        private String color;

        @Schema(description = "文章数量", example = "89")
        private Integer articleCount;
    }

    /**
     * 标签选项
     */
    @Data
    @Accessors(chain = true)
    @Schema(description = "标签选项")
    public static class TagOptionVO {
        
        @Schema(description = "标签ID", example = "1")
        private Long id;

        @Schema(description = "标签名称", example = "Java")
        private String name;

        @Schema(description = "标签别名", example = "java")
        private String slug;

        @Schema(description = "标签颜色", example = "#f50")
        private String color;

        @Schema(description = "文章数量", example = "234")
        private Integer articleCount;
    }

    /**
     * 作者选项
     */
    @Data
    @Accessors(chain = true)
    @Schema(description = "作者选项")
    public static class AuthorOptionVO {
        
        @Schema(description = "作者ID", example = "2")
        private Long id;

        @Schema(description = "作者昵称", example = "技术小哥")
        private String nickname;

        @Schema(description = "作者头像", example = "https://example.com/avatar2.jpg")
        private String avatar;

        @Schema(description = "文章数量", example = "156")
        private Integer articleCount;
    }

    /**
     * 状态选项
     */
    @Data
    @Accessors(chain = true)
    @Schema(description = "状态选项")
    public static class StatusOptionVO {
        
        @Schema(description = "状态值", example = "1")
        private Integer value;

        @Schema(description = "状态文本", example = "已发布")
        private String text;

        @Schema(description = "文章数量", example = "1089")
        private Integer count;
    }

    /**
     * 文章类型选项
     */
    @Data
    @Accessors(chain = true)
    @Schema(description = "文章类型选项")
    public static class TypeOptionVO {
        
        @Schema(description = "类型值", example = "1")
        private Integer value;

        @Schema(description = "类型文本", example = "原创")
        private String text;

        @Schema(description = "文章数量", example = "987")
        private Integer count;
    }
}

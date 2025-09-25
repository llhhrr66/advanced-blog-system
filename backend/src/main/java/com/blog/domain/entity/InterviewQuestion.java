package com.blog.domain.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 面试题实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("interview_question")
public class InterviewQuestion implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 分类ID
     */
    @TableField("category_id")
    private Long categoryId;

    /**
     * 题目标题
     */
    @TableField("title")
    private String title;

    /**
     * 题目内容（Markdown格式）
     */
    @TableField("content")
    private String content;

    /**
     * 题目内容（HTML格式）
     */
    @TableField("content_html")
    private String contentHtml;

    /**
     * 难度等级（1-简单，2-中等，3-困难）
     */
    @TableField("difficulty")
    private Integer difficulty;

    /**
     * 来源
     */
    @TableField("source")
    private String source;

    /**
     * 来源URL
     */
    @TableField("source_url")
    private String sourceUrl;

    /**
     * 文件路径
     */
    @TableField("file_path")
    private String filePath;

    /**
     * 浏览数
     */
    @TableField("view_count")
    private Integer viewCount;

    /**
     * 点赞数
     */
    @TableField("like_count")
    private Integer likeCount;

    /**
     * 收藏数
     */
    @TableField("collect_count")
    private Integer collectCount;

    /**
     * 评论数
     */
    @TableField("comment_count")
    private Integer commentCount;

    /**
     * 排序
     */
    @TableField("sort_order")
    private Integer sortOrder;

    /**
     * 状态（0-禁用，1-启用）
     */
    @TableField("status")
    private Integer status;

    /**
     * 导入时间
     */
    @TableField("import_time")
    private LocalDateTime importTime;

    /**
     * 最后更新时间
     */
    @TableField("last_update_time")
    private LocalDateTime lastUpdateTime;

    /**
     * 创建人
     */
    @TableField("create_by")
    private Long createBy;

    /**
     * 更新人
     */
    @TableField("update_by")
    private Long updateBy;

    /**
     * 创建时间
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 逻辑删除
     */
    @TableLogic
    @TableField("is_deleted")
    private Boolean isDeleted;
}

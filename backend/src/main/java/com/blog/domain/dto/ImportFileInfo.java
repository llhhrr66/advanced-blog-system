package com.blog.domain.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

/**
 * 导入的Markdown文件信息
 * 
 * @author 梁俊荣
 * @since 2025-09-25
 */
@Data
public class ImportFileInfo {
    /**
     * 文件唯一标识
     */
    private String id;
    
    /**
     * 文件名
     */
    private String name;
    
    /**
     * 文件路径
     */
    private String path;
    
    /**
     * 文件大小
     */
    private Long size;
    
    /**
     * 文件内容
     */
    private String content;
    
    /**
     * Frontmatter元数据
     */
    private Map<String, Object> frontmatter;
    
    /**
     * 文章标题
     */
    private String title;
    
    /**
     * 分类名称
     */
    private String category;
    
    /**
     * 标签列表
     */
    private List<String> tags;
    
    /**
     * 创建时间
     */
    private String createTime;
    
    /**
     * 更新时间
     */
    private String updateTime;
    
    /**
     * 原文链接
     */
    private String originalUrl;
    
    /**
     * 是否选中导入
     */
    private Boolean selected = true;
    
    /**
     * 导入状态: pending/success/error/skipped
     */
    private String status = "pending";
    
    /**
     * 错误信息
     */
    private String error;
}

package com.blog.domain.dto;

import lombok.Data;
import java.util.Map;

/**
 * 导入配置
 * 
 * @author 梁俊荣
 * @since 2025-09-25
 */
@Data
public class ImportConfig {
    /**
     * 重复处理模式: skip/overwrite/update
     */
    private String mode = "skip";
    
    /**
     * 是否自动创建分类
     */
    private Boolean createCategories = true;
    
    /**
     * 是否自动创建标签
     */
    private Boolean createTags = true;
    
    /**
     * 默认文章状态：0-草稿，1-发布
     */
    private Integer defaultStatus = 0;
    
    /**
     * 分类映射 (前端分类名 -> 后端分类ID)
     */
    private Map<String, Long> categoryMapping;
    
    /**
     * 标签映射 (前端标签名 -> 后端标签ID)
     */
    private Map<String, Long> tagMapping;
    
    /**
     * 是否保留原始时间
     */
    private Boolean preserveTime = true;
    
    /**
     * 批量处理大小
     */
    private Integer batchSize = 10;
    
    /**
     * 默认分类 ID
     */
    private Long defaultCategoryId;
}

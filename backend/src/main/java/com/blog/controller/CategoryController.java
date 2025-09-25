package com.blog.controller;

import com.blog.common.Result;
import com.blog.domain.dto.CategoryCreateDTO;
import com.blog.domain.dto.CategoryUpdateDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 分类管理控制器
 * 
 * @author 梁俊荣
 * @since 2025-09-24
 */
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "分类管理", description = "分类的增删改查操作")
public class CategoryController {

    // 使用内存存储模拟数据库
    private static final Map<Long, Map<String, Object>> categories = new ConcurrentHashMap<>();
    private static final AtomicLong idGenerator = new AtomicLong(3);
    
    // 初始化测试数据
    static {
        categories.put(1L, Map.of(
            "id", 1L,
            "name", "技术博客",
            "description", "技术相关文章",
            "icon", "CodeOutlined",
            "sortOrder", 1,
            "articleCount", 5,
            "createTime", LocalDateTime.now().toString(),
            "updateTime", LocalDateTime.now().toString()
        ));
        categories.put(2L, Map.of(
            "id", 2L,
            "name", "生活随笔",
            "description", "生活感悟和随笔",
            "icon", "EditOutlined",
            "sortOrder", 2,
            "articleCount", 3,
            "createTime", LocalDateTime.now().toString(),
            "updateTime", LocalDateTime.now().toString()
        ));
        categories.put(3L, Map.of(
            "id", 3L,
            "name", "学习笔记",
            "description", "学习过程中的笔记和总结",
            "icon", "BookOutlined",
            "sortOrder", 3,
            "articleCount", 8,
            "createTime", LocalDateTime.now().toString(),
            "updateTime", LocalDateTime.now().toString()
        ));
    }

    @GetMapping
    @Operation(summary = "获取分类列表", description = "获取所有分类信息")
    public Result<List<Map<String, Object>>> getCategories(
            @Parameter(description = "是否包含文章数量统计")
            @RequestParam(required = false) Boolean includeArticleCount) {
        
        List<Map<String, Object>> result = categories.values().stream()
            .sorted((a, b) -> ((Integer) a.get("sortOrder")).compareTo((Integer) b.get("sortOrder")))
            .map(category -> {
                Map<String, Object> item = new ConcurrentHashMap<>(category);
                if (includeArticleCount == null || !includeArticleCount) {
                    item.remove("articleCount");
                }
                return item;
            })
            .toList();
            
        return Result.success(result);
    }

    @PostMapping
    @Operation(summary = "创建分类", description = "创建新的分类")
    public Result<Map<String, Object>> createCategory(@Valid @RequestBody CategoryCreateDTO createDTO) {
        Long newId = idGenerator.incrementAndGet();
        String now = LocalDateTime.now().toString();
        
        Map<String, Object> newCategory = Map.of(
            "id", newId,
            "name", createDTO.getName(),
            "description", createDTO.getDescription() != null ? createDTO.getDescription() : "",
            "icon", createDTO.getIcon() != null ? createDTO.getIcon() : "FolderOutlined",
            "sortOrder", createDTO.getSortOrder() != null ? createDTO.getSortOrder() : 0,
            "articleCount", 0,
            "createTime", now,
            "updateTime", now
        );
        
        categories.put(newId, newCategory);
        return Result.success(newCategory);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新分类", description = "根据ID更新分类信息")
    public Result<Map<String, Object>> updateCategory(
            @Parameter(description = "分类ID") @PathVariable Long id, 
            @Valid @RequestBody CategoryUpdateDTO updateDTO) {
        
        Map<String, Object> existingCategory = categories.get(id);
        if (existingCategory == null) {
            return Result.error("分类不存在");
        }
        
        Map<String, Object> updatedCategory = new ConcurrentHashMap<>(existingCategory);
        updatedCategory.put("name", updateDTO.getName());
        updatedCategory.put("description", updateDTO.getDescription() != null ? updateDTO.getDescription() : "");
        updatedCategory.put("icon", updateDTO.getIcon() != null ? updateDTO.getIcon() : "FolderOutlined");
        updatedCategory.put("sortOrder", updateDTO.getSortOrder() != null ? updateDTO.getSortOrder() : 0);
        updatedCategory.put("updateTime", LocalDateTime.now().toString());
        
        categories.put(id, updatedCategory);
        return Result.success(updatedCategory);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除分类", description = "根据ID删除分类")
    public Result<Void> deleteCategory(@Parameter(description = "分类ID") @PathVariable Long id) {
        Map<String, Object> existingCategory = categories.get(id);
        if (existingCategory == null) {
            return Result.error("分类不存在");
        }
        
        categories.remove(id);
        return Result.success();
    }
}

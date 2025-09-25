package com.blog.controller;

import com.blog.common.Result;
import com.blog.domain.dto.TagCreateDTO;
import com.blog.domain.dto.TagUpdateDTO;
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
 * 标签管理控制器
 * 
 * @author 梁俊荣
 * @since 2025-09-24
 */
@RestController
@RequestMapping("/tags")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "标签管理", description = "标签的增删改查操作")
public class TagController {

    // 使用内存存储模拟数据库
    private static final Map<Long, Map<String, Object>> tags = new ConcurrentHashMap<>();
    private static final AtomicLong idGenerator = new AtomicLong(5);
    
    // 初始化测试数据
    static {
        tags.put(1L, Map.of(
            "id", 1L,
            "name", "Java",
            "color", "#f50",
            "description", "Java编程语言",
            "useCount", 10,
            "createTime", LocalDateTime.now().toString(),
            "updateTime", LocalDateTime.now().toString()
        ));
        tags.put(2L, Map.of(
            "id", 2L,
            "name", "Spring Boot",
            "color", "#2db7f5",
            "description", "Spring Boot框架",
            "useCount", 8,
            "createTime", LocalDateTime.now().toString(),
            "updateTime", LocalDateTime.now().toString()
        ));
        tags.put(3L, Map.of(
            "id", 3L,
            "name", "前端开发",
            "color", "#87d068",
            "description", "前端开发相关",
            "useCount", 6,
            "createTime", LocalDateTime.now().toString(),
            "updateTime", LocalDateTime.now().toString()
        ));
        tags.put(4L, Map.of(
            "id", 4L,
            "name", "React",
            "color", "#108ee9",
            "description", "React框架",
            "useCount", 5,
            "createTime", LocalDateTime.now().toString(),
            "updateTime", LocalDateTime.now().toString()
        ));
        tags.put(5L, Map.of(
            "id", 5L,
            "name", "数据库",
            "color", "#f56a00",
            "description", "数据库相关",
            "useCount", 7,
            "createTime", LocalDateTime.now().toString(),
            "updateTime", LocalDateTime.now().toString()
        ));
    }

    @GetMapping
    @Operation(summary = "获取标签列表", description = "获取所有标签信息")
    public Result<List<Map<String, Object>>> getTags() {
        List<Map<String, Object>> result = tags.values().stream()
            .sorted((a, b) -> ((Integer) b.get("useCount")).compareTo((Integer) a.get("useCount")))
            .toList();
            
        return Result.success(result);
    }

    @GetMapping("/hot")
    @Operation(summary = "获取热门标签", description = "获取使用次数最多的标签")
    public Result<List<Map<String, Object>>> getHotTags() {
        List<Map<String, Object>> hotTags = tags.values().stream()
            .sorted((a, b) -> ((Integer) b.get("useCount")).compareTo((Integer) a.get("useCount")))
            .limit(10) // 只返回前10个热门标签
            .toList();
        
        return Result.success(hotTags);
    }

    @PostMapping
    @Operation(summary = "创建标签", description = "创建新的标签")
    public Result<Map<String, Object>> createTag(@Valid @RequestBody TagCreateDTO createDTO) {
        Long newId = idGenerator.incrementAndGet();
        String now = LocalDateTime.now().toString();
        
        Map<String, Object> newTag = Map.of(
            "id", newId,
            "name", createDTO.getName(),
            "description", createDTO.getDescription() != null ? createDTO.getDescription() : "",
            "color", createDTO.getColor() != null ? createDTO.getColor() : "#1890ff",
            "useCount", 0,
            "createTime", now,
            "updateTime", now
        );
        
        tags.put(newId, newTag);
        return Result.success(newTag);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新标签", description = "根据ID更新标签信息")
    public Result<Map<String, Object>> updateTag(
            @Parameter(description = "标签ID") @PathVariable Long id,
            @Valid @RequestBody TagUpdateDTO updateDTO) {
        
        Map<String, Object> existingTag = tags.get(id);
        if (existingTag == null) {
            return Result.error("标签不存在");
        }
        
        Map<String, Object> updatedTag = new ConcurrentHashMap<>(existingTag);
        updatedTag.put("name", updateDTO.getName());
        updatedTag.put("description", updateDTO.getDescription() != null ? updateDTO.getDescription() : "");
        updatedTag.put("color", updateDTO.getColor() != null ? updateDTO.getColor() : "#1890ff");
        updatedTag.put("updateTime", LocalDateTime.now().toString());
        
        tags.put(id, updatedTag);
        return Result.success(updatedTag);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除标签", description = "根据ID删除标签")
    public Result<Void> deleteTag(@Parameter(description = "标签ID") @PathVariable Long id) {
        Map<String, Object> existingTag = tags.get(id);
        if (existingTag == null) {
            return Result.error("标签不存在");
        }
        
        tags.remove(id);
        return Result.success();
    }
}

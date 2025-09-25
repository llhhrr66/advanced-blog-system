package com.blog.controller;

import com.blog.common.exception.BusinessException;
import com.blog.common.result.Result;
import com.blog.common.result.ResultEnum;
import com.blog.domain.dto.*;
import com.blog.domain.entity.InterviewCategory;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.blog.service.IInterviewCategoryService;
import com.blog.utils.InterviewConvertUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotBlank;

import java.util.List;
import java.util.Map;

/**
 * 面试分类Controller
 */
@Tag(name = "面试分类管理")
@RestController
@RequestMapping("/interview/categories")
@Validated
@RequiredArgsConstructor
public class InterviewCategoryController {
    
    @Autowired
    private IInterviewCategoryService interviewCategoryService;
    
    /**
     * 获取所有分类
     */
    @Operation(summary = "分页查询面试分类")
    @GetMapping
    public Result<List<InterviewCategoryResponseDTO>> getAllCategories() {
        List<InterviewCategoryResponseDTO> categories = InterviewConvertUtils.toResponseDTOList(
            interviewCategoryService.getAllCategories());
        return Result.success(categories);
    }
    
    /**
     * 分页查询分类列表
     */
    @Operation(summary = "分页查询分类列表")
    @GetMapping("/list")
    public Result<PageDTO<InterviewCategoryResponseDTO>> getCategoriesList(
            @Parameter(description = "页码", required = false) @RequestParam(defaultValue = "1") Integer pageNum,
            @Parameter(description = "页面大小", required = false) @RequestParam(defaultValue = "10") Integer pageSize,
            @Parameter(description = "关键词", required = false) @RequestParam(required = false) String keyword,
            @Parameter(description = "父分类ID", required = false) @RequestParam(required = false) Long parentId) {
        
        InterviewCategoryQueryDTO queryDTO = new InterviewCategoryQueryDTO();
        queryDTO.setPageNo(pageNum);
        queryDTO.setPageSize(pageSize);
        queryDTO.setCategoryName(keyword);
        queryDTO.setParentId(parentId);
        
        IPage<InterviewCategory> categoryPage = interviewCategoryService.getCategoriesPage(queryDTO);
        List<InterviewCategoryResponseDTO> responseDTOList = InterviewConvertUtils.toResponseDTOList(categoryPage.getRecords());
        PageDTO<InterviewCategoryResponseDTO> pageDTO = new PageDTO<>(
                categoryPage.getTotal(),
                categoryPage.getPages(),
                responseDTOList);
        
        return Result.success(pageDTO);
    }
    
    /**
     * 获取启用的分类
     */
    @Operation(summary = "获取所有面试分类")
    @GetMapping("/enabled")
    public Result<List<InterviewCategoryResponseDTO>> getEnabledCategories() {
        List<InterviewCategoryResponseDTO> categories = InterviewConvertUtils.toResponseDTOList(
            interviewCategoryService.getEnabledCategories());
        return Result.success(categories);
    }
    
    /**
     * 根据ID查询分类详情
     */
    @Operation(summary = "根据ID获取面试分类")
    @GetMapping("/{id}")
    public Result<InterviewCategoryResponseDTO> getById(
            @Parameter(description = "分类ID", required = true) @PathVariable @NotNull Long id) {
        InterviewCategoryResponseDTO category = InterviewConvertUtils.toResponseDTO(
            interviewCategoryService.getCategoryById(id));
        return Result.success(category);
    }
    
    /**
     * 创建分类
     */
    @Operation(summary = "创建面试分类")
    @PostMapping
    public Result<InterviewCategoryResponseDTO> create(@RequestBody InterviewCategoryCreateDTO createDTO) {
        InterviewCategoryResponseDTO responseDTO = InterviewConvertUtils.toResponseDTO(
            interviewCategoryService.create(createDTO));
        return Result.success(responseDTO);
    }
    
    /**
     * 更新分类
     */
    @Operation(summary = "更新面试分类")
    @PutMapping("/{id}")
    public Result<InterviewCategoryResponseDTO> update(
            @Parameter(description = "分类ID", required = true) @PathVariable @NotNull Long id,
            @RequestBody InterviewCategoryUpdateDTO updateDTO) {
        updateDTO.setId(id);
        InterviewCategoryResponseDTO responseDTO = InterviewConvertUtils.toResponseDTO(
            interviewCategoryService.updateCategory(id, updateDTO));
        return Result.success(responseDTO);
    }
    
    /**
     * 根据ID删除面试分类
     */
    @Operation(summary = "根据ID删除面试分类")
    @DeleteMapping("/{id}")
    public Result<Void> deleteById(
            @Parameter(description = "分类ID", required = true) @PathVariable @NotNull Long id) {
        interviewCategoryService.deleteById(id);
        return Result.success();
    }
    
    /**
     * 批量删除面试分类
     */
    @Operation(summary = "批量删除面试分类")
    @DeleteMapping("/batch")
    public Result<Void> batchDelete(@RequestBody @NotEmpty List<Long> ids) {
        interviewCategoryService.batchDelete(ids);
        return Result.success();
    }
    
    /**
     * 切换面试分类状态
     */
    @Operation(summary = "切换面试分类状态")
    @PutMapping("/{id}/status")
    public Result<Void> toggleStatus(
            @NotEmpty @RequestParam("ids") List<Long> ids,
            @Parameter(description = "状态", required = true) @RequestParam @NotNull Boolean enabled) {
        interviewCategoryService.toggleStatus(ids, enabled);
        return Result.success();
    }
    
    /**
     * 根据名称搜索面试分类
     */
    @Operation(summary = "根据名称搜索面试分类")
    @GetMapping("/search")
    public Result<List<InterviewCategoryResponseDTO>> searchByName(
            @Parameter(description = "分类名称", required = true) @RequestParam @NotBlank String name) {
        List<InterviewCategoryResponseDTO> categories = InterviewConvertUtils.toResponseDTOList(
            interviewCategoryService.searchByName(name));
        return Result.success(categories);
    }
    
    /**
     * 检查分类名称是否存在
     */
    @Operation(summary = "检查分类名称是否存在")
    @GetMapping("/exists")
    public Result<Boolean> existsByName(
            @Parameter(description = "分类名称", required = true) @RequestParam @NotBlank String name,
            @Parameter(description = "排除的ID", required = false) @RequestParam(required = false) Long excludeId) {
        boolean exists = interviewCategoryService.existsByName(name, excludeId);
        return Result.success(exists);
    }
}

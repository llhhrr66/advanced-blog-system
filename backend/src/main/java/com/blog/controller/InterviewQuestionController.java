package com.blog.controller;

import com.blog.common.result.Result;
import com.blog.domain.dto.InterviewQuestionCreateDTO;
import com.blog.domain.dto.InterviewQuestionQueryDTO;
import com.blog.domain.dto.InterviewQuestionResponseDTO;
import com.blog.domain.dto.InterviewQuestionUpdateDTO;
import com.blog.domain.dto.PageDTO;
import com.blog.domain.entity.InterviewQuestion;
import com.blog.service.IInterviewQuestionService;
import com.blog.utils.InterviewConvertUtils;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.core.metadata.IPage;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

/**
 * 面试题目Controller
 */
@Tag(name = "面试题目管理")
@RestController
@RequestMapping("/interview/questions")
@Validated
@RequiredArgsConstructor
public class InterviewQuestionController {
    
    private final IInterviewQuestionService interviewQuestionService;
    
    /**
     * 分页查询面试题目
     */
    @Operation(summary = "分页查询面试题目")
    @GetMapping
    public Result<Page<InterviewQuestionResponseDTO>> getQuestionsByPage(
            @Parameter(description = "当前页", required = false) @RequestParam(defaultValue = "1") Integer pageNum,
            @Parameter(description = "页面大小", required = false) @RequestParam(defaultValue = "10") Integer pageSize,
            @Parameter(description = "分类ID", required = false) @RequestParam(required = false) Long categoryId,
            @Parameter(description = "关键词", required = false) @RequestParam(required = false) String keyword,
            @Parameter(description = "难度等级", required = false) @RequestParam(required = false) Integer difficulty,
            @Parameter(description = "状态", required = false) @RequestParam(required = false) Integer status) {
        
        InterviewQuestionQueryDTO queryDTO = new InterviewQuestionQueryDTO();
        queryDTO.setPageNo(pageNum);
        queryDTO.setPageSize(pageSize);
        queryDTO.setCategoryId(categoryId);
        queryDTO.setTitle(keyword);
        queryDTO.setDifficultyLevel(difficulty);
        queryDTO.setStatus(status);
        
        IPage<InterviewQuestion> questionPage = interviewQuestionService.getQuestionsByPage(queryDTO);
        Page<InterviewQuestionResponseDTO> page = new Page<>(questionPage.getCurrent(), questionPage.getSize(), questionPage.getTotal());
        page.setRecords(InterviewConvertUtils.toQuestionResponseDTOList(questionPage.getRecords()));
        return Result.success(page);
    }
    
    /**
     * 根据ID获取题目详情
     */
    @Operation(summary = "根据ID获取面试题目")
    @GetMapping("/{id}")
    public Result<InterviewQuestionResponseDTO> getById(
            @Parameter(description = "题目ID", required = true) @PathVariable @NotNull Long id) {
        InterviewQuestionResponseDTO question = InterviewConvertUtils.toResponseDTO(
            interviewQuestionService.getQuestionById(id));
        return Result.success(question);
    }
    
    /**
     * 创建面试题目
     */
    @Operation(summary = "创建面试题目")
    @PostMapping
    public Result<InterviewQuestionResponseDTO> create(@Valid @RequestBody InterviewQuestionCreateDTO createDTO) {
        InterviewQuestionResponseDTO responseDTO = InterviewConvertUtils.toResponseDTO(
            interviewQuestionService.create(createDTO));
        return Result.success(responseDTO);
    }
    
    /**
     * 更新面试题目
     */
    @Operation(summary = "更新面试题目")
    @PutMapping("/{id}")
    public Result<InterviewQuestionResponseDTO> update(
            @Parameter(description = "题目ID", required = true) @PathVariable @NotNull Long id,
            @Valid @RequestBody InterviewQuestionUpdateDTO updateDTO) {
        InterviewQuestionResponseDTO responseDTO = InterviewConvertUtils.toResponseDTO(
            interviewQuestionService.updateQuestion(id, updateDTO));
        return Result.success(responseDTO);
    }
    
    /**
     * 删除面试题目
     */
    @Operation(summary = "删除面试题目")
    @DeleteMapping("/{id}")
    public Result<Void> deleteById(
            @Parameter(description = "题目ID", required = true) @PathVariable @NotNull Long id) {
        interviewQuestionService.deleteById(id);
        return Result.success();
    }
    
    /**
     * 启用/禁用面试题目
     */
    @Operation(summary = "启用/禁用面试题目")
    @PatchMapping("/{id}/status")
    public Result<Void> updateStatus(
            @Parameter(description = "题目ID", required = true) @PathVariable @NotNull Long id,
            @RequestParam Integer status) {
        interviewQuestionService.updateStatus(id, status);
        return Result.success();
    }
    
    /**
     * 根据分类ID获取题目列表
     */
    @Operation(summary = "根据分类ID获取题目列表")
    @GetMapping("/category/{categoryId}")
    public Result<List<InterviewQuestionResponseDTO>> getQuestionsByCategoryId(
            @Parameter(description = "分类ID", required = true) @PathVariable @NotNull Long categoryId) {
        List<InterviewQuestionResponseDTO> questions = InterviewConvertUtils.toQuestionResponseDTOList(
            interviewQuestionService.getQuestionsByCategoryId(categoryId));
        return Result.success(questions);
    }
    
    /**
     * 批量删除面试题目
     */
    @Operation(summary = "批量删除面试题目")
    @DeleteMapping("/batch")
    public Result<Void> batchDelete(
            @RequestBody @NotEmpty List<Long> ids,
            @Parameter(description = "题目ID列表", required = true) @RequestParam @NotNull Long categoryId) {
        interviewQuestionService.batchDelete(ids);
        return Result.success();
    }
    
    /**
     * 搜索面试题目
     */
    @Operation(summary = "搜索面试题目")
    @GetMapping("/search")
    public Result<Page<InterviewQuestionResponseDTO>> search(
            @Parameter(description = "搜索关键词", required = false) @RequestParam(required = false) String keyword,
            @Parameter(description = "当前页", required = false) @RequestParam(defaultValue = "1") Integer current,
            @Parameter(description = "页面大小", required = false) @RequestParam(defaultValue = "10") Integer size) {
        
        IPage<InterviewQuestion> searchPage = interviewQuestionService.search(keyword, current, size);
        Page<InterviewQuestionResponseDTO> page = new Page<>(searchPage.getCurrent(), searchPage.getSize(), searchPage.getTotal());
        page.setRecords(InterviewConvertUtils.toQuestionResponseDTOList(searchPage.getRecords()));
        return Result.success(page);
    }
    
    /**
     * 获取随机面试题目
     */
    @Operation(summary = "获取随机面试题目")
    @GetMapping("/random")
    public Result<InterviewQuestionResponseDTO> getRandomQuestion(
            @Parameter(description = "分类ID", required = false) @RequestParam(required = false) Long categoryId) {
        InterviewQuestionResponseDTO question = InterviewConvertUtils.toResponseDTO(
            interviewQuestionService.getRandomQuestion(categoryId));
        return Result.success(question);
    }
}

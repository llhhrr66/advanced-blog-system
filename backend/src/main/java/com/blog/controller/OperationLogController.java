package com.blog.controller;

import com.blog.common.Result;
import com.blog.domain.dto.PageDTO;
import com.blog.domain.po.OperationLog;
import com.blog.domain.query.PageQuery;
import com.blog.service.IOperationLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 操作日志控制器
 * 
 * <p>提供操作日志的查询、统计等功能</p>
 * <p>仅管理员可访问</p>
 *
 * @author 梁俊荣
 * @since 2025-09-24
 */
@RestController
@RequestMapping("/operation-logs")
@RequiredArgsConstructor
@Validated
@Tag(name = "操作日志管理", description = "系统操作日志查询和统计接口")
@PreAuthorize("hasRole('ADMIN')")
public class OperationLogController {

    private final IOperationLogService operationLogService;

    /**
     * 分页查询操作日志
     */
    @GetMapping
    @Operation(summary = "分页查询操作日志", description = "支持按用户、操作类型、目标类型、时间范围等条件筛选")
    public Result<PageDTO<OperationLog>> getOperationLogs(
            @Valid PageQuery query,
            @Parameter(description = "用户ID")
            @RequestParam(required = false) Long userId,
            @Parameter(description = "操作类型")
            @RequestParam(required = false) String operationType,
            @Parameter(description = "目标类型")
            @RequestParam(required = false) String targetType,
            @Parameter(description = "开始时间")
            @RequestParam(required = false) 
            @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @Parameter(description = "结束时间")
            @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime
    ) {
        PageDTO<OperationLog> result = operationLogService.getOperationLogPage(
                query, userId, operationType, targetType, startTime, endTime
        );
        return Result.success(result);
    }

    /**
     * 获取操作统计信息
     */
    @GetMapping("/statistics")
    @Operation(summary = "获取操作统计", description = "统计指定时间范围内的操作数据")
    public Result<List<OperationLog>> getOperationStatistics(
            @Parameter(description = "开始时间")
            @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @Parameter(description = "结束时间")
            @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime
    ) {
        // 默认查询最近7天的数据
        if (startTime == null) {
            startTime = LocalDateTime.now().minusDays(7);
        }
        if (endTime == null) {
            endTime = LocalDateTime.now();
        }
        
        List<OperationLog> statistics = operationLogService.getOperationStatistics(startTime, endTime);
        return Result.success(statistics);
    }

    /**
     * 统计用户操作次数
     */
    @GetMapping("/user-count")
    @Operation(summary = "统计用户操作次数", description = "统计指定用户在指定时间范围内的操作次数")
    public Result<Long> countUserOperation(
            @Parameter(description = "用户ID", required = true)
            @RequestParam Long userId,
            @Parameter(description = "操作类型")
            @RequestParam(required = false) String operationType,
            @Parameter(description = "开始时间")
            @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @Parameter(description = "结束时间")
            @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime
    ) {
        // 默认查询今天的数据
        if (startTime == null) {
            startTime = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        }
        if (endTime == null) {
            endTime = LocalDateTime.now();
        }
        
        Long count = operationLogService.countUserOperation(userId, operationType, startTime, endTime);
        return Result.success(count);
    }

    /**
     * 清理过期日志
     */
    @DeleteMapping("/expired")
    @Operation(summary = "清理过期日志", description = "删除指定时间之前的操作日志")
    public Result<Integer> cleanExpiredLogs(
            @Parameter(description = "保留天数，默认30天", required = false)
            @RequestParam(defaultValue = "30") Integer retainDays
    ) {
        if (retainDays < 7) {
            return Result.error("保留天数不能少于7天");
        }
        
        LocalDateTime beforeTime = LocalDateTime.now().minusDays(retainDays);
        int cleanedCount = operationLogService.cleanExpiredLogs(beforeTime);
        return Result.success(cleanedCount);
    }

    /**
     * 获取操作类型列表
     */
    @GetMapping("/operation-types")
    @Operation(summary = "获取操作类型列表", description = "获取系统中所有的操作类型")
    public Result<List<String>> getOperationTypes() {
        // 这里可以返回预定义的操作类型列表
        List<String> operationTypes = List.of(
                "CREATE_ARTICLE", "UPDATE_ARTICLE", "DELETE_ARTICLE",
                "BATCH_OPERATION", "BATCH_DELETE", "BATCH_PUBLISH",
                "BATCH_UNPUBLISH", "BATCH_SET_TOP", "BATCH_CANCEL_TOP",
                "BATCH_SET_FEATURED", "BATCH_CANCEL_FEATURED", "CATEGORY_MOVE"
        );
        return Result.success(operationTypes);
    }

    /**
     * 获取目标类型列表
     */
    @GetMapping("/target-types")
    @Operation(summary = "获取目标类型列表", description = "获取系统中所有的目标类型")
    public Result<List<String>> getTargetTypes() {
        List<String> targetTypes = List.of(
                "ARTICLE", "CATEGORY", "TAG", "USER", "COMMENT", "SYSTEM"
        );
        return Result.success(targetTypes);
    }
}

package com.blog.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.blog.domain.dto.PageDTO;
import com.blog.domain.po.OperationLog;
import com.blog.domain.query.PageQuery;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 系统操作日志表 服务类
 * </p>
 *
 * @author 梁俊荣
 * @since 2025-09-24
 */
public interface IOperationLogService extends IService<OperationLog> {

    /**
     * 记录操作日志
     *
     * @param operationLog 操作日志对象
     */
    void recordOperation(OperationLog operationLog);

    /**
     * 分页查询操作日志
     *
     * @param query 分页查询参数
     * @param userId 用户ID（可选）
     * @param operationType 操作类型（可选）
     * @param targetType 目标类型（可选）
     * @param startTime 开始时间（可选）
     * @param endTime 结束时间（可选）
     * @return 操作日志分页结果
     */
    PageDTO<OperationLog> getOperationLogPage(
            PageQuery query,
            Long userId,
            String operationType,
            String targetType,
            LocalDateTime startTime,
            LocalDateTime endTime
    );

    /**
     * 根据用户ID和操作类型统计操作次数
     *
     * @param userId 用户ID
     * @param operationType 操作类型
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 操作次数
     */
    Long countUserOperation(Long userId, String operationType, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 清理过期的操作日志
     *
     * @param beforeTime 指定时间之前的日志将被清理
     * @return 清理的记录数
     */
    int cleanExpiredLogs(LocalDateTime beforeTime);

    /**
     * 获取操作统计信息
     *
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 统计结果列表
     */
    List<OperationLog> getOperationStatistics(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 构建并记录批量操作日志
     *
     * @param operationType 操作类型
     * @param operationDesc 操作描述
     * @param targetType 目标类型
     * @param targetIds 目标ID列表
     * @param oldValues 操作前的值
     * @param newValues 操作后的值
     * @param reason 操作原因
     * @param executionTime 执行耗时
     */
    void recordBatchOperation(
            String operationType,
            String operationDesc,
            String targetType,
            List<Long> targetIds,
            Object oldValues,
            Object newValues,
            String reason,
            Long executionTime
    );

    /**
     * 记录操作失败日志
     *
     * @param operationType 操作类型
     * @param operationDesc 操作描述
     * @param targetType 目标类型
     * @param targetIds 目标ID列表
     * @param errorMessage 错误信息
     * @param executionTime 执行耗时
     */
    void recordFailureOperation(
            String operationType,
            String operationDesc,
            String targetType,
            List<Long> targetIds,
            String errorMessage,
            Long executionTime
    );
}

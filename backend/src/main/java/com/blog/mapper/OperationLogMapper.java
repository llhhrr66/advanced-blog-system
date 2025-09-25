package com.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.domain.po.OperationLog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 系统操作日志表 Mapper 接口
 * </p>
 *
 * @author 梁俊荣
 * @since 2025-09-24
 */
@Mapper
public interface OperationLogMapper extends BaseMapper<OperationLog> {

    /**
     * 分页查询操作日志
     *
     * @param page 分页参数
     * @param userId 用户ID（可选）
     * @param operationType 操作类型（可选）
     * @param targetType 目标类型（可选）
     * @param startTime 开始时间（可选）
     * @param endTime 结束时间（可选）
     * @return 操作日志分页结果
     */
    Page<OperationLog> selectOperationLogPage(
            Page<OperationLog> page,
            @Param("userId") Long userId,
            @Param("operationType") String operationType,
            @Param("targetType") String targetType,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
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
    Long countByUserAndOperation(
            @Param("userId") Long userId,
            @Param("operationType") String operationType,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    /**
     * 清理过期的操作日志
     *
     * @param beforeTime 指定时间之前的日志将被清理
     * @return 清理的记录数
     */
    int deleteExpiredLogs(@Param("beforeTime") LocalDateTime beforeTime);

    /**
     * 获取操作统计信息
     *
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 统计结果列表
     */
    List<OperationLog> getOperationStatistics(
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}

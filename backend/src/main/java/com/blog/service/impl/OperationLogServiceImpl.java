package com.blog.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.blog.domain.dto.PageDTO;
import com.blog.domain.po.OperationLog;
import com.blog.domain.query.PageQuery;
import com.blog.mapper.OperationLogMapper;
import com.blog.service.IOperationLogService;
import com.blog.utils.JsonUtils;
import com.blog.utils.UserContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 系统操作日志表 服务实现类
 * </p>
 *
 * @author 梁俊荣
 * @since 2025-09-24
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OperationLogServiceImpl extends ServiceImpl<OperationLogMapper, OperationLog> implements IOperationLogService {

    @Override
    public void recordOperation(OperationLog operationLog) {
        try {
            // 自动填充一些基础信息
            fillRequestInfo(operationLog);
            fillUserInfo(operationLog);
            
            // 保存日志
            this.save(operationLog);
            log.debug("操作日志记录成功: {}", operationLog.getOperationType());
        } catch (Exception e) {
            log.error("记录操作日志失败", e);
            // 不抛出异常，避免影响主业务流程
        }
    }

    @Override
    public PageDTO<OperationLog> getOperationLogPage(PageQuery query, Long userId, String operationType, 
            String targetType, LocalDateTime startTime, LocalDateTime endTime) {
        Page<OperationLog> page = baseMapper.selectOperationLogPage(
                query.toMpPageDefaultSortByCreateTimeDesc(), 
                userId, operationType, targetType, startTime, endTime
        );
        
        List<OperationLog> records = page.getRecords();
        return PageDTO.of(page, records);
    }

    @Override
    public Long countUserOperation(Long userId, String operationType, LocalDateTime startTime, LocalDateTime endTime) {
        return baseMapper.countByUserAndOperation(userId, operationType, startTime, endTime);
    }

    @Override
    public int cleanExpiredLogs(LocalDateTime beforeTime) {
        return baseMapper.deleteExpiredLogs(beforeTime);
    }

    @Override
    public List<OperationLog> getOperationStatistics(LocalDateTime startTime, LocalDateTime endTime) {
        return baseMapper.getOperationStatistics(startTime, endTime);
    }

    @Override
    public void recordBatchOperation(String operationType, String operationDesc, String targetType, 
            List<Long> targetIds, Object oldValues, Object newValues, String reason, Long executionTime) {
        
        OperationLog operationLog = new OperationLog()
                .setOperationType(operationType)
                .setOperationDesc(operationDesc)
                .setTargetType(targetType)
                .setTargetIds(JsonUtils.toJsonStr(targetIds))
                .setOldValues(oldValues != null ? JsonUtils.toJsonStr(oldValues) : null)
                .setNewValues(newValues != null ? JsonUtils.toJsonStr(newValues) : null)
                .setReason(reason)
                .setExecutionTime(executionTime)
                .setStatus(1); // 成功
        
        recordOperation(operationLog);
    }

    @Override
    public void recordFailureOperation(String operationType, String operationDesc, String targetType, 
            List<Long> targetIds, String errorMessage, Long executionTime) {
        
        OperationLog operationLog = new OperationLog()
                .setOperationType(operationType)
                .setOperationDesc(operationDesc)
                .setTargetType(targetType)
                .setTargetIds(JsonUtils.toJsonStr(targetIds))
                .setErrorMessage(errorMessage)
                .setExecutionTime(executionTime)
                .setStatus(0); // 失败
        
        recordOperation(operationLog);
    }

    /**
     * 填充请求信息
     */
    private void fillRequestInfo(OperationLog operationLog) {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                
                operationLog.setMethod(request.getMethod());
                operationLog.setUrl(getFullRequestUrl(request));
                operationLog.setIpAddress(getClientIpAddress(request));
                operationLog.setUserAgent(request.getHeader("User-Agent"));
            }
        } catch (Exception e) {
            log.debug("填充请求信息失败", e);
        }
    }

    /**
     * 填充用户信息
     */
    private void fillUserInfo(OperationLog operationLog) {
        try {
            // 从UserContext获取当前用户信息（如果有的话）
            Long currentUserId = UserContext.getUser(); 
            if (currentUserId != null) {
                operationLog.setUserId(currentUserId);
                // TODO: 根据用户ID获取用户名和角色
                // User user = userService.getById(currentUserId);
                // operationLog.setUsername(user.getUsername());
                // operationLog.setUserRole(user.getRole());
                
                // 临时处理，后续需要完善用户信息获取
                operationLog.setUsername("admin");
                operationLog.setUserRole("ADMIN");
            }
        } catch (Exception e) {
            log.debug("填充用户信息失败", e);
        }
    }

    /**
     * 获取完整的请求URL
     */
    private String getFullRequestUrl(HttpServletRequest request) {
        StringBuffer requestURL = request.getRequestURL();
        String queryString = request.getQueryString();
        
        if (queryString != null) {
            requestURL.append("?").append(queryString);
        }
        
        String fullUrl = requestURL.toString();
        return fullUrl.length() > 500 ? fullUrl.substring(0, 500) : fullUrl;
    }

    /**
     * 获取客户端真实IP地址
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String[] ipHeaders = {
            "X-Forwarded-For",
            "Proxy-Client-IP", 
            "WL-Proxy-Client-IP",
            "HTTP_CLIENT_IP",
            "HTTP_X_FORWARDED_FOR"
        };
        
        for (String header : ipHeaders) {
            String ip = request.getHeader(header);
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                return ip.split(",")[0].trim();
            }
        }
        
        return request.getRemoteAddr();
    }
}

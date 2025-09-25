package com.blog.aspect;

import com.blog.annotation.OperationLog;
import com.blog.service.IOperationLogService;
import com.blog.utils.JsonUtils;
import com.blog.utils.SPELUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * 操作日志切面
 * 
 * <p>通过AOP自动记录标有@OperationLog注解的方法的操作日志</p>
 * <p>支持SpEL表达式动态获取参数值</p>
 * <p>支持同步和异步日志记录</p>
 *
 * @author 梁俊荣
 * @since 2025-09-24
 */
@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
@Order(1)
public class OperationLogAspect {

    private final IOperationLogService operationLogService;

    /**
     * 定义切点：所有带@OperationLog注解的方法
     */
    @Pointcut("@annotation(com.blog.annotation.OperationLog)")
    public void operationLogPointcut() {
        // 切点方法，无需实现
    }

    /**
     * 环绕通知：记录操作日志
     */
    @Around("operationLogPointcut() && @annotation(operationLog)")
    public Object around(ProceedingJoinPoint joinPoint, OperationLog operationLog) throws Throwable {
        long startTime = System.currentTimeMillis();
        Object result = null;
        Exception exception = null;

        try {
            // 记录操作前的值（如果需要）
            Object oldValue = null;
            if (operationLog.recordOldValue()) {
                oldValue = getOldValue(joinPoint, operationLog);
            }

            // 执行目标方法
            result = joinPoint.proceed();

            // 记录操作后的值（如果需要）
            Object newValue = null;
            if (operationLog.recordNewValue()) {
                newValue = getNewValue(joinPoint, operationLog, result);
            }

            // 记录成功的操作日志
            recordSuccessLog(joinPoint, operationLog, oldValue, newValue, result, startTime);

            return result;
        } catch (Exception e) {
            exception = e;
            
            // 记录失败的操作日志（如果配置了记录异常）
            if (operationLog.recordOnException()) {
                recordFailureLog(joinPoint, operationLog, e, startTime);
            }
            
            throw e;
        }
    }

    /**
     * 记录成功的操作日志
     */
    private void recordSuccessLog(JoinPoint joinPoint, OperationLog annotation, 
            Object oldValue, Object newValue, Object result, long startTime) {
        
        try {
            final long executionTime = System.currentTimeMillis() - startTime;
            
            // 解析注解参数
            final String operationType = parseExpression(annotation.operationType(), joinPoint, result);
            final String description = parseDescriptionExpression(annotation, joinPoint, result);
            final String targetType = parseExpression(annotation.targetType(), joinPoint, result);
            final String reason = parseExpression(annotation.reasonExpression(), joinPoint, result);
            final List<Long> targetIds = parseTargetIds(annotation, joinPoint, result);

            // 构建额外数据
            final Map<String, Object> extraData = buildExtraData(joinPoint, annotation, result);

            // 记录日志
            if (annotation.async()) {
                // 异步记录
                CompletableFuture.runAsync(() -> 
                    operationLogService.recordBatchOperation(
                        operationType, description, targetType, targetIds,
                        oldValue, newValue, reason, executionTime
                    )
                );
            } else {
                // 同步记录
                operationLogService.recordBatchOperation(
                    operationType, description, targetType, targetIds,
                    oldValue, newValue, reason, executionTime
                );
            }
            
        } catch (Exception e) {
            log.error("记录操作日志失败", e);
        }
    }

    /**
     * 记录失败的操作日志
     */
    private void recordFailureLog(JoinPoint joinPoint, OperationLog annotation, Exception exception, long startTime) {
        try {
            final long executionTime = System.currentTimeMillis() - startTime;
            
            final String operationType = parseExpression(annotation.operationType(), joinPoint, null);
            final String description = parseDescriptionExpression(annotation, joinPoint, null);
            final String targetType = parseExpression(annotation.targetType(), joinPoint, null);
            final List<Long> targetIds = parseTargetIds(annotation, joinPoint, null);
            
            String errorMessage = exception.getMessage();
            if (errorMessage != null && errorMessage.length() > 1000) {
                errorMessage = errorMessage.substring(0, 1000) + "...";
            }
            final String finalErrorMessage = errorMessage;

            if (annotation.async()) {
                CompletableFuture.runAsync(() -> 
                    operationLogService.recordFailureOperation(
                        operationType, description, targetType, targetIds, 
                        finalErrorMessage, executionTime
                    )
                );
            } else {
                operationLogService.recordFailureOperation(
                    operationType, description, targetType, targetIds, 
                    finalErrorMessage, executionTime
                );
            }
            
        } catch (Exception e) {
            log.error("记录失败操作日志失败", e);
        }
    }

    /**
     * 解析描述表达式
     */
    private String parseDescriptionExpression(OperationLog annotation, JoinPoint joinPoint, Object result) {
        if (StringUtils.hasText(annotation.descriptionExpression())) {
            return parseExpression(annotation.descriptionExpression(), joinPoint, result);
        } else if (StringUtils.hasText(annotation.description())) {
            return annotation.description();
        } else {
            return getDefaultDescription(joinPoint);
        }
    }

    /**
     * 解析目标ID列表
     */
    @SuppressWarnings("unchecked")
    private List<Long> parseTargetIds(OperationLog annotation, JoinPoint joinPoint, Object result) {
        if (StringUtils.hasText(annotation.targetIdsExpression())) {
            Object value = SPELUtils.parseExpression(annotation.targetIdsExpression(), joinPoint, result);
            if (value instanceof List) {
                return (List<Long>) value;
            }
        }
        return null;
    }

    /**
     * 解析SpEL表达式
     */
    private String parseExpression(String expression, JoinPoint joinPoint, Object result) {
        if (!StringUtils.hasText(expression)) {
            return "";
        }
        
        Object value = SPELUtils.parseExpression(expression, joinPoint, result);
        return value != null ? value.toString() : "";
    }

    /**
     * 获取操作前的值
     */
    private Object getOldValue(JoinPoint joinPoint, OperationLog annotation) {
        // TODO: 根据具体业务实现获取操作前的值的逻辑
        // 例如：根据ID从数据库查询当前值
        return null;
    }

    /**
     * 获取操作后的值
     */
    private Object getNewValue(JoinPoint joinPoint, OperationLog annotation, Object result) {
        // TODO: 根据具体业务实现获取操作后的值的逻辑
        return null;
    }

    /**
     * 构建额外数据
     */
    private Map<String, Object> buildExtraData(JoinPoint joinPoint, OperationLog annotation, Object result) {
        Map<String, Object> extraData = new HashMap<>();

        try {
            // 记录方法参数
            if (annotation.recordParams()) {
                Object[] args = joinPoint.getArgs();
                MethodSignature signature = (MethodSignature) joinPoint.getSignature();
                String[] paramNames = signature.getParameterNames();
                
                Map<String, Object> params = new HashMap<>();
                for (int i = 0; i < args.length && i < paramNames.length; i++) {
                    // 检查是否需要忽略此参数
                    if (!shouldIgnoreParam(i, annotation.ignoreParams())) {
                        params.put(paramNames[i], args[i]);
                    }
                }
                extraData.put("params", params);
            }

            // 记录方法返回值
            if (annotation.recordResult() && result != null) {
                extraData.put("result", result);
            }

            // 记录方法信息
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            extraData.put("method", signature.getDeclaringTypeName() + "." + signature.getName());
            extraData.put("level", annotation.level());

        } catch (Exception e) {
            log.debug("构建额外数据失败", e);
        }

        return extraData;
    }

    /**
     * 检查是否应该忽略参数
     */
    private boolean shouldIgnoreParam(int paramIndex, int[] ignoreParams) {
        return Arrays.stream(ignoreParams).anyMatch(ignore -> ignore == paramIndex);
    }

    /**
     * 获取默认描述
     */
    private String getDefaultDescription(JoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        return signature.getName() + "操作";
    }
}

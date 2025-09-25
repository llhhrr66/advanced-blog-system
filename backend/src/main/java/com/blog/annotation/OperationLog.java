package com.blog.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 操作日志注解
 * 
 * <p>用于标记需要记录操作日志的方法</p>
 * <p>可以配置操作类型、描述、目标类型等元数据</p>
 * 
 * @author 梁俊荣
 * @since 2025-09-24
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface OperationLog {

    /**
     * 操作类型
     * 例如：BATCH_DELETE、BATCH_PUBLISH、CREATE、UPDATE、DELETE等
     */
    String operationType() default "";

    /**
     * 操作描述
     * 例如：批量删除文章、批量发布文章、创建文章等
     */
    String description() default "";

    /**
     * 操作目标类型
     * 例如：ARTICLE、CATEGORY、TAG、USER等
     */
    String targetType() default "";

    /**
     * 是否记录操作前的值
     * 如果为true，会在操作前获取目标对象的值并记录到操作日志中
     */
    boolean recordOldValue() default false;

    /**
     * 是否记录操作后的值
     * 如果为true，会在操作后获取目标对象的值并记录到操作日志中
     */
    boolean recordNewValue() default false;

    /**
     * 是否记录方法参数
     * 如果为true，会将方法的入参记录到操作日志的extraData字段中
     */
    boolean recordParams() default true;

    /**
     * 是否记录方法返回值
     * 如果为true，会将方法的返回值记录到操作日志的extraData字段中
     */
    boolean recordResult() default false;

    /**
     * 忽略的参数索引
     * 用于指定不需要记录的参数位置（从0开始）
     * 例如：ignoreParams = {0, 2} 表示忽略第1个和第3个参数
     */
    int[] ignoreParams() default {};

    /**
     * SpEL表达式，用于动态获取操作目标ID列表
     * 例如：#dto.ids 表示从方法参数dto中获取ids字段的值作为目标ID列表
     */
    String targetIdsExpression() default "";

    /**
     * SpEL表达式，用于动态获取操作描述
     * 例如：'批量' + #dto.operationType.desc 
     */
    String descriptionExpression() default "";

    /**
     * SpEL表达式，用于动态获取操作原因
     * 例如：#dto.reason
     */
    String reasonExpression() default "";

    /**
     * 是否异步记录日志
     * 如果为true，将使用异步方式记录日志，不会影响主业务流程性能
     */
    boolean async() default false;

    /**
     * 操作级别
     * 用于标识操作的重要程度：1-普通，2-重要，3-严重
     */
    int level() default 1;

    /**
     * 是否在异常时也记录日志
     * 如果为true，即使方法抛出异常也会记录操作日志
     */
    boolean recordOnException() default true;
}

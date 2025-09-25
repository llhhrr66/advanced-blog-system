package com.blog.common.validate;

/**
 * 校验器接口
 * @param <T> 被校验的对象类型
 */
public interface Checker<T> {
    
    /**
     * 校验方法
     * @param data 被校验的数据
     */
    void check(T data);
    
    /**
     * 自校验方法
     */
    default void check() {
        // 默认实现为空，子类可以重写
    }
}

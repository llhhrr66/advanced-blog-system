package com.blog.common.exceptions;

/**
 * 通用异常类
 */
public class CommonException extends RuntimeException {
    
    public CommonException() {
        super();
    }
    
    public CommonException(String message) {
        super(message);
    }
    
    public CommonException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public CommonException(Throwable cause) {
        super(cause);
    }
}

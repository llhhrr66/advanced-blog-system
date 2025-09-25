package com.blog.common.exceptions;

/**
 * 请求参数错误异常
 */
public class BadRequestException extends RuntimeException {
    
    public BadRequestException() {
        super();
    }
    
    public BadRequestException(String message) {
        super(message);
    }
    
    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public BadRequestException(Throwable cause) {
        super(cause);
    }
}

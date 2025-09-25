package com.blog.common.exception;

import com.blog.common.result.ResultEnum;

/**
 * 业务异常类
 */
public class BusinessException extends RuntimeException {
    
    private Integer code;
    
    public BusinessException() {
        super();
        this.code = 500;
    }
    
    public BusinessException(String message) {
        super(message);
        this.code = 500;
    }
    
    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }
    
    public BusinessException(ResultEnum resultEnum) {
        super(resultEnum.getMessage());
        this.code = resultEnum.getCode();
    }
    
    public BusinessException(ResultEnum resultEnum, String message) {
        super(message);
        this.code = resultEnum.getCode();
    }
    
    public Integer getCode() {
        return code;
    }
    
    public void setCode(Integer code) {
        this.code = code;
    }
}

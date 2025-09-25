package com.blog.domain.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

/**
 * 导入进度信息
 * 
 * @author 梁俊荣
 * @since 2025-09-25
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportProgress {
    /**
     * 总文件数
     */
    @Builder.Default
    private Integer total = 0;
    
    /**
     * 已处理数
     */
    @Builder.Default
    private Integer processed = 0;
    
    /**
     * 成功数
     */
    @Builder.Default
    private Integer success = 0;
    
    /**
     * 失败数
     */
    @Builder.Default
    private Integer failed = 0;
    
    /**
     * 跳过数
     */
    @Builder.Default
    private Integer skipped = 0;
    
    /**
     * 当前处理的文件
     */
    private String currentFile;
    
    /**
     * 状态: idle/scanning/importing/completed/cancelled
     */
    private String status = "idle";
    
    /**
     * 错误列表
     */
    private List<ErrorInfo> errors = new ArrayList<>();
    
    /**
     * 错误信息内部类
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ErrorInfo {
        private String file;
        private String error;
    }
    
    /**
     * 错误信息内部类别名（为了兼容性）
     */
    public static class ImportError extends ErrorInfo {
        public ImportError(String file, String error) {
            super(file, error);
        }
    }
    
    /**
     * 添加错误
     */
    public void addError(String file, String error) {
        this.errors.add(new ErrorInfo(file, error));
    }
}

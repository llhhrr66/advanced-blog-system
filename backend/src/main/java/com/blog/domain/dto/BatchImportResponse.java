package com.blog.domain.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.ArrayList;
import java.util.List;

/**
 * 批量导入响应
 * 
 * @author 梁俊荣
 * @since 2025-09-25
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchImportResponse {
    /**
     * 任务ID
     */
    private String taskId;
    
    /**
     * 导入进度
     */
    private ImportProgress progress;
    
    /**
     * 导入结果列表
     */
    @Builder.Default
    private List<ImportResult> results = new ArrayList<>();
    
    /**
     * 导入结果内部类
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImportResult {
        /**
         * 文件名
         */
        private String file;
        
        /**
         * 创建的文章ID
         */
        private Long articleId;
        
        /**
         * 状态: success/error/skipped
         */
        private String status;
        
        /**
         * 消息
         */
        private String message;
    }
}

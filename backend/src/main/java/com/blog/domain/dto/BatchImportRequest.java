package com.blog.domain.dto;

import lombok.Data;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * 批量导入请求
 * 
 * @author 梁俊荣
 * @since 2025-09-25
 */
@Data
public class BatchImportRequest {
    /**
     * 导入的文件列表
     */
    @NotNull(message = "文件列表不能为空")
    @Size(min = 1, message = "至少需要一个文件")
    @Valid
    private List<ImportFileInfo> files;
    
    /**
     * 导入配置
     */
    @NotNull(message = "导入配置不能为空")
    @Valid
    private ImportConfig config;
}

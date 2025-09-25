package com.blog.service;

import com.blog.domain.dto.*;
import java.util.List;

/**
 * 批量导入服务接口
 * 
 * @author 梁俊荣
 * @since 2025-09-25
 */
public interface IBatchImportService {
    
    /**
     * 扫描目录获取Markdown文件
     * 
     * @param directory 目录路径
     * @return 文件信息列表
     */
    List<ImportFileInfo> scanDirectory(String directory);
    
    /**
     * 批量导入文章
     * 
     * @param request 批量导入请求
     * @return 批量导入响应
     */
    BatchImportResponse batchImport(BatchImportRequest request);
    
    /**
     * 获取导入进度
     * 
     * @param taskId 任务ID
     * @return 导入进度
     */
    ImportProgress getImportProgress(String taskId);
    
    /**
     * 取消导入任务
     * 
     * @param taskId 任务ID
     * @return 是否成功
     */
    boolean cancelImport(String taskId);
    
    /**
     * 验证Markdown文件
     * 
     * @param fileInfo 文件信息
     * @return 验证结果
     */
    boolean validateFile(ImportFileInfo fileInfo);
    
    /**
     * 处理单个文件导入
     * 
     * @param fileInfo 文件信息
     * @param config 导入配置
     * @return 导入结果
     */
    BatchImportResponse.ImportResult importSingleFile(ImportFileInfo fileInfo, ImportConfig config);
}

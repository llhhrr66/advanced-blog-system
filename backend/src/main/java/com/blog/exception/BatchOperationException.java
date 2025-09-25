package com.blog.exception;

/**
 * 批量操作异常
 * 
 * <p>用于标识批量操作过程中发生的异常</p>
 * <p>包含失败的具体信息和影响的记录数</p>
 *
 * @author 梁俊荣
 * @since 2025-09-24
 */
public class BatchOperationException extends BusinessException {

    /**
     * 失败的记录数
     */
    private final int failedCount;

    /**
     * 成功的记录数
     */
    private final int successCount;

    /**
     * 总记录数
     */
    private final int totalCount;

    public BatchOperationException(String message) {
        super(ErrorCode.BATCH_OPERATION_FAILED, message);
        this.failedCount = 0;
        this.successCount = 0;
        this.totalCount = 0;
    }

    public BatchOperationException(String message, Throwable cause) {
        super(ErrorCode.BATCH_OPERATION_FAILED, message, cause);
        this.failedCount = 0;
        this.successCount = 0;
        this.totalCount = 0;
    }

    public BatchOperationException(String message, int successCount, int failedCount, int totalCount) {
        super(ErrorCode.BATCH_OPERATION_FAILED, 
              String.format("%s。总计：%d，成功：%d，失败：%d", message, totalCount, successCount, failedCount));
        this.failedCount = failedCount;
        this.successCount = successCount;
        this.totalCount = totalCount;
    }

    public BatchOperationException(String message, int successCount, int failedCount, int totalCount, Throwable cause) {
        super(ErrorCode.BATCH_OPERATION_FAILED, 
              String.format("%s。总计：%d，成功：%d，失败：%d", message, totalCount, successCount, failedCount), 
              cause);
        this.failedCount = failedCount;
        this.successCount = successCount;
        this.totalCount = totalCount;
    }

    public int getFailedCount() {
        return failedCount;
    }

    public int getSuccessCount() {
        return successCount;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public boolean isPartialSuccess() {
        return successCount > 0 && failedCount > 0;
    }

    public boolean isCompleteFailure() {
        return successCount == 0 && totalCount > 0;
    }
}

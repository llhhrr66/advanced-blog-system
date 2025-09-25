package com.blog.domain.po;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * <p>
 * 系统操作日志表，记录用户的各种操作行为和系统变更
 * </p>
 *
 * @author 梁俊荣
 * @since 2025-09-24
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("operation_logs")
@Schema(description = "系统操作日志表")
public class OperationLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "操作日志唯一标识符，自增主键")
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @Schema(description = "操作类型，如：BATCH_DELETE、BATCH_PUBLISH等")
    private String operationType;

    @Schema(description = "操作描述，如：批量删除文章、批量发布文章")
    private String operationDesc;

    @Schema(description = "操作用户ID，关联users表，可为空（系统操作）")
    private Long userId;

    @Schema(description = "操作用户名，冗余字段，便于快速查询")
    private String username;

    @Schema(description = "用户角色：ADMIN、USER、AUTHOR等")
    private String userRole;

    @Schema(description = "操作目标类型：ARTICLE、CATEGORY、TAG、USER等")
    private String targetType;

    @Schema(description = "操作目标ID列表，JSON格式存储，如：[1,2,3]")
    private String targetIds;

    @Schema(description = "操作前的值，JSON格式存储")
    private String oldValues;

    @Schema(description = "操作后的值，JSON格式存储")
    private String newValues;

    @Schema(description = "请求方法：GET、POST、PUT、DELETE等")
    private String method;

    @Schema(description = "请求URL地址")
    private String url;

    @Schema(description = "操作者IP地址")
    private String ipAddress;

    @Schema(description = "用户代理字符串，浏览器信息")
    private String userAgent;

    @Schema(description = "操作状态：0-失败，1-成功")
    @TableField(fill = FieldFill.INSERT)
    private Integer status;

    @Schema(description = "错误信息，操作失败时记录")
    private String errorMessage;

    @Schema(description = "执行耗时，单位毫秒")
    private Long executionTime;

    @Schema(description = "操作原因/备注")
    private String reason;

    @Schema(description = "额外数据，JSON格式")
    private String extraData;

    @Schema(description = "操作时间")
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}

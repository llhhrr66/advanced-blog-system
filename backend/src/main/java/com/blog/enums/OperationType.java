package com.blog.enums;

/**
 * 批量操作类型枚举
 */
public enum OperationType implements BaseEnum {
    
    BATCH_PUBLISH(1, "批量发布"),
    BATCH_UNPUBLISH(2, "批量下架"),
    BATCH_DELETE(3, "批量删除"),
    BATCH_SET_TOP(4, "批量置顶"),
    BATCH_CANCEL_TOP(5, "取消置顶"),
    BATCH_SET_FEATURED(6, "批量精选"),
    BATCH_CANCEL_FEATURED(7, "取消精选"),
    CATEGORY_MOVE(8, "分类移动");
    
    private final int value;
    private final String desc;
    
    OperationType(int value, String desc) {
        this.value = value;
        this.desc = desc;
    }
    
    @Override
    public int getValue() {
        return this.value;
    }
    
    @Override
    public String getDesc() {
        return this.desc;
    }
    
    /**
     * 根据值获取枚举
     */
    public static OperationType fromValue(int value) {
        for (OperationType type : OperationType.values()) {
            if (type.getValue() == value) {
                return type;
            }
        }
        throw new IllegalArgumentException("未知的操作类型: " + value);
    }
    
    /**
     * 检查值是否有效
     */
    public static boolean isValidValue(int value) {
        try {
            fromValue(value);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}

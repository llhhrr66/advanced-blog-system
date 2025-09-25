package com.blog.utils;

import cn.hutool.core.util.StrUtil;

/**
 * 字符串工具类,继承了{@link StrUtil}
 **/
public class StringUtils extends StrUtil {
    
    /**
     * 检查字符串是否有文本内容（不为null且不为空白）
     * 
     * @param str 待检查的字符串
     * @return 如果字符串有内容返回true，否则返回false
     */
    public static boolean hasText(String str) {
        return isNotBlank(str);
    }
}

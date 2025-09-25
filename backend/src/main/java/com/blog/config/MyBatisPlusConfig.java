package com.blog.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.time.ZoneId;

/**
 * MyBatis Plus 自动填充配置
 */
@Configuration
public class MyBatisPlusConfig implements MetaObjectHandler {

    /**
     * 插入时自动填充
     */
    @Override
    public void insertFill(MetaObject metaObject) {
        // 使用中国时区的当前时间
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Shanghai"));
        
        // 自动填充创建时间
        this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, now);
        // 自动填充更新时间
        this.strictInsertFill(metaObject, "updateTime", LocalDateTime.class, now);
        
        // 如果发布时间为空，也使用当前时间
        if (metaObject.hasGetter("publishTime") && metaObject.getValue("publishTime") == null) {
            this.strictInsertFill(metaObject, "publishTime", LocalDateTime.class, now);
        }
        
        // 自动填充默认值
        this.strictInsertFill(metaObject, "deleted", Boolean.class, false);
        this.strictInsertFill(metaObject, "status", Integer.class, 0); // 默认草稿状态
        this.strictInsertFill(metaObject, "isTop", Boolean.class, false);
        this.strictInsertFill(metaObject, "viewCount", Long.class, 0L);
        this.strictInsertFill(metaObject, "likeCount", Long.class, 0L);
        this.strictInsertFill(metaObject, "commentCount", Long.class, 0L);
        this.strictInsertFill(metaObject, "collectCount", Long.class, 0L);
    }

    /**
     * 更新时自动填充
     */
    @Override
    public void updateFill(MetaObject metaObject) {
        // 使用中国时区的当前时间更新 updateTime
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Shanghai"));
        this.strictUpdateFill(metaObject, "updateTime", LocalDateTime.class, now);
    }
}

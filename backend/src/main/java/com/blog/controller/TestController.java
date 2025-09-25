package com.blog.controller;

import com.blog.common.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * 测试控制器
 */
@RestController
@RequestMapping("/test")
public class TestController {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/ping")
    public Result<Map<String, Object>> ping() {
        Map<String, Object> data = new HashMap<>();
        data.put("status", "ok");
        data.put("message", "Server is running");
        data.put("timestamp", System.currentTimeMillis());
        return Result.success(data);
    }
    
    @GetMapping("/time")
    public Result<Map<String, Object>> testTime() {
        Map<String, Object> timeInfo = new HashMap<>();
        
        // 系统默认时区
        timeInfo.put("systemTimeZone", TimeZone.getDefault().getID());
        
        // 当前时间（系统默认时区）
        LocalDateTime now = LocalDateTime.now();
        timeInfo.put("currentTime", now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        
        // 中国时区时间
        LocalDateTime chinaTime = LocalDateTime.now(ZoneId.of("Asia/Shanghai"));
        timeInfo.put("chinaTime", chinaTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        
        // UTC 时间
        LocalDateTime utcTime = LocalDateTime.now(ZoneId.of("UTC"));
        timeInfo.put("utcTime", utcTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        
        // 数据库时区信息
        try {
            String dbTimeZone = jdbcTemplate.queryForObject("SELECT @@time_zone", String.class);
            timeInfo.put("databaseTimeZone", dbTimeZone);
            
            String dbCurrentTime = jdbcTemplate.queryForObject("SELECT NOW()", String.class);
            timeInfo.put("databaseCurrentTime", dbCurrentTime);
        } catch (Exception e) {
            timeInfo.put("databaseError", e.getMessage());
        }
        
        return Result.success(timeInfo);
    }
}

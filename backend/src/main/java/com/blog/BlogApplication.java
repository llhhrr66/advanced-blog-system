package com.blog;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.elasticsearch.ElasticsearchDataAutoConfiguration;
import org.springframework.boot.autoconfigure.elasticsearch.ElasticsearchRestClientAutoConfiguration;
import org.mybatis.spring.annotation.MapperScan;

import java.util.TimeZone;

/**
 * 博客系统主启动类
 */
@SpringBootApplication(exclude = {
        ElasticsearchDataAutoConfiguration.class,
        ElasticsearchRestClientAutoConfiguration.class
})
@MapperScan("com.blog.mapper")
public class BlogApplication implements ApplicationRunner {

    /**
     * 应用启动后设置JVM默认时区
     */
    @Override
    public void run(ApplicationArguments args) throws Exception {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Shanghai"));
        System.out.println("已设置默认时区为: " + TimeZone.getDefault().getID());
    }

    public static void main(String[] args) {
        // 在应用启动前设置系统时区
        System.setProperty("user.timezone", "Asia/Shanghai");
        SpringApplication.run(BlogApplication.class, args);
    }
}

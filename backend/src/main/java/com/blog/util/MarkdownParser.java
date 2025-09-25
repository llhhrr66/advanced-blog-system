package com.blog.util;

import com.blog.domain.dto.ImportFileInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Markdown文件解析工具
 * 
 * @author 梁俊荣
 * @since 2025-09-25
 */
@Slf4j
@Component
public class MarkdownParser {
    
    private static final Pattern FRONTMATTER_PATTERN = Pattern.compile("^---\\s*\n([\\s\\S]*?)\n---\\s*\n([\\s\\S]*)$");
    private static final Pattern H1_PATTERN = Pattern.compile("^#\\s+(.+)$", Pattern.MULTILINE);
    private static final Pattern TAG_PATTERN = Pattern.compile("#(\\w+)", Pattern.MULTILINE);
    private static final DateTimeFormatter[] DATE_FORMATTERS = {
        DateTimeFormatter.ISO_LOCAL_DATE_TIME,
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"),
        DateTimeFormatter.ofPattern("yyyy-MM-dd"),
        DateTimeFormatter.ofPattern("yyyy/MM/dd"),
        DateTimeFormatter.ofPattern("dd/MM/yyyy")
    };
    
    /**
     * 解析Markdown文件内容
     */
    public void parseMarkdownFile(ImportFileInfo fileInfo) {
        String content = fileInfo.getContent();
        if (content == null || content.trim().isEmpty()) {
            fileInfo.setContent("");
            return;
        }
        
        // 解析Frontmatter
        Map<String, Object> frontmatter = parseFrontmatter(content);
        fileInfo.setFrontmatter(frontmatter);
        
        // 移除Frontmatter后的内容
        String body = removeFrontmatter(content);
        fileInfo.setContent(body);
        
        // 提取标题
        String title = extractTitle(frontmatter, body, fileInfo.getName());
        fileInfo.setTitle(cleanTitle(title));
        
        // 提取标签
        List<String> tags = extractTags(frontmatter, body);
        fileInfo.setTags(tags);
        
        // 提取时间信息
        extractTimeInfo(frontmatter, fileInfo);
        
        // 提取原文链接
        String originalUrl = extractOriginalUrl(frontmatter);
        fileInfo.setOriginalUrl(originalUrl);
    }
    
    /**
     * 解析Frontmatter
     */
    private Map<String, Object> parseFrontmatter(String content) {
        Map<String, Object> frontmatter = new HashMap<>();
        Matcher matcher = FRONTMATTER_PATTERN.matcher(content);
        
        if (matcher.find()) {
            String frontmatterText = matcher.group(1);
            String[] lines = frontmatterText.split("\n");
            
            for (String line : lines) {
                line = line.trim();
                if (!line.isEmpty() && !line.startsWith("#")) {
                    int colonIndex = line.indexOf(':');
                    if (colonIndex > 0) {
                        String key = line.substring(0, colonIndex).trim();
                        String value = line.substring(colonIndex + 1).trim();
                        
                        // 处理引号
                        value = removeQuotes(value);
                        
                        // 处理数组
                        if (value.startsWith("[") && value.endsWith("]")) {
                            value = value.substring(1, value.length() - 1);
                            List<String> list = Arrays.asList(value.split(","));
                            list = list.stream()
                                    .map(String::trim)
                                    .map(this::removeQuotes)
                                    .toList();
                            frontmatter.put(key, list);
                        } else {
                            frontmatter.put(key, value);
                        }
                    }
                }
            }
        }
        
        return frontmatter;
    }
    
    /**
     * 移除Frontmatter
     */
    private String removeFrontmatter(String content) {
        Matcher matcher = FRONTMATTER_PATTERN.matcher(content);
        if (matcher.find()) {
            return matcher.group(2);
        }
        return content;
    }
    
    /**
     * 提取标题
     */
    private String extractTitle(Map<String, Object> frontmatter, String body, String filename) {
        // 从frontmatter获取
        if (frontmatter.containsKey("title")) {
            return String.valueOf(frontmatter.get("title"));
        }
        
        // 从内容中查找H1标题
        Matcher matcher = H1_PATTERN.matcher(body);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        
        // 从文件名推断
        String name = filename.replaceAll("\\.md$", "");
        name = name.replaceAll("^\\d+[-._\\s]*", ""); // 移除开头数字
        return name;
    }
    
    /**
     * 清理标题（移除特殊字符）
     */
    private String cleanTitle(String title) {
        if (title == null) return "";
        // 移除emoji和特殊字符
        title = title.replaceAll("[✅❌⭐️📝✓✗★☆]", "");
        return title.trim();
    }
    
    /**
     * 提取标签
     */
    @SuppressWarnings("unchecked")
    private List<String> extractTags(Map<String, Object> frontmatter, String body) {
        Set<String> tags = new HashSet<>();
        
        // 从frontmatter获取tags
        if (frontmatter.containsKey("tags")) {
            Object tagsObj = frontmatter.get("tags");
            if (tagsObj instanceof List) {
                ((List<String>) tagsObj).forEach(tag -> tags.add(tag.trim()));
            } else if (tagsObj instanceof String) {
                String tagsStr = (String) tagsObj;
                if (tagsStr.contains(",")) {
                    Arrays.stream(tagsStr.split(","))
                            .map(String::trim)
                            .forEach(tags::add);
                } else {
                    tags.add(tagsStr.trim());
                }
            }
        }
        
        // 从frontmatter获取categories
        if (frontmatter.containsKey("categories")) {
            Object categoriesObj = frontmatter.get("categories");
            if (categoriesObj instanceof List) {
                ((List<String>) categoriesObj).forEach(cat -> tags.add(cat.trim()));
            } else if (categoriesObj instanceof String) {
                tags.add(((String) categoriesObj).trim());
            }
        }
        
        // 从内容中提取标签（#tag格式）
        Matcher matcher = TAG_PATTERN.matcher(body);
        while (matcher.find()) {
            String tag = matcher.group(1);
            if (tag.length() > 1 && tag.length() < 20) { // 合理的标签长度
                tags.add(tag);
            }
        }
        
        return new ArrayList<>(tags);
    }
    
    /**
     * 提取时间信息
     */
    private void extractTimeInfo(Map<String, Object> frontmatter, ImportFileInfo fileInfo) {
        // 创建时间字段
        String[] createFields = {"date", "created", "createTime", "created_at", "publishDate"};
        for (String field : createFields) {
            if (frontmatter.containsKey(field)) {
                String timeStr = String.valueOf(frontmatter.get(field));
                fileInfo.setCreateTime(parseDateTime(timeStr));
                break;
            }
        }
        
        // 更新时间字段
        String[] updateFields = {"updated", "modified", "updateTime", "updated_at", "last_modified"};
        for (String field : updateFields) {
            if (frontmatter.containsKey(field)) {
                String timeStr = String.valueOf(frontmatter.get(field));
                fileInfo.setUpdateTime(parseDateTime(timeStr));
                break;
            }
        }
    }
    
    /**
     * 解析日期时间
     */
    private String parseDateTime(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        
        // 尝试不同的日期格式
        for (DateTimeFormatter formatter : DATE_FORMATTERS) {
            try {
                LocalDateTime dateTime = LocalDateTime.parse(dateStr, formatter);
                return dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            } catch (DateTimeParseException e) {
                // 继续尝试下一个格式
            }
        }
        
        // 如果都失败了，返回原始字符串
        return dateStr;
    }
    
    /**
     * 提取原文链接
     */
    private String extractOriginalUrl(Map<String, Object> frontmatter) {
        String[] urlFields = {"url", "link", "source", "original", "originalUrl", "canonical"};
        
        for (String field : urlFields) {
            if (frontmatter.containsKey(field)) {
                String url = String.valueOf(frontmatter.get(field));
                if (url != null && (url.startsWith("http://") || url.startsWith("https://"))) {
                    return url;
                }
            }
        }
        
        return null;
    }
    
    /**
     * 移除引号
     */
    private String removeQuotes(String value) {
        if (value == null) return "";
        value = value.trim();
        if ((value.startsWith("\"") && value.endsWith("\"")) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            return value.substring(1, value.length() - 1);
        }
        return value;
    }
    
    /**
     * 从路径提取分类
     */
    public String extractCategoryFromPath(String filepath) {
        if (filepath == null || filepath.isEmpty()) {
            return "未分类";
        }
        
        // 分割路径
        String[] segments = filepath.split("[/\\\\]");
        
        // 如果有多级目录，取倒数第二级作为分类
        if (segments.length > 1) {
            String category = segments[segments.length - 2];
            // 清理分类名
            category = category.replaceAll("[_-]", " ");
            return category.trim();
        }
        
        return "未分类";
    }
}

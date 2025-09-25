import type { ImportFileInfo } from '@/types/api';

// 解析frontmatter的正则表达式
const FRONTMATTER_REGEX = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;

/**
 * 解析YAML frontmatter
 */
export function parseFrontmatter(content: string): { frontmatter: Record<string, any>; body: string } {
  const match = content.match(FRONTMATTER_REGEX);
  
  if (!match) {
    return { frontmatter: {}, body: content };
  }
  
  const [, frontmatterText, body] = match;
  const frontmatter: Record<string, any> = {};
  
  // 简单的YAML解析（仅支持基本键值对）
  frontmatterText.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex > -1) {
        const key = trimmed.slice(0, colonIndex).trim();
        let value = trimmed.slice(colonIndex + 1).trim();
        
        // 移除引号
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        // 处理数组（简单逗号分隔）
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
        }
        
        frontmatter[key] = value;
      }
    }
  });
  
  return { frontmatter, body };
}

/**
 * 从内容中提取标题
 */
export function extractTitle(content: string, filename: string): string {
  // 首先尝试从frontmatter获取标题
  const { frontmatter, body } = parseFrontmatter(content);
  
  if (frontmatter.title) {
    return String(frontmatter.title);
  }
  
  // 从内容中寻找第一个H1标题
  const h1Match = body.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }
  
  // 从文件名推断标题（移除扩展名和特殊符号）
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  return nameWithoutExt
    .replace(/^\d+[-.\s]*/, '') // 移除开头的数字
    .replace(/[✅❌⭐️📝]/g, '') // 移除emoji
    .trim();
}

/**
 * 从路径推断分类
 */
export function extractCategory(filepath: string): string {
  const pathSegments = filepath.split(/[/\\]/).filter(segment => segment && segment !== '.');
  
  // 如果有多级目录，取倒数第二级作为分类
  if (pathSegments.length > 1) {
    return pathSegments[pathSegments.length - 2];
  }
  
  // 如果只有文件名，返回默认分类
  return '未分类';
}

/**
 * 从frontmatter或内容提取标签
 */
export function extractTags(frontmatter: Record<string, any>, content: string): string[] {
  const tags = new Set<string>();
  
  // 从frontmatter获取标签
  if (frontmatter.tags) {
    const frontmatterTags = Array.isArray(frontmatter.tags) 
      ? frontmatter.tags 
      : [frontmatter.tags];
    frontmatterTags.forEach((tag: any) => {
      if (typeof tag === 'string' && tag.trim()) {
        tags.add(tag.trim());
      }
    });
  }
  
  // 从categories字段获取标签
  if (frontmatter.categories) {
    const categories = Array.isArray(frontmatter.categories) 
      ? frontmatter.categories 
      : [frontmatter.categories];
    categories.forEach((category: any) => {
      if (typeof category === 'string' && category.trim()) {
        tags.add(category.trim());
      }
    });
  }
  
  // 从内容中寻找标签（匹配 #标签 格式）
  const tagMatches = content.match(/#(\w+)/g);
  if (tagMatches) {
    tagMatches.forEach(match => {
      const tag = match.slice(1); // 移除#符号
      if (tag.length > 1) { // 避免单字符标签
        tags.add(tag);
      }
    });
  }
  
  return Array.from(tags);
}

/**
 * 从frontmatter获取时间信息
 */
export function extractTimeInfo(frontmatter: Record<string, any>): { createTime?: string; updateTime?: string } {
  const result: { createTime?: string; updateTime?: string } = {};
  
  // 尝试多种日期字段
  const createFields = ['date', 'created', 'createTime', 'created_at'];
  const updateFields = ['updated', 'modified', 'updateTime', 'updated_at', 'last_modified'];
  
  for (const field of createFields) {
    if (frontmatter[field]) {
      result.createTime = String(frontmatter[field]);
      break;
    }
  }
  
  for (const field of updateFields) {
    if (frontmatter[field]) {
      result.updateTime = String(frontmatter[field]);
      break;
    }
  }
  
  return result;
}

/**
 * 获取原文链接
 */
export function extractOriginalUrl(frontmatter: Record<string, any>): string | undefined {
  const urlFields = ['url', 'link', 'source', 'original', 'originalUrl'];
  
  for (const field of urlFields) {
    if (frontmatter[field] && typeof frontmatter[field] === 'string') {
      return frontmatter[field];
    }
  }
  
  return undefined;
}

/**
 * 处理markdown文件，解析所有相关信息
 */
export function processMarkdownFile(
  filename: string,
  filepath: string,
  content: string,
  size: number
): ImportFileInfo {
  const { frontmatter, body } = parseFrontmatter(content);
  const title = extractTitle(content, filename);
  const category = extractCategory(filepath);
  const tags = extractTags(frontmatter, body);
  const { createTime, updateTime } = extractTimeInfo(frontmatter);
  const originalUrl = extractOriginalUrl(frontmatter);
  
  return {
    id: `${filepath}_${Date.now()}`, // 生成唯一ID
    name: filename,
    path: filepath,
    size,
    content: body, // 存储去除frontmatter后的内容
    frontmatter,
    title,
    category,
    tags,
    createTime,
    updateTime,
    originalUrl,
    selected: true, // 默认选中
    status: 'pending'
  };
}

/**
 * 批量处理多个markdown文件
 */
export function processMarkdownFiles(files: Array<{
  name: string;
  path: string;
  content: string;
  size: number;
}>): ImportFileInfo[] {
  return files.map(file => 
    processMarkdownFile(file.name, file.path, file.content, file.size)
  );
}

/**
 * 验证markdown文件内容是否有效
 */
export function validateMarkdownFile(fileInfo: ImportFileInfo): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!fileInfo.title.trim()) {
    errors.push('缺少文章标题');
  }
  
  if (!fileInfo.content.trim()) {
    errors.push('文章内容为空');
  }
  
  if (fileInfo.title.length > 200) {
    errors.push('标题过长（超过200个字符）');
  }
  
  if (fileInfo.content.length > 100000) {
    errors.push('内容过长（超过100,000个字符）');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 生成导入摘要信息
 */
export function generateImportSummary(files: ImportFileInfo[]): {
  totalFiles: number;
  selectedFiles: number;
  categories: string[];
  tags: string[];
  estimatedArticles: number;
} {
  const selectedFiles = files.filter(f => f.selected);
  const categories = [...new Set(selectedFiles.map(f => f.category))];
  const allTags = selectedFiles.flatMap(f => f.tags);
  const tags = [...new Set(allTags)];
  
  return {
    totalFiles: files.length,
    selectedFiles: selectedFiles.length,
    categories,
    tags,
    estimatedArticles: selectedFiles.length
  };
}

// Cookie 管理工具库

export interface CookieOptions {
  path?: string;
  domain?: string;
  maxAge?: number; // 秒
  expires?: Date;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
}

/**
 * 设置 Cookie
 * @param name Cookie名称
 * @param value Cookie值  
 * @param options Cookie选项
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  if (typeof document === 'undefined') return;
  
  let cookie = `${name}=${encodeURIComponent(value)}`;
  
  if (options.path) {
    cookie += `; path=${options.path}`;
  }
  
  if (options.domain) {
    cookie += `; domain=${options.domain}`;
  }
  
  if (options.maxAge) {
    cookie += `; max-age=${options.maxAge}`;
  }
  
  if (options.expires) {
    cookie += `; expires=${options.expires.toUTCString()}`;
  }
  
  if (options.secure) {
    cookie += `; secure`;
  }
  
  if (options.sameSite) {
    cookie += `; samesite=${options.sameSite}`;
  }
  
  if (options.httpOnly) {
    cookie += `; httponly`;
  }
  
  document.cookie = cookie;
}

/**
 * 获取 Cookie 值
 * @param name Cookie名称
 * @returns Cookie值或null
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  
  return null;
}

/**
 * 删除 Cookie
 * @param name Cookie名称
 * @param options Cookie选项（主要是path和domain）
 */
export function removeCookie(name: string, options: Partial<CookieOptions> = {}) {
  setCookie(name, '', {
    ...options,
    expires: new Date(0),
  });
}

/**
 * 检查 Cookie 是否存在
 * @param name Cookie名称
 * @returns 是否存在
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}

/**
 * 获取所有 Cookie
 * @returns Cookie对象
 */
export function getAllCookies(): Record<string, string> {
  if (typeof document === 'undefined') return {};
  
  const cookies: Record<string, string> = {};
  const cookieString = document.cookie;
  
  if (cookieString) {
    cookieString.split(';').forEach(cookie => {
      const [name, ...valueParts] = cookie.trim().split('=');
      const value = valueParts.join('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
  }
  
  return cookies;
}

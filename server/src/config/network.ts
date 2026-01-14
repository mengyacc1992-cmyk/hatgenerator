/**
 * 网络配置模块
 * 处理代理、超时、重试等网络相关配置
 */

export interface NetworkConfig {
  proxy?: {
    http?: string;
    https?: string;
  };
  timeout: number;
  retries: number;
  retryDelay: number;
}

/**
 * 获取网络配置
 */
export function getNetworkConfig(): NetworkConfig {
  const config: NetworkConfig = {
    timeout: 30000, // 30 秒
    retries: 3,
    retryDelay: 1000, // 1 秒
  };

  // 从环境变量获取代理配置
  if (process.env.HTTP_PROXY || process.env.HTTPS_PROXY) {
    config.proxy = {
      http: process.env.HTTP_PROXY,
      https: process.env.HTTPS_PROXY || process.env.HTTP_PROXY,
    };
  }

  return config;
}

/**
 * 配置全局代理（如果可用）
 * 使用 undici 的 ProxyAgent 来配置 fetch 的代理
 */
export async function setupGlobalProxy(): Promise<boolean> {
  const config = getNetworkConfig();
  
  if (!config.proxy?.https) {
    return false;
  }

  try {
    // 方法1: 使用 undici 配置 fetch 代理（推荐，因为 @google/genai 使用 fetch）
    try {
      const { setGlobalDispatcher, ProxyAgent } = await import('undici');
      const proxyAgent = new ProxyAgent(config.proxy.https);
      setGlobalDispatcher(proxyAgent);
      console.log('✅ Undici proxy agent enabled:', config.proxy.https);
      return true;
    } catch (undiciError: any) {
      console.warn('⚠️  Undici not available, trying global-agent:', undiciError?.message);
    }

    // 方法2: 尝试使用 global-agent（作为备用）
    try {
      await import('global-agent/bootstrap.js');
      
      // 设置 global-agent 环境变量
      process.env.GLOBAL_AGENT_HTTP_PROXY = config.proxy.http || '';
      process.env.GLOBAL_AGENT_HTTPS_PROXY = config.proxy.https || '';
      process.env.GLOBAL_AGENT_NO_PROXY = '';
      
      console.log('✅ Global proxy agent enabled:', config.proxy.https);
      return true;
    } catch (error: any) {
      console.warn('⚠️  Global proxy agent not available:', error?.message);
      return false;
    }
  } catch (error: any) {
    console.warn('⚠️  Failed to setup proxy:', error?.message);
    return false;
  }
}

/**
 * 延迟函数（用于重试）
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 带重试的网络请求包装器
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  config: NetworkConfig = getNetworkConfig()
): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= config.retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return response;
      }
      
      // 如果是服务器错误，尝试重试
      if (response.status >= 500 && attempt < config.retries) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      return response;
    } catch (error: any) {
      lastError = error;
      
      // 如果是网络错误且还有重试机会
      if (attempt < config.retries && (
        error.name === 'AbortError' ||
        error.message?.includes('fetch failed') ||
        error.message?.includes('network')
      )) {
        const delayMs = config.retryDelay * Math.pow(2, attempt); // 指数退避
        console.warn(`⚠️  Request failed (attempt ${attempt + 1}/${config.retries + 1}), retrying in ${delayMs}ms...`);
        await delay(delayMs);
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError || new Error('Request failed after retries');
}

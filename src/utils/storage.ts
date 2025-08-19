/**
 * 本地存储工具函数
 */

import type { RegretEntry, TimeCapsule, AppSettings } from '../types';

const STORAGE_KEYS = {
  REGRETS: 'regret-mailbox-regrets',
  TIME_CAPSULES: 'regret-mailbox-capsules',
  SETTINGS: 'regret-mailbox-settings',
} as const;

/**
 * 保存遗憾条目到本地存储
 */
export const saveRegrets = (regrets: RegretEntry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.REGRETS, JSON.stringify(regrets));
  } catch (error) {
    console.error('保存遗憾条目失败:', error);
  }
};

/**
 * 从本地存储加载遗憾条目
 */
export const loadRegrets = (): RegretEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REGRETS);
    if (!stored) return [];
    
    const regrets = JSON.parse(stored);
    // 转换日期字符串为Date对象
    return regrets.map((regret: any) => ({
      ...regret,
      createdAt: new Date(regret.createdAt),
    }));
  } catch (error) {
    console.error('加载遗憾条目失败:', error);
    return [];
  }
};

/**
 * 保存时光胶囊到本地存储
 */
export const saveTimeCapsules = (capsules: TimeCapsule[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TIME_CAPSULES, JSON.stringify(capsules));
  } catch (error) {
    console.error('保存时光胶囊失败:', error);
  }
};

/**
 * 从本地存储加载时光胶囊
 */
export const loadTimeCapsules = (): TimeCapsule[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TIME_CAPSULES);
    if (!stored) return [];
    
    const capsules = JSON.parse(stored);
    // 转换日期字符串为Date对象
    return capsules.map((capsule: any) => ({
      ...capsule,
      createdAt: new Date(capsule.createdAt),
      openAt: new Date(capsule.openAt),
    }));
  } catch (error) {
    console.error('加载时光胶囊失败:', error);
    return [];
  }
};

/**
 * 保存应用设置
 */
export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('保存设置失败:', error);
  }
};

/**
 * 加载应用设置
 */
export const loadSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!stored) {
      return {
        enableNotifications: true,
        autoSave: true,
        defaultMood: 'regretful',
        language: 'zh',
      };
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('加载设置失败:', error);
    return {
      enableNotifications: true,
      autoSave: true,
      defaultMood: 'regretful',
      language: 'zh',
    };
  }
};

/**
 * 生成唯一ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * 导出数据为JSON文件
 */
export const exportData = (): void => {
  const regrets = loadRegrets();
  const capsules = loadTimeCapsules();
  const settings = loadSettings();
  
  const data = {
    regrets,
    timeCapsules: capsules,
    settings,
    exportedAt: new Date().toISOString(),
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `regret-mailbox-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * 从JSON文件导入数据
 */
export const importData = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.regrets) {
          saveRegrets(data.regrets);
        }
        if (data.timeCapsules) {
          saveTimeCapsules(data.timeCapsules);
        }
        if (data.settings) {
          saveSettings(data.settings);
        }
        
        resolve();
      } catch (error) {
        reject(new Error('导入数据格式错误'));
      }
    };
    
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsText(file);
  });
};

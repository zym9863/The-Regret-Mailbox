/**
 * 应用的核心数据类型定义
 */

// 遗憾条目类型
export interface RegretEntry {
  id: string;
  title: string;
  content: string;
  author: string; // 昵称或"匿名"
  isAnonymous: boolean;
  image?: string; // base64编码的图片
  createdAt: Date;
  tags?: string[];
  mood?: 'sad' | 'regretful' | 'nostalgic' | 'hopeful' | 'angry';
}

// 时光胶囊类型
export interface TimeCapsule {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  openAt: Date; // 开启时间
  isOpened: boolean;
  encryptedContent?: string; // 加密内容
  questions?: string[]; // 给未来自己的问题
}

// 应用状态类型
export interface AppState {
  regrets: RegretEntry[];
  timeCapsules: TimeCapsule[];
  currentView: 'home' | 'submit' | 'capsule' | 'list' | 'about';
  theme: 'light' | 'dark';
  settings: AppSettings;
}

// 应用设置类型
export interface AppSettings {
  enableNotifications: boolean;
  autoSave: boolean;
  defaultMood: RegretEntry['mood'];
  language: 'zh' | 'en';
}

// 表单数据类型
export interface RegretFormData {
  title: string;
  content: string;
  author: string;
  isAnonymous: boolean;
  image?: File;
  tags: string[];
  mood: RegretEntry['mood'];
}

export interface CapsuleFormData {
  title: string;
  content: string;
  author: string;
  openAt: Date;
  questions: string[];
}

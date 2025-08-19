/**
 * 全局状态管理
 */

import { signal, computed } from '@preact/signals';
import type { RegretEntry, TimeCapsule, AppSettings } from '../types';
import { 
  loadRegrets, 
  saveRegrets, 
  loadTimeCapsules, 
  saveTimeCapsules,
  loadSettings,
  saveSettings,
  generateId 
} from '../utils/storage';

// 全局状态信号
export const regrets = signal<RegretEntry[]>(loadRegrets());
export const timeCapsules = signal<TimeCapsule[]>(loadTimeCapsules());
export const settings = signal<AppSettings>(loadSettings());
export const currentView = signal<string>('home');
export const theme = signal<'light' | 'dark'>('light');

// 计算属性
export const totalRegrets = computed(() => regrets.value.length);
export const totalCapsules = computed(() => timeCapsules.value.length);
export const openableCapsules = computed(() => 
  timeCapsules.value.filter(capsule => 
    !capsule.isOpened && new Date() >= capsule.openAt
  )
);

/**
 * 添加新的遗憾条目
 */
export const addRegret = (regretData: Omit<RegretEntry, 'id' | 'createdAt'>) => {
  const newRegret: RegretEntry = {
    ...regretData,
    id: generateId(),
    createdAt: new Date(),
  };
  
  regrets.value = [newRegret, ...regrets.value];
  saveRegrets(regrets.value);
};

/**
 * 删除遗憾条目
 */
export const deleteRegret = (id: string) => {
  regrets.value = regrets.value.filter(regret => regret.id !== id);
  saveRegrets(regrets.value);
};

/**
 * 更新遗憾条目
 */
export const updateRegret = (id: string, updates: Partial<RegretEntry>) => {
  regrets.value = regrets.value.map(regret => 
    regret.id === id ? { ...regret, ...updates } : regret
  );
  saveRegrets(regrets.value);
};

/**
 * 添加新的时光胶囊
 */
export const addTimeCapsule = (capsuleData: Omit<TimeCapsule, 'id' | 'createdAt' | 'isOpened'>) => {
  const newCapsule: TimeCapsule = {
    ...capsuleData,
    id: generateId(),
    createdAt: new Date(),
    isOpened: false,
  };
  
  timeCapsules.value = [newCapsule, ...timeCapsules.value];
  saveTimeCapsules(timeCapsules.value);
};

/**
 * 开启时光胶囊
 */
export const openTimeCapsule = (id: string) => {
  timeCapsules.value = timeCapsules.value.map(capsule => 
    capsule.id === id ? { ...capsule, isOpened: true } : capsule
  );
  saveTimeCapsules(timeCapsules.value);
};

/**
 * 删除时光胶囊
 */
export const deleteTimeCapsule = (id: string) => {
  timeCapsules.value = timeCapsules.value.filter(capsule => capsule.id !== id);
  saveTimeCapsules(timeCapsules.value);
};

/**
 * 更新应用设置
 */
export const updateSettings = (newSettings: Partial<AppSettings>) => {
  settings.value = { ...settings.value, ...newSettings };
  saveSettings(settings.value);
};

/**
 * 切换主题
 */
export const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme.value);
};

/**
 * 设置当前视图
 */
export const setCurrentView = (view: string) => {
  currentView.value = view;
};

/**
 * 搜索遗憾条目
 */
export const searchRegrets = (query: string) => {
  if (!query.trim()) return regrets.value;
  
  const lowercaseQuery = query.toLowerCase();
  return regrets.value.filter(regret => 
    regret.title.toLowerCase().includes(lowercaseQuery) ||
    regret.content.toLowerCase().includes(lowercaseQuery) ||
    regret.author.toLowerCase().includes(lowercaseQuery) ||
    regret.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

/**
 * 按心情筛选遗憾条目
 */
export const filterRegretsByMood = (mood: string) => {
  if (!mood) return regrets.value;
  return regrets.value.filter(regret => regret.mood === mood);
};

/**
 * 按日期范围筛选遗憾条目
 */
export const filterRegretsByDateRange = (startDate: Date, endDate: Date) => {
  return regrets.value.filter(regret => 
    regret.createdAt >= startDate && regret.createdAt <= endDate
  );
};

// 初始化主题
document.documentElement.setAttribute('data-theme', theme.value);

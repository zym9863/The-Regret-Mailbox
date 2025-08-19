/**
 * 存储功能测试
 */

import { 
  saveRegrets, 
  loadRegrets, 
  saveTimeCapsules, 
  loadTimeCapsules,
  saveSettings,
  loadSettings,
  generateId 
} from '../utils/storage';
import type { RegretEntry, TimeCapsule, AppSettings } from '../types';

// 模拟 localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

/**
 * 测试遗憾条目存储
 */
export function testRegretStorage() {
  console.log('测试遗憾条目存储...');
  
  const testRegrets: RegretEntry[] = [
    {
      id: generateId(),
      title: '测试遗憾',
      content: '这是一个测试遗憾',
      author: '测试用户',
      isAnonymous: false,
      createdAt: new Date(),
      mood: 'regretful',
      tags: ['测试']
    }
  ];

  // 保存测试
  saveRegrets(testRegrets);
  
  // 加载测试
  const loadedRegrets = loadRegrets();
  
  if (loadedRegrets.length === 1 && loadedRegrets[0].title === '测试遗憾') {
    console.log('✅ 遗憾条目存储测试通过');
    return true;
  } else {
    console.log('❌ 遗憾条目存储测试失败');
    return false;
  }
}

/**
 * 测试时光胶囊存储
 */
export function testTimeCapsuleStorage() {
  console.log('测试时光胶囊存储...');
  
  const testCapsules: TimeCapsule[] = [
    {
      id: generateId(),
      title: '测试胶囊',
      content: '这是一个测试胶囊',
      author: '测试用户',
      createdAt: new Date(),
      openAt: new Date(Date.now() + 86400000), // 明天
      isOpened: false,
      questions: ['测试问题？']
    }
  ];

  // 保存测试
  saveTimeCapsules(testCapsules);
  
  // 加载测试
  const loadedCapsules = loadTimeCapsules();
  
  if (loadedCapsules.length === 1 && loadedCapsules[0].title === '测试胶囊') {
    console.log('✅ 时光胶囊存储测试通过');
    return true;
  } else {
    console.log('❌ 时光胶囊存储测试失败');
    return false;
  }
}

/**
 * 测试设置存储
 */
export function testSettingsStorage() {
  console.log('测试设置存储...');
  
  const testSettings: AppSettings = {
    enableNotifications: false,
    autoSave: false,
    defaultMood: 'sad',
    language: 'en'
  };

  // 保存测试
  saveSettings(testSettings);
  
  // 加载测试
  const loadedSettings = loadSettings();
  
  if (loadedSettings.enableNotifications === false && loadedSettings.defaultMood === 'sad') {
    console.log('✅ 设置存储测试通过');
    return true;
  } else {
    console.log('❌ 设置存储测试失败');
    return false;
  }
}

/**
 * 测试ID生成
 */
export function testIdGeneration() {
  console.log('测试ID生成...');
  
  const id1 = generateId();
  const id2 = generateId();
  
  if (id1 !== id2 && id1.length > 0 && id2.length > 0) {
    console.log('✅ ID生成测试通过');
    return true;
  } else {
    console.log('❌ ID生成测试失败');
    return false;
  }
}

/**
 * 运行所有测试
 */
export function runAllTests() {
  console.log('开始运行存储功能测试...');
  
  const results = [
    testRegretStorage(),
    testTimeCapsuleStorage(),
    testSettingsStorage(),
    testIdGeneration()
  ];
  
  const passedTests = results.filter(result => result).length;
  const totalTests = results.length;
  
  console.log(`测试完成: ${passedTests}/${totalTests} 通过`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有测试通过！');
  } else {
    console.log('⚠️ 部分测试失败，请检查代码');
  }
  
  return passedTests === totalTests;
}

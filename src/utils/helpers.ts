/**
 * 通用工具函数
 */

import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 格式化日期显示
 */
export const formatDate = (date: Date): string => {
  return format(date, 'yyyy年MM月dd日 HH:mm', { locale: zhCN });
};

/**
 * 格式化相对时间
 */
export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true, locale: zhCN });
};

/**
 * 将文件转换为base64字符串
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * 压缩图片
 */
export const compressImage = (file: File, maxWidth = 800, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // 计算压缩后的尺寸
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // 绘制压缩后的图片
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // 转换为base64
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

/**
 * 验证表单数据
 */
export const validateRegretForm = (data: {
  title: string;
  content: string;
  author: string;
}): string[] => {
  const errors: string[] = [];
  
  if (!data.title.trim()) {
    errors.push('请输入标题');
  }
  
  if (!data.content.trim()) {
    errors.push('请输入内容');
  }
  
  if (!data.author.trim()) {
    errors.push('请输入昵称或选择匿名');
  }
  
  if (data.title.length > 100) {
    errors.push('标题不能超过100个字符');
  }
  
  if (data.content.length > 2000) {
    errors.push('内容不能超过2000个字符');
  }
  
  return errors;
};

/**
 * 验证时光胶囊表单
 */
export const validateCapsuleForm = (data: {
  title: string;
  content: string;
  author: string;
  openAt: Date;
}): string[] => {
  const errors: string[] = [];
  
  if (!data.title.trim()) {
    errors.push('请输入标题');
  }
  
  if (!data.content.trim()) {
    errors.push('请输入内容');
  }
  
  if (!data.author.trim()) {
    errors.push('请输入昵称');
  }
  
  if (data.openAt <= new Date()) {
    errors.push('开启时间必须是未来的时间');
  }
  
  return errors;
};

/**
 * 获取心情对应的颜色
 */
export const getMoodColor = (mood: string): string => {
  const colors = {
    sad: '#6366f1',
    regretful: '#8b5cf6',
    nostalgic: '#06b6d4',
    hopeful: '#10b981',
    angry: '#ef4444',
  };
  return colors[mood as keyof typeof colors] || '#6b7280';
};

/**
 * 获取心情对应的中文名称
 */
export const getMoodName = (mood: string): string => {
  const names = {
    sad: '悲伤',
    regretful: '遗憾',
    nostalgic: '怀念',
    hopeful: '希望',
    angry: '愤怒',
  };
  return names[mood as keyof typeof names] || '未知';
};

/**
 * 检查时光胶囊是否可以开启
 */
export const canOpenCapsule = (openAt: Date): boolean => {
  return new Date() >= openAt;
};

/**
 * 简单的文本加密（仅用于演示，实际应用需要更安全的加密）
 */
export const simpleEncrypt = (text: string, key: string): string => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(result);
};

/**
 * 简单的文本解密
 */
export const simpleDecrypt = (encryptedText: string, key: string): string => {
  try {
    const decoded = atob(encryptedText);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch {
    return '';
  }
};

/**
 * 生成随机密钥
 */
export const generateKey = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

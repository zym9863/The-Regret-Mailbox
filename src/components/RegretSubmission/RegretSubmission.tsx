/**
 * 遗憾投递组件
 */

import { useState } from 'preact/hooks';
import { Upload, X, Heart, User, UserX, Tag, Smile } from 'lucide-preact';
import { addRegret } from '../../store';
import { validateRegretForm, compressImage, getMoodColor } from '../../utils/helpers';
import type { RegretFormData } from '../../types';
import './RegretSubmission.css';

const MOOD_OPTIONS = [
  { value: 'regretful', label: '遗憾', icon: '😔' },
  { value: 'sad', label: '悲伤', icon: '😢' },
  { value: 'nostalgic', label: '怀念', icon: '🥺' },
  { value: 'hopeful', label: '希望', icon: '🌟' },
  { value: 'angry', label: '愤怒', icon: '😠' },
] as const;

export function RegretSubmission() {
  const [formData, setFormData] = useState<RegretFormData>({
    title: '',
    content: '',
    author: '',
    isAnonymous: false,
    tags: [],
    mood: 'regretful',
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /**
   * 处理表单字段变化
   */
  const handleInputChange = (field: keyof RegretFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // 清除错误信息
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  /**
   * 处理图片上传
   */
  const handleImageUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) return;
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      setErrors(['请选择图片文件']);
      return;
    }
    
    // 检查文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(['图片大小不能超过5MB']);
      return;
    }
    
  try {
      const preview = await compressImage(file);
      setImagePreview(preview);
    } catch (error) {
      setErrors(['图片处理失败，请重试']);
    }
  };

  /**
   * 移除图片
   */
  const handleRemoveImage = () => {
    setImagePreview('');
  };

  /**
   * 添加标签
   */
  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      handleInputChange('tags', [...formData.tags, tag]);
      setNewTag('');
    }
  };

  /**
   * 移除标签
   */
  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    
    // 验证表单
    const validationErrors = validateRegretForm({
      title: formData.title,
      content: formData.content,
      author: formData.isAnonymous ? '匿名' : formData.author,
    });
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 准备提交数据
      const submitData = {
        title: formData.title,
        content: formData.content,
        author: formData.isAnonymous ? '匿名' : formData.author,
        isAnonymous: formData.isAnonymous,
        image: imagePreview,
        tags: formData.tags,
        mood: formData.mood,
      };
      
      // 添加到存储
      addRegret(submitData);
      
      // 显示成功消息
      setShowSuccess(true);
      
      // 重置表单
      setFormData({
        title: '',
        content: '',
        author: '',
        isAnonymous: false,
        tags: [],
        mood: 'regretful',
      });
      setImagePreview('');
      setNewTag('');
      
      // 3秒后隐藏成功消息
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      setErrors(['提交失败，请重试']);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="regret-submission fade-in">
      <div className="submission-header slide-in-down">
        <h2 className="submission-title">投递遗憾</h2>
        <p className="submission-description">
          写下那些未曾说出的话，让它们在这里找到归宿
        </p>
      </div>

      {showSuccess && (
        <div className="success-message bounce-in">
          <Heart size={20} />
          <span>遗憾已投递成功，愿时间能够治愈一切</span>
        </div>
      )}

      <form className="submission-form slide-in-up" onSubmit={handleSubmit}>
        {/* 标题 */}
        <div className="form-group">
          <label className="form-label">
            标题 <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="给你的遗憾起个标题..."
            value={formData.title}
            onInput={(e) => handleInputChange('title', (e.target as HTMLInputElement).value)}
            maxLength={100}
          />
          <div className="char-count">{formData.title.length}/100</div>
        </div>

        {/* 内容 */}
        <div className="form-group">
          <label className="form-label">
            内容 <span className="required">*</span>
          </label>
          <textarea
            className="form-input form-textarea"
            placeholder="写下你的遗憾，那些未曾说出的话..."
            value={formData.content}
            onInput={(e) => handleInputChange('content', (e.target as HTMLTextAreaElement).value)}
            maxLength={2000}
            rows={8}
          />
          <div className="char-count">{formData.content.length}/2000</div>
        </div>

        {/* 作者信息 */}
        <div className="form-group">
          <label className="form-label">署名方式</label>
          <div className="author-options">
            <button
              type="button"
              className={`author-option ${!formData.isAnonymous ? 'active' : ''}`}
              onClick={() => handleInputChange('isAnonymous', false)}
            >
              <User size={20} />
              <span>使用昵称</span>
            </button>
            <button
              type="button"
              className={`author-option ${formData.isAnonymous ? 'active' : ''}`}
              onClick={() => handleInputChange('isAnonymous', true)}
            >
              <UserX size={20} />
              <span>匿名投递</span>
            </button>
          </div>
          
          {!formData.isAnonymous && (
            <input
              type="text"
              className="form-input"
              placeholder="输入你的昵称..."
              value={formData.author}
              onInput={(e) => handleInputChange('author', (e.target as HTMLInputElement).value)}
              maxLength={20}
            />
          )}
        </div>

        {/* 心情选择 */}
        <div className="form-group">
          <label className="form-label">
            <Smile size={16} />
            当前心情
          </label>
          <div className="mood-options">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood.value}
                type="button"
                className={`mood-option ${formData.mood === mood.value ? 'active' : ''}`}
                onClick={() => handleInputChange('mood', mood.value)}
                style={{ '--mood-color': getMoodColor(mood.value) } as any}
              >
                <span className="mood-icon">{mood.icon}</span>
                <span className="mood-label">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 标签 */}
        <div className="form-group">
          <label className="form-label">
            <Tag size={16} />
            标签 (最多5个)
          </label>
          <div className="tags-input">
            <input
              type="text"
              className="tag-input"
              placeholder="添加标签..."
              value={newTag}
              onInput={(e) => setNewTag((e.target as HTMLInputElement).value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              maxLength={10}
            />
            <button
              type="button"
              className="add-tag-btn"
              onClick={handleAddTag}
              disabled={!newTag.trim() || formData.tags.length >= 5}
            >
              添加
            </button>
          </div>
          
          {formData.tags.length > 0 && (
            <div className="tags-list">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button
                    type="button"
                    className="remove-tag"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 图片上传 */}
        <div className="form-group">
          <label className="form-label">
            <Upload size={16} />
            图片 (可选)
          </label>
          
          {!imagePreview ? (
            <div className="image-upload">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
              />
              <label htmlFor="image-upload" className="upload-area">
                <Upload size={32} />
                <span>点击上传图片</span>
                <small>支持 JPG、PNG 格式，最大 5MB</small>
              </label>
            </div>
          ) : (
            <div className="image-preview">
              <img src={imagePreview} alt="预览" />
              <button
                type="button"
                className="remove-image"
                onClick={handleRemoveImage}
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* 错误信息 */}
        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <div key={index} className="error-message">
                {error}
              </div>
            ))}
          </div>
        )}

        {/* 提交按钮 */}
        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? '投递中...' : '投递遗憾'}
          </button>
        </div>
      </form>
    </div>
  );
}

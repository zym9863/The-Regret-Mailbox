/**
 * 时光胶囊组件
 */

import { useState } from 'preact/hooks';
import { Clock, Plus, Calendar, Lock, Unlock, Eye, Trash2, MessageCircle } from 'lucide-preact';
import { 
  timeCapsules, 
  openableCapsules, 
  addTimeCapsule, 
  openTimeCapsule, 
  deleteTimeCapsule 
} from '../../store';
import { 
  formatDate, 
  formatRelativeTime, 
  validateCapsuleForm, 
  canOpenCapsule,
  generateKey 
} from '../../utils/helpers';
import type { CapsuleFormData, TimeCapsule as TimeCapsuleType } from '../../types';
import './TimeCapsule.css';

export function TimeCapsule() {
  const [showForm, setShowForm] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState<TimeCapsuleType | null>(null);
  const [formData, setFormData] = useState<CapsuleFormData>({
    title: '',
    content: '',
    author: '',
    openAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 默认一年后
    questions: [],
  });
  const [newQuestion, setNewQuestion] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /**
   * 处理表单字段变化
   */
  const handleInputChange = (field: keyof CapsuleFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  /**
   * 添加问题
   */
  const handleAddQuestion = () => {
    const question = newQuestion.trim();
    if (question && formData.questions.length < 10) {
      handleInputChange('questions', [...formData.questions, question]);
      setNewQuestion('');
    }
  };

  /**
   * 移除问题
   */
  const handleRemoveQuestion = (index: number) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    handleInputChange('questions', newQuestions);
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    
    const validationErrors = validateCapsuleForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
  // 生成加密密钥（当前未启用加密，预留接口）
  generateKey();
      
      // 准备提交数据
      const submitData = {
        title: formData.title,
        content: formData.content,
        author: formData.author,
        openAt: formData.openAt,
        questions: formData.questions,
        encryptedContent: '', // 简化版本，不加密
      };
      
      addTimeCapsule(submitData);
      
      setShowSuccess(true);
      setShowForm(false);
      
      // 重置表单
      setFormData({
        title: '',
        content: '',
        author: '',
        openAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        questions: [],
      });
      setNewQuestion('');
      
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      setErrors(['创建失败，请重试']);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 开启时光胶囊
   */
  const handleOpenCapsule = (capsule: TimeCapsuleType) => {
    if (canOpenCapsule(capsule.openAt)) {
      openTimeCapsule(capsule.id);
      setSelectedCapsule({ ...capsule, isOpened: true });
    }
  };

  /**
   * 删除时光胶囊
   */
  const handleDeleteCapsule = (capsuleId: string) => {
    if (confirm('确定要删除这个时光胶囊吗？此操作不可恢复。')) {
      deleteTimeCapsule(capsuleId);
      if (selectedCapsule?.id === capsuleId) {
        setSelectedCapsule(null);
      }
    }
  };

  /**
   * 格式化开启时间显示
   */
  const getOpenTimeDisplay = (openAt: Date) => {
    const now = new Date();
    if (openAt <= now) {
      return '可以开启';
    }
    return `${formatRelativeTime(openAt)}开启`;
  };

  return (
    <div className="time-capsule fade-in">
      <div className="capsule-header slide-in-down">
        <h2 className="capsule-title">时光胶囊</h2>
        <p className="capsule-description">
          给未来的自己写一封信，让时间来回答你的问题
        </p>
        <button
          className="create-capsule-btn hover-lift"
          onClick={() => setShowForm(true)}
        >
          <Plus size={20} />
          创建胶囊
        </button>
      </div>

      {showSuccess && (
        <div className="success-message bounce-in">
          <Clock size={20} />
          <span>时光胶囊创建成功，等待时间的答案</span>
        </div>
      )}

      {/* 可开启的胶囊提醒 */}
      {openableCapsules.value.length > 0 && (
        <div className="openable-reminder">
          <div className="reminder-icon">
            <Calendar size={24} />
          </div>
          <div className="reminder-content">
            <h3>时间到了！</h3>
            <p>你有 {openableCapsules.value.length} 个时光胶囊可以开启了</p>
          </div>
        </div>
      )}

      <div className="capsule-content">
        {/* 创建表单 */}
        {showForm && (
          <div className="capsule-form-overlay">
            <div className="capsule-form">
              <div className="form-header">
                <h3>创建时光胶囊</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    标题 <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="给这个时光胶囊起个名字..."
                    value={formData.title}
                    onInput={(e) => handleInputChange('title', (e.target as HTMLInputElement).value)}
                    maxLength={100}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    给未来的自己 <span className="required">*</span>
                  </label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="写下你想对未来的自己说的话..."
                    value={formData.content}
                    onInput={(e) => handleInputChange('content', (e.target as HTMLTextAreaElement).value)}
                    maxLength={2000}
                    rows={6}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    署名 <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="你的昵称..."
                    value={formData.author}
                    onInput={(e) => handleInputChange('author', (e.target as HTMLInputElement).value)}
                    maxLength={20}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={16} />
                    开启时间 <span className="required">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={formData.openAt.toISOString().slice(0, 16)}
                    onInput={(e) => {
                      const value = (e.target as HTMLInputElement).value;
                      handleInputChange('openAt', new Date(value));
                    }}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <MessageCircle size={16} />
                    给未来的问题 (可选)
                  </label>
                  <div className="questions-input">
                    <input
                      type="text"
                      className="question-input"
                      placeholder="问问未来的自己..."
                      value={newQuestion}
                      onInput={(e) => setNewQuestion((e.target as HTMLInputElement).value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddQuestion();
                        }
                      }}
                      maxLength={100}
                    />
                    <button
                      type="button"
                      className="add-question-btn"
                      onClick={handleAddQuestion}
                      disabled={!newQuestion.trim() || formData.questions.length >= 10}
                    >
                      添加
                    </button>
                  </div>
                  
                  {formData.questions.length > 0 && (
                    <div className="questions-list">
                      {formData.questions.map((question, index) => (
                        <div key={index} className="question-item">
                          <span>{question}</span>
                          <button
                            type="button"
                            className="remove-question"
                            onClick={() => handleRemoveQuestion(index)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {errors.length > 0 && (
                  <div className="error-messages">
                    {errors.map((error, index) => (
                      <div key={index} className="error-message">
                        {error}
                      </div>
                    ))}
                  </div>
                )}

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '创建中...' : '创建胶囊'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 胶囊列表 */}
        <div className="capsules-grid">
          {timeCapsules.value.length === 0 ? (
            <div className="empty-state">
              <Clock size={64} />
              <h3>还没有时光胶囊</h3>
              <p>创建你的第一个时光胶囊，给未来的自己留下一些话</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                创建胶囊
              </button>
            </div>
          ) : (
            timeCapsules.value.map((capsule) => (
              <div 
                key={capsule.id} 
                className={`capsule-card ${canOpenCapsule(capsule.openAt) ? 'openable' : ''} ${capsule.isOpened ? 'opened' : ''}`}
              >
                <div className="capsule-card-header">
                  <div className="capsule-status">
                    {capsule.isOpened ? (
                      <Unlock size={20} />
                    ) : canOpenCapsule(capsule.openAt) ? (
                      <Calendar size={20} />
                    ) : (
                      <Lock size={20} />
                    )}
                  </div>
                  <h3 className="capsule-card-title">{capsule.title}</h3>
                  <button
                    className="delete-capsule"
                    onClick={() => handleDeleteCapsule(capsule.id)}
                    title="删除胶囊"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="capsule-card-content">
                  <p className="capsule-author">来自：{capsule.author}</p>
                  <p className="capsule-date">创建于：{formatDate(capsule.createdAt)}</p>
                  <p className="capsule-open-time">
                    {capsule.isOpened ? '已开启' : getOpenTimeDisplay(capsule.openAt)}
                  </p>
                  
                  {capsule.questions && capsule.questions.length > 0 && (
                    <p className="capsule-questions">
                      包含 {capsule.questions.length} 个问题
                    </p>
                  )}
                </div>
                
                <div className="capsule-card-actions">
                  {capsule.isOpened ? (
                    <button
                      className="view-capsule-btn"
                      onClick={() => setSelectedCapsule(capsule)}
                    >
                      <Eye size={16} />
                      查看内容
                    </button>
                  ) : canOpenCapsule(capsule.openAt) ? (
                    <button
                      className="open-capsule-btn"
                      onClick={() => handleOpenCapsule(capsule)}
                    >
                      <Unlock size={16} />
                      开启胶囊
                    </button>
                  ) : (
                    <div className="waiting-message">
                      <Clock size={16} />
                      等待时间到来
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 胶囊详情模态框 */}
        {selectedCapsule && (
          <div className="capsule-detail-overlay">
            <div className="capsule-detail">
              <div className="detail-header">
                <h3>{selectedCapsule.title}</h3>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedCapsule(null)}
                >
                  ×
                </button>
              </div>
              
              <div className="detail-content">
                <div className="detail-meta">
                  <p><strong>来自：</strong>{selectedCapsule.author}</p>
                  <p><strong>创建时间：</strong>{formatDate(selectedCapsule.createdAt)}</p>
                  <p><strong>开启时间：</strong>{formatDate(selectedCapsule.openAt)}</p>
                </div>
                
                <div className="detail-message">
                  <h4>给未来的话：</h4>
                  <div className="message-content">
                    {selectedCapsule.content}
                  </div>
                </div>
                
                {selectedCapsule.questions && selectedCapsule.questions.length > 0 && (
                  <div className="detail-questions">
                    <h4>当时的问题：</h4>
                    <ul className="questions-list">
                      {selectedCapsule.questions.map((question, index) => (
                        <li key={index}>{question}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

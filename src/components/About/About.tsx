/**
 * 关于页面组件
 */

import { Heart, Clock, PenTool, Shield, Download, Upload } from 'lucide-preact';
import { exportData } from '../../utils/storage';
import './About.css';

export function About() {
  /**
   * 处理数据导出
   */
  const handleExportData = () => {
    try {
      exportData();
    } catch (error) {
      alert('导出失败，请重试');
    }
  };

  /**
   * 处理数据导入
   */
  const handleImportData = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    try {
      const { importData } = await import('../../utils/storage');
      await importData(file);
      alert('数据导入成功！页面将刷新以显示新数据。');
      window.location.reload();
    } catch (error) {
      alert('导入失败：' + (error as Error).message);
    }

    // 清除文件输入
    target.value = '';
  };

  return (
    <div className="about-page fade-in">
      <div className="about-header slide-in-down">
        <h2 className="about-title">关于遗憾信箱</h2>
        <p className="about-subtitle">
          一个温暖的空间，让遗憾找到归宿，让时间带来答案
        </p>
      </div>

      <div className="about-content slide-in-up">
        {/* 应用介绍 */}
        <section className="about-section">
          <h3 className="section-title">应用介绍</h3>
          <div className="intro-grid">
            <div className="intro-card hover-lift">
              <div className="intro-icon">
                <PenTool size={32} />
              </div>
              <h4>遗憾投递</h4>
              <p>
                记录那些未曾说出的话、错过的机会或深深的歉意。
                这里是一个安全的空间，让你的遗憾找到归宿。
              </p>
            </div>

            <div className="intro-card hover-lift">
              <div className="intro-icon">
                <Clock size={32} />
              </div>
              <h4>时光胶囊</h4>
              <p>
                给未来的自己写信，设定开启时间，让时间来回答你的问题。
                感受时间的疗愈力量和自己的成长。
              </p>
            </div>

            <div className="intro-card hover-lift">
              <div className="intro-icon">
                <Heart size={32} />
              </div>
              <h4>情感治愈</h4>
              <p>
                通过记录和回顾，让遗憾不再是负担，而是成长的见证。
                时间会告诉你，一切都会过去。
              </p>
            </div>
          </div>
        </section>

        {/* 功能特色 */}
        <section className="about-section">
          <h3 className="section-title">功能特色</h3>
          <div className="features-list">
            <div className="feature-item">
              <Shield size={20} />
              <div>
                <h4>隐私保护</h4>
                <p>所有数据仅存储在本地，保护你的隐私安全</p>
              </div>
            </div>

            <div className="feature-item">
              <PenTool size={20} />
              <div>
                <h4>多样表达</h4>
                <p>支持文字、图片、标签和心情记录，丰富表达方式</p>
              </div>
            </div>

            <div className="feature-item">
              <Clock size={20} />
              <div>
                <h4>时间胶囊</h4>
                <p>设定未来开启时间，给时间一个答案的机会</p>
              </div>
            </div>

            <div className="feature-item">
              <Heart size={20} />
              <div>
                <h4>情感分类</h4>
                <p>按心情分类记录，更好地理解和管理情感</p>
              </div>
            </div>
          </div>
        </section>

        {/* 使用建议 */}
        <section className="about-section">
          <h3 className="section-title">使用建议</h3>
          <div className="suggestions">
            <div className="suggestion-item">
              <h4>1. 诚实面对</h4>
              <p>真诚地记录你的感受，不要害怕展现脆弱的一面。</p>
            </div>

            <div className="suggestion-item">
              <h4>2. 定期回顾</h4>
              <p>定期查看过去的记录，感受时间带来的变化和成长。</p>
            </div>

            <div className="suggestion-item">
              <h4>3. 积极思考</h4>
              <p>在记录遗憾的同时，也要思考从中学到了什么。</p>
            </div>

            <div className="suggestion-item">
              <h4>4. 放下过去</h4>
              <p>记录不是为了沉溺，而是为了更好地放下和前行。</p>
            </div>
          </div>
        </section>

        {/* 数据管理 */}
        <section className="about-section">
          <h3 className="section-title">数据管理</h3>
          <div className="data-management">
            <p className="data-info">
              你的所有数据都安全地存储在本地浏览器中。你可以随时导出备份或导入之前的数据。
            </p>
            
            <div className="data-actions">
              <button className="data-btn export-btn" onClick={handleExportData}>
                <Download size={20} />
                导出数据
              </button>
              
              <label className="data-btn import-btn">
                <Upload size={20} />
                导入数据
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        </section>

        {/* 版本信息 */}
        <section className="about-section">
          <h3 className="section-title">版本信息</h3>
          <div className="version-info">
            <div className="version-item">
              <strong>版本：</strong>1.0.0
            </div>
            <div className="version-item">
              <strong>技术栈：</strong>Preact + TypeScript + Vite
            </div>
            <div className="version-item">
              <strong>开发理念：</strong>简洁、温暖、治愈
            </div>
          </div>
        </section>

        {/* 寄语 */}
        <section className="about-section">
          <div className="message-card">
            <div className="message-icon">
              <Heart size={48} />
            </div>
            <div className="message-content">
              <h3>愿你被时间温柔以待</h3>
              <p>
                每个人都有遗憾，但遗憾不应该成为前行的负担。
                <br />
                记录下来，让时间来治愈，让成长来回答。
                <br />
                愿你在这里找到内心的平静，也愿你的未来充满希望。
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

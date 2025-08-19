/**
 * 主页组件
 */

import { PenTool, Clock, Heart, Calendar } from 'lucide-preact';
import { totalRegrets, totalCapsules, openableCapsules, setCurrentView } from '../../store';
import { formatDate } from '../../utils/helpers';
import './Home.css';

export function Home() {
  /**
   * 处理快捷操作点击
   */
  const handleQuickAction = (action: string) => {
    setCurrentView(action);
  };

  return (
    <div className="home-container fade-in">
      {/* 欢迎区域 */}
      <section className="welcome-section slide-in-down">
        <div className="welcome-content">
          <h2 className="welcome-title">欢迎来到遗憾信箱</h2>
          <p className="welcome-description">
            这里是一个安全的空间，让你记录那些未曾说出的话，
            <br />
            给过去一个交代，给未来一份期待。
          </p>
        </div>
        <div className="welcome-illustration">
          <Heart size={64} className="heart-icon pulse" />
        </div>
      </section>

      {/* 统计卡片 */}
      <section className="stats-section slide-in-up">
        <div className="stats-grid">
          <div className="stat-card hover-lift">
            <div className="stat-icon">
              <PenTool size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{totalRegrets.value}</h3>
              <p className="stat-label">遗憾条目</p>
            </div>
          </div>

          <div className="stat-card hover-lift">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{totalCapsules.value}</h3>
              <p className="stat-label">时光胶囊</p>
            </div>
          </div>

          <div className="stat-card highlight hover-lift">
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{openableCapsules.value.length}</h3>
              <p className="stat-label">可开启胶囊</p>
            </div>
          </div>
        </div>
      </section>

      {/* 快捷操作 */}
      <section className="actions-section fade-in">
        <h3 className="section-title">快捷操作</h3>
        <div className="actions-grid">
          <button
            className="action-card primary hover-lift hover-glow"
            onClick={() => handleQuickAction('submit')}
          >
            <PenTool size={32} />
            <h4>投递遗憾</h4>
            <p>写下那些未曾说出的话</p>
          </button>

          <button
            className="action-card secondary hover-lift hover-glow"
            onClick={() => handleQuickAction('capsule')}
          >
            <Clock size={32} />
            <h4>创建时光胶囊</h4>
            <p>给未来的自己写一封信</p>
          </button>
        </div>
      </section>

      {/* 今日提醒 */}
      {openableCapsules.value.length > 0 && (
        <section className="reminder-section">
          <div className="reminder-card">
            <div className="reminder-icon">
              <Calendar size={24} />
            </div>
            <div className="reminder-content">
              <h4>今日提醒</h4>
              <p>
                你有 {openableCapsules.value.length} 个时光胶囊可以开启了！
                <br />
                <small>最早的胶囊创建于 {formatDate(openableCapsules.value[0]?.createdAt)}</small>
              </p>
            </div>
            <button 
              className="reminder-button"
              onClick={() => handleQuickAction('capsule')}
            >
              查看
            </button>
          </div>
        </section>
      )}

      {/* 使用指南 */}
      <section className="guide-section">
        <h3 className="section-title">使用指南</h3>
        <div className="guide-grid">
          <div className="guide-item">
            <div className="guide-number">1</div>
            <h4>投递遗憾</h4>
            <p>记录那些让你遗憾的事情，可以是未说出的话、错过的机会或深深的歉意。</p>
          </div>
          
          <div className="guide-item">
            <div className="guide-number">2</div>
            <h4>创建胶囊</h4>
            <p>给未来的自己写信，设定开启时间，让时间来回答你的问题。</p>
          </div>
          
          <div className="guide-item">
            <div className="guide-number">3</div>
            <h4>回顾与成长</h4>
            <p>定期回顾你的遗憾和胶囊，感受时间的疗愈力量和自己的成长。</p>
          </div>
        </div>
      </section>
    </div>
  );
}

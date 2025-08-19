/**
 * 遗憾列表组件
 */

import { useState, useMemo } from 'preact/hooks';
import { Search, Filter, Calendar, Grid, List, Trash2, Eye, Heart, Tag, User } from 'lucide-preact';
import { regrets, deleteRegret, searchRegrets } from '../../store';
import { formatDate, formatRelativeTime, getMoodColor, getMoodName } from '../../utils/helpers';
import type { RegretEntry } from '../../types';
import './RegretList.css';

type ViewMode = 'grid' | 'list' | 'timeline';
type SortBy = 'newest' | 'oldest' | 'title';

export function RegretList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [selectedRegret, setSelectedRegret] = useState<RegretEntry | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  /**
   * 获取所有可用的标签
   */
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    regrets.value.forEach(regret => {
      regret.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [regrets.value]);

  /**
   * 获取所有可用的心情
   */
  const availableMoods = useMemo(() => {
    const moods = new Set<string>();
    regrets.value.forEach(regret => {
      if (regret.mood) moods.add(regret.mood);
    });
    return Array.from(moods).sort();
  }, [regrets.value]);

  /**
   * 过滤和排序遗憾列表
   */
  const filteredAndSortedRegrets = useMemo(() => {
    let filtered = regrets.value;

    // 搜索过滤
    if (searchQuery.trim()) {
      filtered = searchRegrets(searchQuery);
    }

    // 心情过滤
    if (selectedMood) {
      filtered = filtered.filter(regret => regret.mood === selectedMood);
    }

    // 标签过滤
    if (selectedTag) {
      filtered = filtered.filter(regret => 
        regret.tags?.includes(selectedTag)
      );
    }

    // 排序
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [regrets.value, searchQuery, selectedMood, selectedTag, sortBy]);

  /**
   * 按日期分组（用于时间线视图）
   */
  const groupedByDate = useMemo(() => {
    const groups: { [key: string]: RegretEntry[] } = {};
    
    filteredAndSortedRegrets.forEach(regret => {
      const dateKey = regret.createdAt.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(regret);
    });

    return Object.entries(groups).sort(([a], [b]) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [filteredAndSortedRegrets]);

  /**
   * 处理删除遗憾
   */
  const handleDeleteRegret = (regretId: string) => {
    if (confirm('确定要删除这个遗憾吗？此操作不可恢复。')) {
      deleteRegret(regretId);
      if (selectedRegret?.id === regretId) {
        setSelectedRegret(null);
      }
    }
  };

  /**
   * 清除所有过滤器
   */
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMood('');
    setSelectedTag('');
  };

  return (
    <div className="regret-list fade-in">
      <div className="list-header slide-in-down">
        <h2 className="list-title">遗憾列表</h2>
        <p className="list-description">
          回顾那些记录下的遗憾，感受时间的疗愈力量
        </p>
      </div>

      {/* 搜索和过滤器 */}
      <div className="list-controls">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="搜索遗憾..."
            value={searchQuery}
            onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
            className="search-input"
          />
        </div>

        <div className="control-buttons">
          <button
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            过滤器
          </button>

          <div className="view-modes">
            <button
              className={`view-mode ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="网格视图"
            >
              <Grid size={20} />
            </button>
            <button
              className={`view-mode ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="列表视图"
            >
              <List size={20} />
            </button>
            <button
              className={`view-mode ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
              title="时间线视图"
            >
              <Calendar size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 过滤器面板 */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label className="filter-label">心情</label>
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood((e.target as HTMLSelectElement).value)}
              className="filter-select"
            >
              <option value="">所有心情</option>
              {availableMoods.map(mood => (
                <option key={mood} value={mood}>
                  {getMoodName(mood)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">标签</label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag((e.target as HTMLSelectElement).value)}
              className="filter-select"
            >
              <option value="">所有标签</option>
              {availableTags.map(tag => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">排序</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy((e.target as HTMLSelectElement).value as SortBy)}
              className="filter-select"
            >
              <option value="newest">最新优先</option>
              <option value="oldest">最早优先</option>
              <option value="title">标题排序</option>
            </select>
          </div>

          <button className="clear-filters" onClick={clearFilters}>
            清除过滤器
          </button>
        </div>
      )}

      {/* 统计信息 */}
      <div className="list-stats">
        <span className="stats-text">
          共 {regrets.value.length} 个遗憾
          {filteredAndSortedRegrets.length !== regrets.value.length && 
            ` · 显示 ${filteredAndSortedRegrets.length} 个`
          }
        </span>
      </div>

      {/* 遗憾列表内容 */}
      <div className="list-content">
        {filteredAndSortedRegrets.length === 0 ? (
          <div className="empty-state">
            {regrets.value.length === 0 ? (
              <>
                <Heart size={64} />
                <h3>还没有遗憾记录</h3>
                <p>开始记录你的第一个遗憾吧</p>
              </>
            ) : (
              <>
                <Search size={64} />
                <h3>没有找到匹配的遗憾</h3>
                <p>尝试调整搜索条件或过滤器</p>
              </>
            )}
          </div>
        ) : viewMode === 'timeline' ? (
          <div className="timeline-view">
            {groupedByDate.map(([dateKey, dayRegrets]) => (
              <div key={dateKey} className="timeline-group">
                <div className="timeline-date">
                  <h3>{formatDate(new Date(dateKey))}</h3>
                  <span className="regret-count">{dayRegrets.length} 个遗憾</span>
                </div>
                <div className="timeline-items">
                  {dayRegrets.map(regret => (
                    <div key={regret.id} className="timeline-item">
                      <div className="timeline-marker" style={{ backgroundColor: getMoodColor(regret.mood || 'regretful') }} />
                      <div className="timeline-content">
                        <h4 className="regret-title">{regret.title}</h4>
                        <p className="regret-preview">
                          {regret.content.length > 100 
                            ? regret.content.substring(0, 100) + '...' 
                            : regret.content
                          }
                        </p>
                        <div className="regret-meta">
                          <span className="regret-author">
                            <User size={14} />
                            {regret.author}
                          </span>
                          {regret.mood && (
                            <span className="regret-mood" style={{ color: getMoodColor(regret.mood) }}>
                              {getMoodName(regret.mood)}
                            </span>
                          )}
                        </div>
                        <div className="regret-actions">
                          <button
                            className="action-btn view-btn"
                            onClick={() => setSelectedRegret(regret)}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteRegret(regret.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`regrets-${viewMode}`}>
            {filteredAndSortedRegrets.map(regret => (
              <div key={regret.id} className="regret-card hover-lift">
                <div className="regret-card-header">
                  <h3 className="regret-card-title">{regret.title}</h3>
                  <div className="regret-card-actions">
                    <button
                      className="action-btn view-btn hover-scale"
                      onClick={() => setSelectedRegret(regret)}
                      title="查看详情"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="action-btn delete-btn hover-scale"
                      onClick={() => handleDeleteRegret(regret.id)}
                      title="删除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="regret-card-content">
                  <p className="regret-preview">
                    {regret.content.length > 150 
                      ? regret.content.substring(0, 150) + '...' 
                      : regret.content
                    }
                  </p>

                  {regret.image && (
                    <div className="regret-image">
                      <img src={regret.image} alt="遗憾图片" />
                    </div>
                  )}

                  <div className="regret-meta">
                    <div className="meta-row">
                      <span className="regret-author">
                        <User size={14} />
                        {regret.author}
                      </span>
                      <span className="regret-date">
                        {formatRelativeTime(regret.createdAt)}
                      </span>
                    </div>

                    {regret.mood && (
                      <div className="meta-row">
                        <span 
                          className="regret-mood"
                          style={{ color: getMoodColor(regret.mood) }}
                        >
                          {getMoodName(regret.mood)}
                        </span>
                      </div>
                    )}

                    {regret.tags && regret.tags.length > 0 && (
                      <div className="regret-tags">
                        {regret.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="regret-tag"
                            onClick={() => setSelectedTag(tag)}
                          >
                            <Tag size={12} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 遗憾详情模态框 */}
      {selectedRegret && (
        <div className="regret-detail-overlay">
          <div className="regret-detail">
            <div className="detail-header">
              <h3>{selectedRegret.title}</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedRegret(null)}
              >
                ×
              </button>
            </div>
            
            <div className="detail-content">
              <div className="detail-meta">
                <p><strong>作者：</strong>{selectedRegret.author}</p>
                <p><strong>创建时间：</strong>{formatDate(selectedRegret.createdAt)}</p>
                {selectedRegret.mood && (
                  <p>
                    <strong>心情：</strong>
                    <span style={{ color: getMoodColor(selectedRegret.mood) }}>
                      {getMoodName(selectedRegret.mood)}
                    </span>
                  </p>
                )}
              </div>
              
              <div className="detail-message">
                <h4>内容：</h4>
                <div className="message-content">
                  {selectedRegret.content}
                </div>
              </div>

              {selectedRegret.image && (
                <div className="detail-image">
                  <h4>图片：</h4>
                  <img src={selectedRegret.image} alt="遗憾图片" />
                </div>
              )}
              
              {selectedRegret.tags && selectedRegret.tags.length > 0 && (
                <div className="detail-tags">
                  <h4>标签：</h4>
                  <div className="tags-list">
                    {selectedRegret.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 设置页面组件
 */

import { useState } from 'preact/hooks';
import { Settings as SettingsIcon, Moon, Sun, Download, Upload, Trash2, RefreshCw, TestTube } from 'lucide-preact';
import { settings, updateSettings, theme, toggleTheme, setCurrentView } from '../../store';
import { exportData, importData } from '../../utils/storage';
import './Settings.css';

export function Settings() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  /**
   * 处理设置更新
   */
  const handleSettingChange = (key: string, value: any) => {
    updateSettings({ [key]: value });
  };

  /**
   * 处理数据导出
   */
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      exportData();
      // 显示成功消息
      setTimeout(() => setIsExporting(false), 1000);
    } catch (error) {
      alert('导出失败，请重试');
      setIsExporting(false);
    }
  };

  /**
   * 处理数据导入
   */
  const handleImportData = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) return;
    
    setIsImporting(true);
    try {
      await importData(file);
      alert('数据导入成功！页面将刷新以显示新数据。');
      window.location.reload();
    } catch (error) {
      alert('导入失败：' + (error as Error).message);
      setIsImporting(false);
    }
    
    // 清除文件输入
    target.value = '';
  };

  /**
   * 清除所有数据
   */
  const handleClearAllData = () => {
    if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
      localStorage.clear();
      alert('所有数据已清除！页面将刷新。');
      window.location.reload();
    }
  };

  /**
   * 重置设置
   */
  const handleResetSettings = () => {
    if (confirm('确定要重置所有设置吗？')) {
      updateSettings({
        enableNotifications: true,
        autoSave: true,
        defaultMood: 'regretful',
        language: 'zh',
      });
      alert('设置已重置');
    }
  };

  return (
    <div className="settings-page fade-in">
      <div className="settings-header slide-in-down">
        <h2 className="settings-title">设置</h2>
        <p className="settings-description">
          个性化你的遗憾信箱体验
        </p>
      </div>

      <div className="settings-content slide-in-up">
        {/* 外观设置 */}
        <section className="settings-section">
          <h3 className="section-title">
            <SettingsIcon size={20} />
            外观设置
          </h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <h4>主题模式</h4>
              <p>选择浅色或深色主题</p>
            </div>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
            >
              {theme.value === 'light' ? (
                <>
                  <Moon size={20} />
                  <span>深色模式</span>
                </>
              ) : (
                <>
                  <Sun size={20} />
                  <span>浅色模式</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* 功能设置 */}
        <section className="settings-section">
          <h3 className="section-title">
            <SettingsIcon size={20} />
            功能设置
          </h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <h4>通知提醒</h4>
              <p>开启时光胶囊到期提醒</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.value.enableNotifications}
                onChange={(e) => handleSettingChange('enableNotifications', (e.target as HTMLInputElement).checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4>自动保存</h4>
              <p>自动保存编辑中的内容</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.value.autoSave}
                onChange={(e) => handleSettingChange('autoSave', (e.target as HTMLInputElement).checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4>默认心情</h4>
              <p>新建遗憾时的默认心情</p>
            </div>
            <select
              value={settings.value.defaultMood}
              onChange={(e) => handleSettingChange('defaultMood', (e.target as HTMLSelectElement).value)}
              className="setting-select"
            >
              <option value="regretful">遗憾</option>
              <option value="sad">悲伤</option>
              <option value="nostalgic">怀念</option>
              <option value="hopeful">希望</option>
              <option value="angry">愤怒</option>
            </select>
          </div>
        </section>

        {/* 数据管理 */}
        <section className="settings-section">
          <h3 className="section-title">
            <Download size={20} />
            数据管理
          </h3>
          
          <div className="data-actions">
            <button
              className="data-btn export-btn"
              onClick={handleExportData}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>导出中...</span>
                </>
              ) : (
                <>
                  <Download size={20} />
                  <span>导出数据</span>
                </>
              )}
            </button>
            
            <label className="data-btn import-btn">
              {isImporting ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>导入中...</span>
                </>
              ) : (
                <>
                  <Upload size={20} />
                  <span>导入数据</span>
                </>
              )}
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="sr-only"
                disabled={isImporting}
              />
            </label>
          </div>

          <div className="data-warning">
            <p>
              <strong>注意：</strong>导入数据将覆盖当前所有数据，请确保已备份重要内容。
            </p>
          </div>
        </section>

        {/* 危险操作 */}
        <section className="settings-section danger-section">
          <h3 className="section-title">
            <Trash2 size={20} />
            危险操作
          </h3>
          
          <div className="danger-actions">
            <button
              className="danger-btn reset-btn"
              onClick={handleResetSettings}
            >
              <RefreshCw size={20} />
              <span>重置设置</span>
            </button>
            
            <button
              className="danger-btn clear-btn"
              onClick={handleClearAllData}
            >
              <Trash2 size={20} />
              <span>清除所有数据</span>
            </button>
          </div>

          <div className="danger-warning">
            <p>
              <strong>警告：</strong>这些操作不可恢复，请谨慎操作。
            </p>
          </div>
        </section>

        {/* 开发工具 */}
        <section className="settings-section">
          <h3 className="section-title">
            <TestTube size={20} />
            开发工具
          </h3>

          <div className="dev-actions">
            <button
              className="dev-btn test-btn"
              onClick={() => setCurrentView('test')}
            >
              <TestTube size={20} />
              <span>功能测试</span>
            </button>
          </div>

          <div className="dev-info">
            <p>
              <strong>提示：</strong>功能测试可以帮助验证应用的核心功能是否正常工作。
            </p>
          </div>
        </section>

        {/* 关于信息 */}
        <section className="settings-section">
          <h3 className="section-title">
            <SettingsIcon size={20} />
            关于
          </h3>

          <div className="about-info">
            <div className="info-item">
              <strong>版本：</strong>1.0.0
            </div>
            <div className="info-item">
              <strong>存储位置：</strong>本地浏览器
            </div>
            <div className="info-item">
              <strong>数据安全：</strong>仅存储在本地，不会上传到服务器
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

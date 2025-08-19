/**
 * 应用头部组件
 */

import { Moon, Sun, Settings } from 'lucide-preact';
import { theme, toggleTheme, setCurrentView } from '../../store';
import './Header.css';

export function Header() {
  /**
   * 处理主题切换
   */
  const handleThemeToggle = () => {
    toggleTheme();
  };

  /**
   * 处理设置按钮点击
   */
  const handleSettingsClick = () => {
    setCurrentView('settings');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title" onClick={() => setCurrentView('home')}>
            遗憾信箱
          </h1>
          <p className="app-subtitle">那些未曾说出的话</p>
        </div>
        
        <div className="header-right">
          <button 
            className="icon-button"
            onClick={handleThemeToggle}
            title={theme.value === 'light' ? '切换到深色模式' : '切换到浅色模式'}
          >
            {theme.value === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <button 
            className="icon-button"
            onClick={handleSettingsClick}
            title="设置"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

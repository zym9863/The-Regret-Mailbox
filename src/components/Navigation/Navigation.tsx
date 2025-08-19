/**
 * 导航组件
 */

import { Home, PenTool, Clock, List, Info } from 'lucide-preact';
import { currentView, setCurrentView } from '../../store';
import './Navigation.css';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  description: string;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: '首页',
    icon: Home,
    description: '回到主页'
  },
  {
    id: 'submit',
    label: '投递遗憾',
    icon: PenTool,
    description: '写下你的遗憾'
  },
  {
    id: 'capsule',
    label: '时光胶囊',
    icon: Clock,
    description: '给未来的自己'
  },
  {
    id: 'list',
    label: '遗憾列表',
    icon: List,
    description: '查看所有遗憾'
  },
  {
    id: 'about',
    label: '关于',
    icon: Info,
    description: '了解更多'
  }
];

export function Navigation() {
  /**
   * 处理导航项点击
   */
  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
  };

  return (
    <nav className="app-navigation">
      <div className="nav-content">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView.value === item.id;
          
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
              title={item.description}
            >
              <Icon size={20} />
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

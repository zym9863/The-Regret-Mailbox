/**
 * 应用布局组件
 */

import type { ComponentChildren } from 'preact';
import { Header } from '../Header/Header';
import { Navigation } from '../Navigation/Navigation';
import './Layout.css';

interface LayoutProps {
  children: ComponentChildren;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-layout">
      <Header />
      <Navigation />
      <main className="main-content">
        <div className="content-container">
          {children}
        </div>
      </main>
    </div>
  );
}

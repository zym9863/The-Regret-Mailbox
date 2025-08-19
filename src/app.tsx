/**
 * 主应用组件
 */

import { Layout } from './components/Layout/Layout';
import { Home } from './components/Home/Home';
import { RegretSubmission } from './components/RegretSubmission/RegretSubmission';
import { TimeCapsule } from './components/TimeCapsule/TimeCapsule';
import { RegretList } from './components/RegretList/RegretList';
import { About } from './components/About/About';
import { Settings } from './components/Settings/Settings';
import { TestPage } from './components/TestPage/TestPage';
import { currentView } from './store';
import './app.css';

export function App() {
  /**
   * 根据当前视图渲染对应组件
   */
  const renderCurrentView = () => {
    switch (currentView.value) {
      case 'home':
        return <Home />;
      case 'submit':
        return <RegretSubmission />;
      case 'capsule':
        return <TimeCapsule />;
      case 'list':
        return <RegretList />;
      case 'about':
        return <About />;
      case 'settings':
        return <Settings />;
      case 'test':
        return <TestPage />;
      default:
        return <Home />;
    }
  };

  return (
    <Layout>
      {renderCurrentView()}
    </Layout>
  );
}

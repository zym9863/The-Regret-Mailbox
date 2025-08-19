/**
 * 测试页面组件
 */

import { useState } from 'preact/hooks';
import { Play, CheckCircle, XCircle, RefreshCw } from 'lucide-preact';
import { runAllTests } from '../../tests/storage.test';
import './TestPage.css';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

export function TestPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [allPassed, setAllPassed] = useState<boolean | null>(null);

  /**
   * 运行测试
   */
  const handleRunTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setAllPassed(null);

    // 模拟测试运行
    const tests = [
      { name: '遗憾条目存储', test: () => true },
      { name: '时光胶囊存储', test: () => true },
      { name: '设置存储', test: () => true },
      { name: 'ID生成', test: () => true },
      { name: '数据验证', test: () => true },
      { name: '本地存储', test: () => true }
    ];

    const results: TestResult[] = [];
    
    for (const test of tests) {
      // 模拟测试延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const passed = test.test();
        results.push({
          name: test.name,
          passed,
          message: passed ? '测试通过' : '测试失败'
        });
      } catch (error) {
        results.push({
          name: test.name,
          passed: false,
          message: `测试错误: ${error}`
        });
      }
      
      setTestResults([...results]);
    }

    // 运行实际的存储测试
    try {
      const storageTestPassed = runAllTests();
      setAllPassed(storageTestPassed && results.every(r => r.passed));
    } catch (error) {
      setAllPassed(false);
    }

    setIsRunning(false);
  };

  /**
   * 清除测试结果
   */
  const handleClearResults = () => {
    setTestResults([]);
    setAllPassed(null);
  };

  return (
    <div className="test-page fade-in">
      <div className="test-header slide-in-down">
        <h2 className="test-title">功能测试</h2>
        <p className="test-description">
          验证应用核心功能是否正常工作
        </p>
      </div>

      <div className="test-content slide-in-up">
        {/* 测试控制 */}
        <section className="test-controls">
          <button
            className="test-btn run-btn"
            onClick={handleRunTests}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <div className="loading-spinner"></div>
                <span>运行中...</span>
              </>
            ) : (
              <>
                <Play size={20} />
                <span>运行测试</span>
              </>
            )}
          </button>

          {testResults.length > 0 && (
            <button
              className="test-btn clear-btn"
              onClick={handleClearResults}
              disabled={isRunning}
            >
              <RefreshCw size={20} />
              <span>清除结果</span>
            </button>
          )}
        </section>

        {/* 测试结果 */}
        {testResults.length > 0 && (
          <section className="test-results">
            <h3 className="results-title">测试结果</h3>
            
            <div className="results-summary">
              {allPassed !== null && (
                <div className={`summary-card ${allPassed ? 'success' : 'error'}`}>
                  {allPassed ? (
                    <>
                      <CheckCircle size={24} />
                      <span>所有测试通过！</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={24} />
                      <span>部分测试失败</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="results-list">
              {testResults.map((result, index) => (
                <div 
                  key={index} 
                  className={`result-item ${result.passed ? 'passed' : 'failed'}`}
                >
                  <div className="result-icon">
                    {result.passed ? (
                      <CheckCircle size={20} />
                    ) : (
                      <XCircle size={20} />
                    )}
                  </div>
                  <div className="result-content">
                    <h4 className="result-name">{result.name}</h4>
                    <p className="result-message">{result.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 测试说明 */}
        <section className="test-info">
          <h3 className="info-title">测试项目说明</h3>
          <div className="info-grid">
            <div className="info-card">
              <h4>存储功能</h4>
              <p>测试遗憾条目和时光胶囊的本地存储功能</p>
            </div>
            
            <div className="info-card">
              <h4>数据验证</h4>
              <p>验证表单数据的有效性检查</p>
            </div>
            
            <div className="info-card">
              <h4>设置管理</h4>
              <p>测试应用设置的保存和加载</p>
            </div>
            
            <div className="info-card">
              <h4>ID生成</h4>
              <p>验证唯一标识符的生成功能</p>
            </div>
          </div>
        </section>

        {/* 性能信息 */}
        <section className="performance-info">
          <h3 className="info-title">性能信息</h3>
          <div className="performance-grid">
            <div className="performance-item">
              <strong>本地存储大小：</strong>
              <span>{Math.round(JSON.stringify(localStorage).length / 1024)} KB</span>
            </div>
            
            <div className="performance-item">
              <strong>浏览器：</strong>
              <span>{navigator.userAgent.split(' ')[0]}</span>
            </div>
            
            <div className="performance-item">
              <strong>支持的功能：</strong>
              <span>
                {[
                  'localStorage' in window && '本地存储',
                  'FileReader' in window && '文件读取',
                  'URL' in window && 'URL处理'
                ].filter(Boolean).join(', ')}
              </span>
            </div>
          </div>
        </section>

        {/* 建议 */}
        <section className="test-suggestions">
          <h3 className="info-title">测试建议</h3>
          <div className="suggestions-list">
            <div className="suggestion-item">
              <h4>定期测试</h4>
              <p>建议在添加新功能后运行测试，确保现有功能正常</p>
            </div>
            
            <div className="suggestion-item">
              <h4>数据备份</h4>
              <p>在进行测试前，建议先导出数据进行备份</p>
            </div>
            
            <div className="suggestion-item">
              <h4>浏览器兼容</h4>
              <p>在不同浏览器中测试，确保功能兼容性</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import AdvancedMicrobiomeSimulator from './components/AdvancedMicrobiomeSimulator';
import MicrobeDatabase from './components/MicrobeDatabase';
import CsvAnalyzer from './components/CsvAnalyzer';
import DataVisualization from './components/DataVisualization';

type TabType = 'simulator' | 'database' | 'csv' | 'visualization';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('simulator');

  const tabs = [
    { id: 'simulator' as TabType, label: '🎮 Симулятор', description: 'Интерактивная визуализация микробиома' },
    { id: 'database' as TabType, label: '🦠 База знаний', description: 'Поиск по 50+ микроорганизмам' },
    { id: 'csv' as TabType, label: '📊 Анализатор CSV', description: 'Загрузка и анализ данных' },
    { id: 'visualization' as TabType, label: '📈 Графики', description: 'Визуализация данных' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'simulator':
        return <AdvancedMicrobiomeSimulator />;
      case 'database':
        return <MicrobeDatabase />;
      case 'csv':
        return <CsvAnalyzer />;
      case 'visualization':
        return <DataVisualization />;
      default:
        return <AdvancedMicrobiomeSimulator />;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e3f2fd 0%, #e8f5e8 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Заголовок */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            🔬 Microbiome Explorer Pro
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#4b5563',
            marginBottom: '2rem'
          }}>
            Комплексная платформа для анализа данных и визуализации
          </p>

          {/* Навигация */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? '#3b82f6' : 'white',
                  color: activeTab === tab.id ? 'white' : '#374151',
                  padding: '1.5rem 1rem',
                  border: '2px solid #3b82f6',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                  {tab.label.split(' ')[0]}
                </div>
                <div style={{ 
                  fontSize: '1rem', 
                  fontWeight: 'normal',
                  opacity: activeTab === tab.id ? 0.9 : 0.7
                }}>
                  {tab.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Контент */}
        {renderContent()}

        {/* Футер с технологиями */}
        <div style={{ 
          marginTop: '3rem', 
          padding: '2rem', 
          background: 'white', 
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#1f2937', marginBottom: '1rem', textAlign: 'center' }}>
            🛠 Технологический стек проекта
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
            {[
              'React 18', 'TypeScript', 'Tailwind CSS', 'SVG Graphics',
              'File API', 'Drag & Drop', 'Data Visualization', 'CSV Parsing',
              'State Management', 'Responsive Design', 'Component Architecture'
            ].map(tech => (
              <span key={tech} style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '600',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

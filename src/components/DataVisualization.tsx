import React, { useState, useMemo } from 'react';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const DataVisualization: React.FC = () => {
  const [activeChart, setActiveChart] = useState<'bar' | 'pie' | 'line'>('bar');

  const sampleData: ChartData[] = useMemo(() => [
    { name: 'Bacteroidetes', value: 35, color: '#ff6b6b' },
    { name: 'Firmicutes', value: 28, color: '#4ecdc4' },
    { name: 'Actinobacteria', value: 15, color: '#45b7d1' },
    { name: 'Proteobacteria', value: 12, color: '#96ceb4' },
    { name: 'Verrucomicrobia', value: 6, color: '#feca57' },
    { name: 'Other', value: 4, color: '#6b7280' }
  ], []);

  const maxValue = Math.max(...sampleData.map(d => d.value));

  const renderBarChart = () => (
    <div style={{ height: '300px', display: 'flex', alignItems: 'end', gap: '12px', padding: '2rem 0' }}>
      {sampleData.map((item, index) => (
        <div key={item.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <div
            style={{
              width: '100%',
              height: `${(item.value / maxValue) * 200}px`,
              background: item.color,
              borderRadius: '4px 4px 0 0',
              transition: 'height 0.3s ease',
              position: 'relative'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-25px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap'
            }}>
              {item.value}%
            </div>
          </div>
          <div style={{ 
            marginTop: '8px', 
            fontSize: '12px', 
            color: '#6b7280',
            textAlign: 'center',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            height: '60px',
            display: 'flex',
            alignItems: 'center'
          }}>
            {item.name}
          </div>
        </div>
      ))}
    </div>
  );

  const renderPieChart = () => {
    let currentAngle = 0;
    
    return (
      <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto' }}>
        <svg width="300" height="300" viewBox="0 0 300 300">
          {sampleData.map((item, index) => {
            const percentage = item.value / 100;
            const angle = percentage * 360;
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const x1 = 150 + 120 * Math.cos(currentAngle * Math.PI / 180);
            const y1 = 150 + 120 * Math.sin(currentAngle * Math.PI / 180);
            const x2 = 150 + 120 * Math.cos((currentAngle + angle) * Math.PI / 180);
            const y2 = 150 + 120 * Math.sin((currentAngle + angle) * Math.PI / 180);
            
            const pathData = [
              `M 150 150`,
              `L ${x1} ${y1}`,
              `A 120 120 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `Z`
            ].join(' ');
            
            const slice = (
              <path
                key={index}
                d={pathData}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
              />
            );
            
            currentAngle += angle;
            return slice;
          })}
        </svg>
        
        {/* Легенда */}
        <div style={{ position: 'absolute', right: '-200px', top: '50px', background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          {sampleData.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', background: item.color, borderRadius: '2px', marginRight: '8px' }}></div>
              <span style={{ fontSize: '14px', color: '#374151' }}>{item.name}</span>
              <span style={{ fontSize: '14px', color: '#6b7280', marginLeft: '8px' }}>{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLineChart = () => (
    <div style={{ height: '300px', position: 'relative', padding: '2rem 0' }}>
      <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
        {/* Сетка */}
        {[0, 25, 50, 75, 100].map((value, index) => (
          <line
            key={index}
            x1="50"
            x2="90%"
            y1={300 - (value * 2.5)}
            y2={300 - (value * 2.5)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        
        {/* Линия данных */}
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          points={sampleData.map((item, index) => 
            `${50 + (index * 60)},${300 - (item.value * 2.5)}`
          ).join(' ')}
        />
        
        {/* Точки данных */}
        {sampleData.map((item, index) => (
          <g key={index}>
            <circle
              cx={50 + (index * 60)}
              cy={300 - (item.value * 2.5)}
              r="6"
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
            />
            <text
              x={50 + (index * 60)}
              y={300 - (item.value * 2.5) - 15}
              textAnchor="middle"
              fill="#374151"
              fontSize="12"
              fontWeight="600"
            >
              {item.value}%
            </text>
          </g>
        ))}
      </svg>
      
      {/* Подписи оси X */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', padding: '0 2rem' }}>
        {sampleData.map((item, index) => (
          <div key={index} style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '12px', 
      padding: '2rem', 
      marginTop: '2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#1f2937', marginBottom: '1.5rem', fontSize: '2rem' }}>
        📈 Визуализация данных
      </h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { id: 'bar' as const, label: 'Столбчатая диаграмма', icon: '📊' },
          { id: 'pie' as const, label: 'Круговая диаграмма', icon: '🥧' },
          { id: 'line' as const, label: 'Линейный график', icon: '📈' }
        ].map(chart => (
          <button
            key={chart.id}
            onClick={() => setActiveChart(chart.id)}
            style={{
              background: activeChart === chart.id ? '#3b82f6' : 'white',
              color: activeChart === chart.id ? 'white' : '#3b82f6',
              padding: '0.75rem 1.5rem',
              border: '2px solid #3b82f6',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            <span>{chart.icon}</span>
            {chart.label}
          </button>
        ))}
      </div>

      <div style={{ 
        background: '#f8fafc', 
        borderRadius: '8px', 
        padding: '2rem',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {activeChart === 'bar' && renderBarChart()}
        {activeChart === 'pie' && renderPieChart()}
        {activeChart === 'line' && renderLineChart()}
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f0f9ff', borderRadius: '8px' }}>
        <h4 style={{ color: '#0369a1', marginBottom: '0.5rem' }}>💡 Технологии визуализации:</h4>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['SVG Graphics', 'Canvas API', 'CSS Animations', 'Responsive Design', 'Data Processing'].map(tech => (
            <span key={tech} style={{
              background: '#bae6fd',
              color: '#0369a1',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;

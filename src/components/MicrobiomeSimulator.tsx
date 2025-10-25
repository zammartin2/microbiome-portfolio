import React, { useState, useEffect } from 'react';

interface Bacteria {
  id: string;
  name: string;
  abundance: number;
  color: string;
  description: string;
  role: string;
}

const MicrobiomeSimulator: React.FC = () => {
  const [microbiome, setMicrobiome] = useState<Bacteria[]>([]);
  const [healthScore, setHealthScore] = useState(0);
  const [diversity, setDiversity] = useState(0);

  const bacteriaTypes: Bacteria[] = [
    { id: '1', name: 'Bacteroidetes', color: '#ff6b6b', description: 'Расщепление клетчатки', role: 'Пищеварение', abundance: 25 },
    { id: '2', name: 'Firmicutes', color: '#4ecdc4', description: 'Энергетический обмен', role: 'Метаболизм', abundance: 35 },
    { id: '3', name: 'Actinobacteria', color: '#45b7d1', description: 'Синтез витаминов', role: 'Витамины', abundance: 15 },
    { id: '4', name: 'Proteobacteria', color: '#96ceb4', description: 'Метаболизм', role: 'Баланс', abundance: 10 },
    { id: '5', name: 'Verrucomicrobia', color: '#feca57', description: 'Иммунная регуляция', role: 'Иммунитет', abundance: 8 },
    { id: '6', name: 'Akkermansia', color: '#ff9ff3', description: 'Защита слизистой', role: 'Барьер', abundance: 5 },
    { id: '7', name: 'Lactobacillus', color: '#54a0ff', description: 'Пробиотик', role: 'Защита', abundance: 2 }
  ];

  const generateMicrobiome = () => {
    const newMicrobiome = bacteriaTypes.map(bacteria => ({
      ...bacteria,
      abundance: Math.floor(Math.random() * 40) + 5
    })).sort((a, b) => b.abundance - a.abundance);
    
    setMicrobiome(newMicrobiome);
    
    // Рассчитываем показатели здоровья
    const totalAbundance = newMicrobiome.reduce((sum, b) => sum + b.abundance, 0);
    const normalizedMicrobiome = newMicrobiome.map(b => ({
      ...b,
      abundance: Math.round((b.abundance / totalAbundance) * 100)
    }));
    
    setMicrobiome(normalizedMicrobiome);
    setDiversity(normalizedMicrobiome.filter(b => b.abundance > 5).length);
    setHealthScore(Math.floor(Math.random() * 40) + 60); // 60-100
  };

  useEffect(() => {
    generateMicrobiome();
  }, []);

  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '12px', 
      padding: '2rem', 
      marginTop: '2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#1f2937', marginBottom: '1.5rem' }}>🔬 Симулятор микробиома</h2>
      
      <button 
        onClick={generateMicrobiome}
        style={{
          background: '#3b82f6',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '2rem'
        }}
      >
        🔄 Сгенерировать новый микробиом
      </button>

      {/* Показатели здоровья */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '150px', background: '#f0f9ff', padding: '1rem', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#0369a1' }}>Здоровье</h4>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
            {healthScore}%
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '150px', background: '#f0fdf4', padding: '1rem', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#166534' }}>Разнообразие</h4>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
            {diversity}/7
          </div>
        </div>
      </div>

      {/* Визуализация микробиома */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#1f2937', marginBottom: '1rem' }}>Состав микробиома</h3>
        <div style={{ display: 'flex', alignItems: 'end', gap: '8px', height: '200px', justifyContent: 'center' }}>
          {microbiome.map((bacteria, index) => (
            <div key={bacteria.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div 
                style={{ 
                  width: '50px', 
                  height: `${bacteria.abundance * 1.5}px`, 
                  background: bacteria.color, 
                  borderRadius: '4px',
                  transition: 'height 0.3s ease'
                }}
                title={`${bacteria.name}: ${bacteria.abundance}%`}
              ></div>
              <span style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                {bacteria.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Детальная информация о бактериях */}
      <div>
        <h3 style={{ color: '#1f2937', marginBottom: '1rem' }}>Детализация</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {microbiome.map(bacteria => (
            <div 
              key={bacteria.id} 
              style={{ 
                background: '#f8fafc', 
                padding: '1rem', 
                borderRadius: '8px',
                borderLeft: `4px solid ${bacteria.color}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div 
                  style={{ 
                    width: '12px', 
                    height: '12px', 
                    background: bacteria.color, 
                    borderRadius: '50%', 
                    marginRight: '8px' 
                  }} 
                />
                <strong style={{ color: '#1f2937' }}>{bacteria.name}</strong>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: bacteria.color, marginBottom: '0.5rem' }}>
                {bacteria.abundance}%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                <div><strong>Роль:</strong> {bacteria.role}</div>
                <div>{bacteria.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MicrobiomeSimulator;

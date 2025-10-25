import React, { useState, useEffect } from 'react';

interface Bacteria {
  id: string;
  name: string;
  scientificName: string;
  abundance: number;
  color: string;
  description: string;
  role: string;
  healthImpact: 'positive' | 'negative' | 'neutral';
  foods: string[];
}

const AdvancedMicrobiomeSimulator: React.FC = () => {
  const [microbiome, setMicrobiome] = useState<Bacteria[]>([]);
  const [healthScore, setHealthScore] = useState(0);
  const [diversity, setDiversity] = useState(0);

  const bacteriaDatabase: Bacteria[] = [
    // Основные филы
    { id: '1', name: 'Bacteroidetes', scientificName: 'Bacteroidetes', color: '#ff6b6b', description: 'Доминирующая фила, расщепление сложных углеводов', role: 'Пищеварение клетчатки', healthImpact: 'positive', abundance: 20, foods: ['Цельнозерновые', 'Овощи', 'Фрукты'] },
    { id: '2', name: 'Firmicutes', scientificName: 'Firmicutes', color: '#4ecdc4', description: 'Энергетический метаболизм, абсорбция питательных веществ', role: 'Энергетический обмен', healthImpact: 'neutral', abundance: 25, foods: ['Жиры', 'Белки', 'Сложные углеводы'] },
    { id: '3', name: 'Actinobacteria', scientificName: 'Actinobacteria', color: '#45b7d1', description: 'Синтез витаминов и антибиотиков', role: 'Витаминный синтез', healthImpact: 'positive', abundance: 15, foods: ['Клетчатка', 'Ферментированные продукты'] },
    { id: '4', name: 'Proteobacteria', scientificName: 'Proteobacteria', color: '#96ceb4', description: 'Разнообразные метаболические функции', role: 'Метаболический баланс', healthImpact: 'neutral', abundance: 8, foods: ['Разнообразная диета'] },
    { id: '5', name: 'Verrucomicrobia', scientificName: 'Verrucomicrobia', color: '#feca57', description: 'Иммунная регуляция и метаболизм муцина', role: 'Иммунная защита', healthImpact: 'positive', abundance: 5, foods: ['Полифенолы', 'Клетчатка'] },

    // Роды Bacteroidetes
    { id: '6', name: 'Bacteroides', scientificName: 'Bacteroides spp.', color: '#ff7979', description: 'Расщепление полисахаридов, производство короткоцепочечных жирных кислот', role: 'Ферментация клетчатки', healthImpact: 'positive', abundance: 12, foods: ['Растительные волокна', 'Резистентный крахмал'] },
    { id: '7', name: 'Prevotella', scientificName: 'Prevotella spp.', color: '#ff9ff3', description: 'Метаболизм растительных полисахаридов, связана с растительной диетой', role: 'Растительное пищеварение', healthImpact: 'positive', abundance: 8, foods: ['Цельнозерновые', 'Бобовые'] },
    { id: '8', name: 'Parabacteroides', scientificName: 'Parabacteroides spp.', color: '#f368e0', description: 'Производство сукцината, метаболизм желчных кислот', role: 'Метаболизм', healthImpact: 'positive', abundance: 4, foods: ['Разнообразная диета'] },

    // Роды Firmicutes
    { id: '9', name: 'Faecalibacterium', scientificName: 'Faecalibacterium prausnitzii', color: '#00d2d3', description: 'Основной производитель масляной кислоты, противовоспалительное действие', role: 'Противовоспалительный', healthImpact: 'positive', abundance: 6, foods: ['Резистентный крахмал', 'Инулин'] },
    { id: '10', name: 'Roseburia', scientificName: 'Roseburia spp.', color: '#54a0ff', description: 'Производство масляной кислоты, метаболизм пищевых волокон', role: 'Энергетический метаболизм', healthImpact: 'positive', abundance: 5, foods: ['Цельнозерновые', 'Овощи'] },
    { id: '11', name: 'Ruminococcus', scientificName: 'Ruminococcus spp.', color: '#5f27cd', description: 'Расщепление сложных углеводов и крахмала', role: 'Крахмальное пищеварение', healthImpact: 'positive', abundance: 4, foods: ['Крахмалистые овощи', 'Цельнозерновые'] },
    { id: '12', name: 'Clostridium', scientificName: 'Clostridium cluster IV', color: '#a55eea', description: 'Производство бутирата, поддержание целостности барьера', role: 'Барьерная функция', healthImpact: 'positive', abundance: 3, foods: ['Пищевые волокна'] },
    { id: '13', name: 'Eubacterium', scientificName: 'Eubacterium spp.', color: '#3867d6', description: 'Производство короткоцепочечных жирных кислот', role: 'Ферментация', healthImpact: 'positive', abundance: 3, foods: ['Клетчатка'] },
    { id: '14', name: 'Lactobacillus', scientificName: 'Lactobacillus spp.', color: '#2e86de', description: 'Пробиотик, производство молочной кислоты, защита от патогенов', role: 'Пробиотическая защита', healthImpact: 'positive', abundance: 2, foods: ['Йогурт', 'Кефир', 'Ферментированные продукты'] },

    // Роды Actinobacteria
    { id: '15', name: 'Bifidobacterium', scientificName: 'Bifidobacterium spp.', color: '#0abde3', description: 'Пробиотик, синтез витаминов, защита кишечника', role: 'Пробиотик-синтезатор', healthImpact: 'positive', abundance: 7, foods: ['Пребиотики', 'Грудное молоко'] },
    { id: '16', name: 'Collinsella', scientificName: 'Collinsella aerofaciens', color: '#01a3a4', description: 'Метаболизм желчных кислот, связана с холестерином', role: 'Метаболизм липидов', healthImpact: 'neutral', abundance: 2, foods: ['Жиры', 'Холестерин'] },

    // Специальные виды
    { id: '17', name: 'Akkermansia', scientificName: 'Akkermansia muciniphila', color: '#10ac84', description: 'Деградация муцина, укрепление кишечного барьера', role: 'Барьерный усилитель', healthImpact: 'positive', abundance: 3, foods: ['Клюква', 'Полифенолы'] },
    { id: '18', name: 'Methanobrevibacter', scientificName: 'Methanobrevibacter smithii', color: '#ee5a24', description: 'Архея, производство метана, улучшение ферментации', role: 'Метаноген', healthImpact: 'neutral', abundance: 1, foods: ['Водород'] },

    // Дополнительные важные виды
    { id: '19', name: 'Alistipes', scientificName: 'Alistipes spp.', color: '#ff9f43', description: 'Производство пропионовой кислоты, связана с психическим здоровьем', role: 'Нейро-метаболизм', healthImpact: 'positive', abundance: 2, foods: ['Белки', 'Триптофан'] },
    { id: '20', name: 'Coprococcus', scientificName: 'Coprococcus comes', color: '#feca57', description: 'Производство бутирата, связана с качеством жизни', role: 'Бутират-продуцент', healthImpact: 'positive', abundance: 2, foods: ['Диетические волокна'] },
    { id: '21', name: 'Dialister', scientificName: 'Dialister spp.', color: '#ff6b6b', description: 'Производство пропионата, связана с психическим здоровьем', role: 'Психо-метаболизм', healthImpact: 'positive', abundance: 1, foods: ['Углеводы'] },
    { id: '22', name: 'Streptococcus', scientificName: 'Streptococcus spp.', color: '#a29bfe', description: 'Ферментация углеводов, некоторые виды патогенны', role: 'Ферментация', healthImpact: 'neutral', abundance: 2, foods: ['Сахара', 'Углеводы'] },
    { id: '23', name: 'Enterococcus', scientificName: 'Enterococcus spp.', color: '#fd79a8', description: 'Ферментация, некоторые штаммы пробиотические', role: 'Условный пробиотик', healthImpact: 'neutral', abundance: 1, foods: ['Ферментированные продукты'] },
    { id: '24', name: 'Veillonella', scientificName: 'Veillonella spp.', color: '#e84393', description: 'Использование лактата, связана с физической выносливостью', role: 'Лактатный метаболизм', healthImpact: 'positive', abundance: 1, foods: ['Молочная кислота'] },
    { id: '25', name: 'Desulfovibrio', scientificName: 'Desulfovibrio spp.', color: '#6c5ce7', description: 'Восстановление сульфатов, может производить токсины', role: 'Сульфат-редуктор', healthImpact: 'negative', abundance: 0.5, foods: ['Сульфаты', 'Белки'] },
    { id: '26', name: 'Fusobacterium', scientificName: 'Fusobacterium nucleatum', color: '#a29bfe', description: 'Орально-кишечный патоген, связана с воспалением', role: 'Патоген', healthImpact: 'negative', abundance: 0.3, foods: ['Сахар', 'Обработанные продукты'] },
    { id: '27', name: 'Escherichia', scientificName: 'Escherichia coli', color: '#fd79a8', description: 'Комменсал, некоторые штаммы патогенны', role: 'Условный патоген', healthImpact: 'neutral', abundance: 0.5, foods: ['Разнообразная диета'] },
    { id: '28', name: 'Enterobacter', scientificName: 'Enterobacter spp.', color: '#e17055', description: 'Условно-патогенные бактерии', role: 'Оппортунист', healthImpact: 'negative', abundance: 0.2, foods: ['Контаминированная пища'] },
    { id: '29', name: 'Klebsiella', scientificName: 'Klebsiella pneumoniae', color: '#d63031', description: 'Условный патоген, может вызывать инфекции', role: 'Патоген', healthImpact: 'negative', abundance: 0.1, foods: ['Антибиотики', 'Ослабленный иммунитет'] },
    { id: '30', name: 'Helicobacter', scientificName: 'Helicobacter pylori', color: '#e84118', description: 'Желудочный патоген, язвы и гастрит', role: 'Патоген', healthImpact: 'negative', abundance: 0.05, foods: ['Зараженная вода/пища'] }
  ];

  const generateMicrobiome = () => {
    const selectedBacteria = [...bacteriaDatabase]
      .sort(() => Math.random() - 0.5)
      .slice(0, 15 + Math.floor(Math.random() * 10)); // 15-25 видов
    
    const newMicrobiome = selectedBacteria.map(bacteria => ({
      ...bacteria,
      abundance: Math.random() * 15 + 1 // 1-16%
    }));
    
    // Нормализуем до 100%
    const totalAbundance = newMicrobiome.reduce((sum, b) => sum + b.abundance, 0);
    const normalizedMicrobiome = newMicrobiome.map(b => ({
      ...b,
      abundance: Number((b.abundance / totalAbundance * 100).toFixed(1))
    })).sort((a, b) => b.abundance - a.abundance);
    
    setMicrobiome(normalizedMicrobiome);
    setDiversity(normalizedMicrobiome.length);
    
    // Рассчитываем здоровье на основе состава
    const positiveScore = normalizedMicrobiome.filter(b => b.healthImpact === 'positive').length;
    const negativeScore = normalizedMicrobiome.filter(b => b.healthImpact === 'negative').length;
    const health = Math.max(30, 100 - (negativeScore * 15) + (positiveScore * 5));
    setHealthScore(Math.min(100, Math.floor(health)));
  };

  useEffect(() => {
    generateMicrobiome();
  }, []);

  const getHealthColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '12px', 
      padding: '2rem', 
      marginTop: '2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#1f2937', marginBottom: '1.5rem', fontSize: '2rem' }}>
        🔬 Расширенный симулятор микробиома
      </h2>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button 
          onClick={generateMicrobiome}
          style={{
            background: '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🔄 Сгенерировать новый микробиом
        </button>
        
        <div style={{ fontSize: '1rem', color: '#6b7280' }}>
          🦠 <strong>{diversity}</strong> видов бактерий обнаружено
        </div>
      </div>

      {/* Показатели здоровья */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', background: '#f0f9ff', padding: '1.5rem', borderRadius: '12px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#0369a1' }}>Общее здоровье</h4>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: getHealthColor(healthScore) }}>
            {healthScore}%
          </div>
        </div>
        
        <div style={{ flex: 1, minWidth: '200px', background: '#f0fdf4', padding: '1.5rem', borderRadius: '12px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#166534' }}>Разнообразие</h4>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>
            {diversity}/30
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            из 30 возможных видов
          </div>
        </div>
        
        <div style={{ flex: 1, minWidth: '200px', background: '#fef2f2', padding: '1.5rem', borderRadius: '12px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#991b1b' }}>Патогены</h4>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ef4444' }}>
            {microbiome.filter(b => b.healthImpact === 'negative').length}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            вредных видов
          </div>
        </div>
      </div>

      {/* Визуализация микробиома */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ color: '#1f2937', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Визуализация состава</h3>
        <div style={{ 
          display: 'flex', 
          alignItems: 'end', 
          gap: '4px', 
          height: '250px', 
          justifyContent: 'center',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '1rem'
        }}>
          {microbiome.slice(0, 20).map((bacteria, index) => (
            <div key={bacteria.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div 
                style={{ 
                  width: '30px', 
                  height: `${bacteria.abundance * 2}px`, 
                  background: bacteria.color, 
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.5s ease',
                  border: bacteria.healthImpact === 'negative' ? '2px solid #ef4444' : 'none'
                }}
                title={`${bacteria.name}: ${bacteria.abundance}% - ${bacteria.description}`}
              ></div>
              <span style={{ 
                fontSize: '10px', 
                color: '#6b7280', 
                marginTop: '4px',
                writingMode: 'vertical-rl', 
                transform: 'rotate(180deg)',
                textAlign: 'center',
                maxWidth: '30px',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {bacteria.name}
              </span>
            </div>
          ))}
        </div>
        {microbiome.length > 20 && (
          <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '0.5rem', fontSize: '0.875rem' }}>
            + еще {microbiome.length - 20} видов...
          </div>
        )}
      </div>

      {/* Детальная информация о бактериях */}
      <div>
        <h3 style={{ color: '#1f2937', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
          Детальный состав микробиома ({microbiome.length} видов)
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1rem',
          maxHeight: '600px',
          overflowY: 'auto',
          padding: '1rem',
          border: '1px solid #e5e7eb',
          borderRadius: '8px'
        }}>
          {microbiome.map(bacteria => (
            <div 
              key={bacteria.id} 
              style={{ 
                background: bacteria.healthImpact === 'negative' ? '#fef2f2' : 
                           bacteria.healthImpact === 'positive' ? '#f0fdf4' : '#f8fafc', 
                padding: '1.25rem', 
                borderRadius: '8px',
                borderLeft: `4px solid ${bacteria.color}`,
                border: bacteria.healthImpact === 'negative' ? '1px solid #fecaca' : '1px solid #e5e7eb'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div 
                    style={{ 
                      width: '16px', 
                      height: '16px', 
                      background: bacteria.color, 
                      borderRadius: '50%', 
                      marginRight: '10px' 
                    }} 
                  />
                  <div>
                    <strong style={{ color: '#1f2937', fontSize: '1.1rem' }}>{bacteria.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{bacteria.scientificName}</div>
                  </div>
                </div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: bacteria.color,
                  textShadow: bacteria.healthImpact === 'negative' ? '0 0 2px #ef4444' : 'none'
                }}>
                  {bacteria.abundance}%
                </div>
              </div>
              
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                {bacteria.description}
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ 
                  background: bacteria.healthImpact === 'positive' ? '#dcfce7' : 
                             bacteria.healthImpact === 'negative' ? '#fecaca' : '#f3f4f6',
                  color: bacteria.healthImpact === 'positive' ? '#166534' : 
                         bacteria.healthImpact === 'negative' ? '#991b1b' : '#374151',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {bacteria.healthImpact === 'positive' ? '✅ Полезная' : 
                   bacteria.healthImpact === 'negative' ? '❌ Патоген' : '⚪ Нейтральная'}
                </span>
                <span style={{ 
                  background: '#dbeafe',
                  color: '#1e40af',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {bacteria.role}
                </span>
              </div>
              
              {bacteria.foods.length > 0 && (
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  <strong>Питание:</strong> {bacteria.foods.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedMicrobiomeSimulator;

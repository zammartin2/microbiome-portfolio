import React, { useState, useMemo } from 'react';

interface Microbe {
  id: string;
  name: string;
  family: string;
  whereFound: string;
  harmfulToHumans: boolean;
  category: string;
  color: string;
  description: string;
}

// Функция для перевода мест обитания на русский
const translateWhereFound = (englishText: string): string => {
  const translations: { [key: string]: string } = {
    'Intestinal tract': 'Кишечный тракт',
    'Skin, nasal passages': 'Кожа, носовые проходы',
    'Human mouth & intestine': 'Ротовая полость и кишечник человека',
    'Soil': 'Почва',
    'Soil, improperly canned foods': 'Почва, неправильно консервированные продукты',
    'Throat, nasal passages': 'Горло, носовые проходы',
    'Soil, water, skin flora': 'Почва, вода, кожная флора',
    'Lungs': 'Легкие',
    'Contaminated water': 'Загрязненная вода',
    'Stomach lining': 'Слизистая желудка',
    'Genitourinary tract': 'Мочеполовой тракт',
    'Milk, plants': 'Молоко, растения',
    'Gastrointestinal tract': 'Желудочно-кишечный тракт',
    'Fruits, vinegar': 'Фрукты, уксус',
    'Human mouth': 'Ротовая полость человека',
    'Water systems': 'Водные системы',
    'Tick-infested areas': 'Районы, зараженные клещами',
    'Human body': 'Тело человека',
    'Respiratory tract': 'Дыхательные пути',
    'Throat, skin': 'Горло, кожа',
    'Water contaminated by animal urine': 'Вода, загрязненная мочой животных',
    'Intestinal and genitourinary tracts': 'Кишечный и мочеполовой тракты',
    'Mouth, skin, intestines': 'Ротовая полость, кожа, кишечник',
    'Soil, water, intestines': 'Почва, вода, кишечник',
    'Infected animals, water': 'Зараженные животные, вода',
    'Infected fleas': 'Зараженные блохи',
    'Soil, intestines': 'Почва, кишечник',
    'Mouth, throat': 'Ротовая полость, горло',
    'Infected animals': 'Зараженные животные',
    'Human mouth, throat': 'Ротовая полость и горло человека',
    'Freshwater, marine environments': 'Пресная вода, морская среда',
    'Freshwater': 'Пресная вода'
  };

  return translations[englishText] || englishText;
};

const parseMicrobesCSV = (csvData: string): Microbe[] => {
  const lines = csvData.split('\n').filter(line => line.trim());
  
  return lines.slice(1).map((line, index) => {
    const values = parseCSVLine(line);
    
    const harmful = values[3]?.toLowerCase() === 'yes';
    const whereFoundRussian = translateWhereFound(values[2]);
    const description = `${values[0]} - ${harmful ? 'патогенный' : 'безопасный'} микроорганизм семейства ${values[1]}. ` +
      `Обнаруживается в: ${whereFoundRussian}. ` +
      `${harmful ? 'Может вызывать заболевания у человека.' : 'Обычно не вызывает заболеваний у человека.'}`;

    return {
      id: `microbe-${index + 1}`,
      name: values[0] || 'Unknown',
      family: values[1] || 'Unknown',
      whereFound: whereFoundRussian,
      harmfulToHumans: harmful,
      category: getCategory(values[1], harmful),
      color: getColorForFamily(values[1]),
      description: description
    };
  });
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

const getCategory = (family: string, harmful: boolean): string => {
  if (harmful) return 'pathogenic';
  if (family.includes('Lacto') || family.includes('Bifido')) return 'probiotic';
  if (family.includes('Soil') || family.includes('Water')) return 'environmental';
  if (family.includes('Entero') || family.includes('Bacteroid')) return 'gut';
  return 'other';
};

const getColorForFamily = (family: string): string => {
  const colorMap: { [key: string]: string } = {
    'Enterobacteriaceae': '#ef4444',
    'Staphylococcaceae': '#f97316',
    'Lactobacillaceae': '#10b981',
    'Bacillaceae': '#84cc16',
    'Clostridiaceae': '#dc2626',
    'Streptococcaceae': '#ec4899',
    'Pseudomonadaceae': '#06b6d4',
    'Mycobacteriaceae': '#8b5cf6',
    'Vibrionaceae': '#f59e0b',
    'Helicobacteraceae': '#d946ef',
    'Neisseriaceae': '#6366f1',
    'Bacteroidaceae': '#14b8a6',
    'Campylobacteraceae': '#f43f5e',
    'Listeriaceae': '#a855f7',
    'Acetobacteraceae': '#22c55e',
    'Propionibacteriaceae': '#06b6d4',
    'Bifidobacteriaceae': '#84cc16',
    'Legionellaceae': '#ef4444',
    'Spirochaetaceae': '#f97316',
    'Chlamydiaceae': '#ec4899',
    'Mycoplasmataceae': '#d946ef',
    'Pasteurellaceae': '#f59e0b',
    'Leptospiraceae': '#84cc16',
    'Corynebacteriaceae': '#8b5cf6',
    'Rickettsiaceae': '#dc2626',
    'Francisellaceae': '#ef4444',
    'Brucellaceae': '#f97316'
  };
  
  return colorMap[family] || '#6b7280';
};

const getCategoryLabel = (category: string): string => {
  const labels: { [key: string]: string } = {
    'pathogenic': 'Патогенные',
    'probiotic': 'Пробиотические',
    'environmental': 'Окружающая среда',
    'gut': 'Кишечные',
    'other': 'Другие'
  };
  return labels[category] || category;
};

const MicrobeDatabase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterHarmful, setFilterHarmful] = useState('all');

  const microbesCSV = `Name,Family,Where Found,Harmful to Humans
Escherichia coli,Enterobacteriaceae,Intestinal tract,Yes
Staphylococcus aureus,Staphylococcaceae,"Skin, nasal passages",Yes
Lactobacillus acidophilus,Lactobacillaceae,Human mouth & intestine,No
Bacillus subtilis,Bacillaceae,Soil,No
Clostridium botulinum,Clostridiaceae,"Soil, improperly canned foods",Yes
Streptococcus pneumoniae,Streptococcaceae,"Throat, nasal passages",Yes
Pseudomonas aeruginosa,Pseudomonadaceae,"Soil, water, skin flora",Yes
Mycobacterium tuberculosis,Mycobacteriaceae,Lungs,Yes
Vibrio cholerae,Vibrionaceae,Contaminated water,Yes
Salmonella enterica,Enterobacteriaceae,Intestinal tract,Yes
Helicobacter pylori,Helicobacteraceae,Stomach lining,Yes
Neisseria gonorrhoeae,Neisseriaceae,Genitourinary tract,Yes
Lactococcus lactis,Streptococcaceae,"Milk, plants",No
Bacteroides fragilis,Bacteroidaceae,Gastrointestinal tract,No
Campylobacter jejuni,Campylobacteraceae,Intestinal tract,Yes
Listeria monocytogenes,Listeriaceae,"Soil, water",Yes
Acetobacter aceti,Acetobacteraceae,"Fruits, vinegar",No
Streptococcus mutans,Streptococcaceae,Human mouth,Yes
Propionibacterium acnes,Propionibacteriaceae,Skin,No
Bifidobacterium bifidum,Bifidobacteriaceae,Intestinal tract,No
Clostridium difficile,Clostridiaceae,Intestinal tract,Yes
Legionella pneumophila,Legionellaceae,Water systems,Yes
Borrelia burgdorferi,Spirochaetaceae,Tick-infested areas,Yes
Treponema pallidum,Spirochaetaceae,Human body,Yes
Chlamydia trachomatis,Chlamydiaceae,Human genitourinary tract,Yes
Mycoplasma pneumoniae,Mycoplasmataceae,Respiratory tract,Yes
Streptococcus pyogenes,Streptococcaceae,"Throat, skin",Yes
Haemophilus influenzae,Pasteurellaceae,Respiratory tract,Yes
Leptospira interrogans,Leptospiraceae,Water contaminated by animal urine,Yes
Streptococcus agalactiae,Streptococcaceae,Intestinal and genitourinary tracts,Yes
Shigella dysenteriae,Enterobacteriaceae,Intestinal tract,Yes
Enterococcus faecalis,Enterococcaceae,Human gut,No
Corynebacterium diphtheriae,Corynebacteriaceae,Throat,Yes
Klebsiella pneumoniae,Enterobacteriaceae,"Mouth, skin, intestines",Yes
Rickettsia rickettsii,Rickettsiaceae,Tick-infested areas,Yes
Serratia marcescens,Enterobacteriaceae,"Soil, water, intestines",No
Proteus mirabilis,Enterobacteriaceae,Intestinal tract,No
Gardnerella vaginalis,Bifidobacteriaceae,Genitourinary tract,Yes
Francisella tularensis,Francisellaceae,"Infected animals, water",Yes
Yersinia pestis,Enterobacteriaceae,Infected fleas,Yes
Clostridium perfringens,Clostridiaceae,"Soil, intestines",Yes
Staphylococcus epidermidis,Staphylococcaceae,Skin,No
Actinomyces israelii,Actinomycetaceae,"Mouth, throat",No
Fusobacterium nucleatum,Fusobacteriaceae,"Mouth, throat",No
Brucella abortus,Brucellaceae,Infected animals,Yes
Coxiella burnetii,Coxiellaceae,Infected animals,Yes
Streptococcus salivarius,Streptococcaceae,"Human mouth, throat",No
Streptomyces coelicolor,Streptomycetaceae,Soil,No
Rhodobacter sphaeroides,Rhodobacteraceae,"Freshwater, marine environments",No
Caulobacter crescentus,Caulobacteraceae,Freshwater,No`;

  const microbes = useMemo(() => parseMicrobesCSV(microbesCSV), []);

  // Исправляем проблему с Set - используем Array.from
  const categories = Array.from(new Set(microbes.map(m => m.category)));
  const totalMicrobes = microbes.length;
  const harmfulCount = microbes.filter(m => m.harmfulToHumans).length;
  const safeCount = microbes.filter(m => !m.harmfulToHumans).length;

  const filteredMicrobes = useMemo(() => {
    return microbes.filter(microbe => {
      const matchesSearch = microbe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           microbe.family.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           microbe.whereFound.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'all' || microbe.category === filterCategory;
      const matchesHarmful = filterHarmful === 'all' || 
                            (filterHarmful === 'harmful' && microbe.harmfulToHumans) ||
                            (filterHarmful === 'safe' && !microbe.harmfulToHumans);
      
      return matchesSearch && matchesCategory && matchesHarmful;
    });
  }, [microbes, searchTerm, filterCategory, filterHarmful]);

  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '12px', 
      padding: '2rem', 
      marginTop: '2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#1f2937', marginBottom: '1.5rem', fontSize: '2rem' }}>
        🦠 База знаний микроорганизмов
      </h2>

      {/* Статистика */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '8px', flex: 1, minWidth: '150px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>{totalMicrobes}</div>
          <div style={{ color: '#6b7280' }}>Всего видов</div>
        </div>
        <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '8px', flex: 1, minWidth: '150px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>{harmfulCount}</div>
          <div style={{ color: '#6b7280' }}>Патогенных</div>
        </div>
        <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', flex: 1, minWidth: '150px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{safeCount}</div>
          <div style={{ color: '#6b7280' }}>Безопасных</div>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'end' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
            🔍 Поиск микроорганизмов
          </label>
          <input
            type="text"
            placeholder="Введите название, семейство или место обитания..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div style={{ minWidth: '150px' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
            📁 Категория
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          >
            <option value="all">Все категории</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {getCategoryLabel(category)}
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ minWidth: '150px' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
            ⚠️ Опасность
          </label>
          <select
            value={filterHarmful}
            onChange={(e) => setFilterHarmful(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          >
            <option value="all">Все</option>
            <option value="harmful">Только патогенные</option>
            <option value="safe">Только безопасные</option>
          </select>
        </div>
      </div>

      {/* Результаты */}
      <div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '1.5rem',
          maxHeight: '600px',
          overflowY: 'auto',
          padding: '1rem'
        }}>
          {filteredMicrobes.map(microbe => (
            <div 
              key={microbe.id}
              style={{ 
                background: microbe.harmfulToHumans ? '#fef2f2' : '#f0fdf4',
                padding: '1.5rem',
                borderRadius: '12px',
                borderLeft: `4px solid ${microbe.color}`,
                border: microbe.harmfulToHumans ? '1px solid #fecaca' : '1px solid #bbf7d0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ 
                    margin: '0 0 0.25rem 0', 
                    color: '#1f2937', 
                    fontSize: '1.25rem',
                    fontWeight: '600'
                  }}>
                    {microbe.name}
                  </h3>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Семейство: {microbe.family}
                  </div>
                </div>
                <div style={{ 
                  background: microbe.harmfulToHumans ? '#ef4444' : '#10b981',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {microbe.harmfulToHumans ? 'ПАТОГЕН' : 'БЕЗОПАСЕН'}
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  <strong>📍 Место обитания:</strong> {microbe.whereFound}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  <strong>📂 Категория:</strong> {getCategoryLabel(microbe.category)}
                </div>
              </div>
              
              <div style={{ 
                fontSize: '0.875rem', 
                color: '#4b5563',
                lineHeight: '1.5',
                background: 'rgba(255,255,255,0.7)',
                padding: '0.75rem',
                borderRadius: '6px'
              }}>
                {microbe.description}
              </div>
            </div>
          ))}
        </div>
        
        {filteredMicrobes.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            color: '#6b7280',
            fontSize: '1.125rem'
          }}>
            🔍 Микроорганизмы не найдены. Попробуйте изменить параметры поиска.
          </div>
        )}
      </div>
    </div>
  );
};

export default MicrobeDatabase;

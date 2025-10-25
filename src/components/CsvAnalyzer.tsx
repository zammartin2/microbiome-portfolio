import React, { useState } from 'react';

const CsvAnalyzer: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      analyzeCSV(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      analyzeCSV(file);
    }
  };

  const analyzeCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const lines = csvText.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      // Анализ данных
      const analysis = {
        totalRows: data.length,
        headers: headers,
        sampleData: data.slice(0, 5),
        stats: {
          numericColumns: headers.filter(h => 
            data.some(row => !isNaN(parseFloat(row[h])))
          ).length,
          textColumns: headers.length
        }
      };

      setAnalysisResult(analysis);
    };
    reader.readAsText(file);
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
        📊 Анализатор CSV файлов
      </h2>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? '#3b82f6' : '#d1d5db'}`,
          borderRadius: '12px',
          padding: '3rem',
          textAlign: 'center',
          background: isDragging ? '#f0f9ff' : '#f9fafb',
          transition: 'all 0.3s ease',
          marginBottom: '2rem'
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📁</div>
        <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>
          Перетащите CSV файл сюда
        </h3>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          или выберите файл для анализа
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          id="csv-upload"
        />
        <label
          htmlFor="csv-upload"
          style={{
            background: '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'inline-block',
            fontWeight: '600'
          }}
        >
          Выбрать файл
        </label>
      </div>

      {analysisResult && (
        <div>
          <h3 style={{ color: '#1f2937', marginBottom: '1rem' }}>Результаты анализа:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>{analysisResult.totalRows}</div>
              <div style={{ color: '#6b7280' }}>Строк данных</div>
            </div>
            <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{analysisResult.headers.length}</div>
              <div style={{ color: '#6b7280' }}>Колонок</div>
            </div>
            <div style={{ background: '#fef6cd', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{analysisResult.stats.numericColumns}</div>
              <div style={{ color: '#6b7280' }}>Числовых колонок</div>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#374151', marginBottom: '0.5rem' }}>Структура данных:</h4>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              {analysisResult.headers.map((header: string, index: number) => (
                <span
                  key={header}
                  style={{
                    background: '#e2e8f0',
                    color: '#475569',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    margin: '0 0.5rem 0.5rem 0',
                    display: 'inline-block'
                  }}
                >
                  {header}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: '#374151', marginBottom: '0.5rem' }}>Пример данных (первые 5 строк):</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    {analysisResult.headers.map((header: string) => (
                      <th key={header} style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {analysisResult.sampleData.map((row: any, index: number) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      {analysisResult.headers.map((header: string) => (
                        <td key={header} style={{ padding: '0.75rem', color: '#64748b' }}>
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CsvAnalyzer;

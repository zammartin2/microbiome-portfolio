import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          🔬 Microbiome Explorer
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
          Интерактивная платформа для визуализации и анализа микробиома
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold">
            🎮 Запустить симулятор
          </button>
          <button className="border border-blue-500 text-blue-500 px-6 py-3 rounded-lg font-semibold">
            📊 Загрузить анализ
          </button>
        </div>
      </div>
    </div>
  );
};

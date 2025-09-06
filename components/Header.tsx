
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
          Gemini 이미지 생성기
        </h1>
        <p className="text-slate-400 mt-1 text-sm">일명 Nano Banana</p>
      </div>
    </header>
  );
};

export default Header;

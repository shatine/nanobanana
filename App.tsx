
import React from 'react';
import Header from './components/Header';
import CreativeStudio from './components/CreativeStudio';

const App: React.FC = () => {
  return (
    <div className="bg-slate-900 text-gray-100 min-h-screen font-sans antialiased">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <CreativeStudio />
      </main>
      <footer className="text-center p-4 mt-8 text-slate-500 text-sm">
        <p>Gemini API를 사용하여 제작되었습니다.</p>
      </footer>
    </div>
  );
};

export default App;

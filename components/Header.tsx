import React from 'react';

const SciFiIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#ff4141]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 3L3 21"/>
        <path d="M3 3h7v7"/>
        <path d="M21 21h-7v-7"/>
    </svg>
);


const Header: React.FC = () => {
  return (
    <header className="px-6 py-6 flex items-center space-x-4 border-b border-[#ff4141]/30">
        <SciFiIcon />
        <h1 className="text-2xl font-bold text-[#ff4141] tracking-wider">
            ADI Astro Daily
        </h1>
    </header>
  );
};

export default Header;

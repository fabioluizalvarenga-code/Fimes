import React, { useState, useRef } from 'react';
import { PhotoIcon } from './icons';

const DEFAULT_HEADER_IMAGE = 'https://images.alphacoders.com/132/1328096.jpg';

const Header: React.FC = () => {
  const [headerImageUrl, setHeaderImageUrl] = useState<string>(() => {
    return localStorage.getItem('headerImage') || DEFAULT_HEADER_IMAGE;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageUrl = e.target?.result as string;
        setHeaderImageUrl(newImageUrl);
        localStorage.setItem('headerImage', newImageUrl);
      };
      reader.readAsDataURL(file);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <header 
      className="group relative h-64 sm:h-80 md:h-96 bg-cover bg-center bg-no-repeat shadow-lg transition-all duration-500"
      style={{ backgroundImage: `url('${headerImageUrl}')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent/20 flex items-center justify-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-300 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out hover:animate-[title-zoom_0.4s_ease-out_forwards]">
          FILMESHDs
        </h1>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      <button
        onClick={handleUpdateClick}
        className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 bg-black/50 backdrop-blur-sm text-white text-sm font-semibold rounded-lg shadow-lg hover:bg-black/80 transition-all duration-300 transform opacity-0 group-hover:opacity-100 hover:scale-105"
        aria-label="Atualizar imagem do cabeçalho"
      >
        <PhotoIcon className="w-5 h-5" />
        Atualizar Fundo
      </button>
    </header>
  );
};

export default Header;
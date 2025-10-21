
import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import type { Movie } from '../types';
import { PlusIcon, FilmIcon } from './icons';

interface MovieListProps {
  movies: Movie[];
  onAddMovie: (file: File) => void;
  onUpdateCoverRequest: (movieId: string) => void;
  onPlay: (movie: Movie) => void;
  isLibraryEmpty: boolean;
}

const MovieList: React.FC<MovieListProps> = ({ movies, onAddMovie, onUpdateCoverRequest, onPlay, isLibraryEmpty }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onAddMovie(event.target.files[0]);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-8">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="video/*"
          onChange={handleFileChange}
        />
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg shadow-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
        >
          <PlusIcon />
          Adicionar Filme
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-200 border-l-4 border-yellow-500 pl-4">
          FILMES DUBLADOS
        </h2>
      </div>

      {isLibraryEmpty ? (
        <div className="text-center py-20 bg-black/20 rounded-lg">
          <FilmIcon className="mx-auto w-24 h-24 text-gray-400" />
          <h2 className="mt-4 text-2xl font-semibold text-gray-300">Sua biblioteca está vazia</h2>
          <p className="mt-2 text-gray-400">Clique em "Adicionar Filme" para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map(movie => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onUpdateCoverRequest={onUpdateCoverRequest}
              onPlay={onPlay}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;

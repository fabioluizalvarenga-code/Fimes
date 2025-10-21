import React from 'react';
import type { Movie } from '../types';
import { PlayIcon, PhotoIcon } from './icons';

interface MovieCardProps {
  movie: Movie;
  onUpdateCoverRequest: (movieId: string) => void;
  onPlay: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onUpdateCoverRequest, onPlay }) => {
  return (
    <div className="group relative aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/30">
      {movie.coverUrl ? (
        <img src={movie.coverUrl} alt={movie.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-800 to-blue-800">
          <PhotoIcon className="w-12 h-12 text-gray-500" />
        </div>
      )}
      
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center p-3">
        {/* Title */}
        <div className="absolute top-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="font-bold text-lg leading-tight truncate">{movie.name}</h3>
        </div>
        
        {/* Play Button */}
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
          <button 
            onClick={() => onPlay(movie)}
            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black transition-all duration-300"
            aria-label={`Play ${movie.name}`}
          >
            <PlayIcon className="w-8 h-8" />
          </button>
        </div>
        
        {/* Update Cover Button */}
        <button
          onClick={() => onUpdateCoverRequest(movie.id)}
          className="absolute bottom-2 right-2 text-xs flex items-center gap-1 bg-black/50 px-2 py-1 rounded-md text-gray-300 hover:text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
        >
          <PhotoIcon className="w-4 h-4" /> Alterar Capa
        </button>
      </div>
    </div>
  );
};

export default MovieCard;

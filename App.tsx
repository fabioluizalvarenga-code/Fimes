
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Header from './components/Header';
import MovieList from './components/MovieList';
import Player from './components/Player';
import Pagination from './components/Pagination';
import { addMovie, getAllMovies, getMovieFile, updateMovieCover, type StoredMovie } from './lib/db';
import type { Movie } from './types';

const MOVIES_PER_PAGE = 30;

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<{ movie: Movie; fileUrl: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [movieToUpdateCoverId, setMovieToUpdateCoverId] = useState<string | null>(null);
  const coverUrlCache = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const storedMovies = await getAllMovies();
        const moviesWithUrls: Movie[] = storedMovies.map(sm => {
          let coverUrl: string | null = null;
          if (sm.coverFile) {
            coverUrl = URL.createObjectURL(sm.coverFile);
            coverUrlCache.current.set(sm.id, coverUrl);
          }
          return {
            id: sm.id,
            name: sm.name,
            coverUrl,
          };
        });
        setMovies(moviesWithUrls);
      } catch (error) {
        console.error("Failed to load movies from DB", error);
      }
    };
    loadMovies();
    
    return () => {
      coverUrlCache.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleAddMovie = useCallback(async (file: File) => {
    const newId = Date.now().toString();
    const movieName = file.name.replace(/\.[^/.]+$/, "");
    const newMovie: StoredMovie = {
      id: newId,
      name: movieName,
      movieFile: file,
      coverFile: null,
    };
    await addMovie(newMovie);
    
    const movieForState: Movie = { id: newId, name: movieName, coverUrl: null };
    setMovies(prev => [...prev, movieForState]);
    
    const fileUrl = URL.createObjectURL(file);
    setNowPlaying({ movie: movieForState, fileUrl });
  }, []);

  const handleUpdateCover = useCallback(async (movieId: string, coverFile: File) => {
    await updateMovieCover(movieId, coverFile);
    const coverUrl = URL.createObjectURL(coverFile);

    const oldUrl = coverUrlCache.current.get(movieId);
    if(oldUrl) URL.revokeObjectURL(oldUrl);
    coverUrlCache.current.set(movieId, coverUrl);

    setMovies(prev =>
      prev.map(movie =>
        movie.id === movieId ? { ...movie, coverUrl } : movie
      )
    );
  }, []);

  const handleCoverUpdateRequest = (movieId: string) => {
    setMovieToUpdateCoverId(movieId);
    coverInputRef.current?.click();
  };

  const handleCoverFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && movieToUpdateCoverId) {
      handleUpdateCover(movieToUpdateCoverId, event.target.files[0]);
    }
    event.target.value = '';
    setMovieToUpdateCoverId(null);
  };

  const handlePlayRequest = useCallback(async (movie: Movie) => {
    const movieFile = await getMovieFile(movie.id);
    if (movieFile) {
      const fileUrl = URL.createObjectURL(movieFile);
      setNowPlaying({ movie, fileUrl });
    } else {
      alert('Arquivo do filme não encontrado. Tente adicionar o filme novamente.');
    }
  }, []);
  
  const handleClosePlayer = useCallback(() => {
    if (nowPlaying?.fileUrl) {
        URL.revokeObjectURL(nowPlaying.fileUrl);
    }
    setNowPlaying(null);
  }, [nowPlaying]);

  const totalPages = Math.ceil(movies.length / MOVIES_PER_PAGE);
  const paginatedMovies = movies.slice(
    (currentPage - 1) * MOVIES_PER_PAGE,
    currentPage * MOVIES_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-yellow-600 text-white font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <MovieList 
          movies={paginatedMovies} 
          onAddMovie={handleAddMovie}
          onUpdateCoverRequest={handleCoverUpdateRequest}
          onPlay={handlePlayRequest}
          isLibraryEmpty={movies.length === 0}
        />
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <input
          type="file"
          ref={coverInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleCoverFileSelected}
        />
      </main>
      {nowPlaying && (
        <Player 
          videoUrl={nowPlaying.fileUrl}
          title={nowPlaying.movie.name}
          onClose={handleClosePlayer}
          onUpdateCoverRequest={() => handleCoverUpdateRequest(nowPlaying.movie.id)}
        />
      )}
    </div>
  );
};

export default App;

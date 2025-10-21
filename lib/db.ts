
export interface StoredMovie {
    id: string;
    name: string;
    coverFile: File | null;
    movieFile: File;
}

const DB_NAME = 'FilmesHDsDB';
const DB_VERSION = 1;
const MOVIE_STORE_NAME = 'movies';

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
    if (!dbPromise) {
        dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error('Database error:', request.error);
                reject('Error opening database');
            };

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(MOVIE_STORE_NAME)) {
                    db.createObjectStore(MOVIE_STORE_NAME, { keyPath: 'id' });
                }
            };
        });
    }
    return dbPromise;
}

export async function addMovie(movie: StoredMovie): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(MOVIE_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(MOVIE_STORE_NAME);
        const request = store.add(movie);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function getAllMovies(): Promise<StoredMovie[]> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(MOVIE_STORE_NAME, 'readonly');
        const store = transaction.objectStore(MOVIE_STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function getMovieFile(movieId: string): Promise<File | null> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(MOVIE_STORE_NAME, 'readonly');
        const store = transaction.objectStore(MOVIE_STORE_NAME);
        const request = store.get(movieId);
        request.onsuccess = () => {
            if (request.result) {
                resolve(request.result.movieFile);
            } else {
                resolve(null);
            }
        };
        request.onerror = () => reject(request.error);
    });
}

export async function updateMovieCover(movieId: string, coverFile: File): Promise<void> {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(MOVIE_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(MOVIE_STORE_NAME);
        const getRequest = store.get(movieId);
        getRequest.onsuccess = () => {
            const movie = getRequest.result;
            if (movie) {
                movie.coverFile = coverFile;
                const putRequest = store.put(movie);
                putRequest.onsuccess = () => resolve();
                putRequest.onerror = () => reject(putRequest.error);
            } else {
                reject('Movie not found');
            }
        };
        getRequest.onerror = () => reject(getRequest.error);
    });
}

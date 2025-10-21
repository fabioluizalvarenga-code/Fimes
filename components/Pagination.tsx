
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex justify-center items-center gap-4 mt-12">
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-white font-bold rounded-lg shadow-lg hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label="Página anterior"
            >
                <ChevronLeftIcon className="w-5 h-5" />
                Anterior
            </button>
            <span className="text-lg font-semibold text-gray-300 tabular-nums">
                Página {currentPage} de {totalPages}
            </span>
            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-white font-bold rounded-lg shadow-lg hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label="Próxima página"
            >
                Próxima
                <ChevronRightIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination;

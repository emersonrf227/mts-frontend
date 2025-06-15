import React from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
interface IPaginationProps {
  pagination: IPagination;
  onChange: (page: number) => void;
}

export interface IPagination {
  count: number;
  page: number;
  perPage: number;
}

const Pagination = ({ pagination, onChange }: IPaginationProps) => {
  const { count, page, perPage } = pagination;
  const totalPages = Math.ceil(count / perPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      onChange(newPage);
    }
  };

  // Lista de páginas a serem exibidas
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pages.push(i);
        }
      } else if (page >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = page - 2; i <= page + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  return (
    <div className='flex flex-col items-center justify-between gap-3'>
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          disabled={page === 1}
          onClick={() => handlePageChange(1)}
          className="w-8 h-8"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
          className="w-8 h-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {getPageNumbers().map((pageNumber) => (
          <Button
            key={pageNumber}
            variant={pageNumber === page ? 'default' : 'outline'}
            size="icon"
            onClick={() => handlePageChange(pageNumber)}
            className="w-8 h-8"
          >
            {pageNumber}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
          className="w-8 h-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          disabled={page === totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="w-8 h-8"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="ml-4 text-sm text-gray-500">
        Página {page} de {totalPages}
      </div>
    </div>
  );
};

export default Pagination;

'use client'

import React from 'react'
import { theme } from '@/lib/theme'

// Table 컴포넌트의 속성 타입 정의
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean
  hoverable?: boolean
  bordered?: boolean
  compact?: boolean
}

export const Table: React.FC<TableProps> = ({
  striped = false,
  hoverable = false,
  bordered = false,
  compact = false,
  className = '',
  children,
  ...props
}) => {
  const baseStyles = `
    w-full text-left text-sm
    ${bordered ? 'border border-neutral-border' : ''}
    ${className}
  `
  
  return (
    <div className="overflow-x-auto">
      <table 
        className={baseStyles}
        data-striped={striped}
        data-hoverable={hoverable}
        data-compact={compact}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

// TableHeader 컴포넌트
export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <thead 
      className={`bg-neutral-light border-b border-neutral-border ${className}`}
      {...props}
    >
      {children}
    </thead>
  )
}

// TableBody 컴포넌트
export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  )
}

// TableRow 컴포넌트
export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <tr 
      className={`
        border-b border-neutral-border
        [table[data-hoverable='true']_&]:hover:bg-neutral-light
        [table[data-striped='true']_tbody_&:nth-child(even)]:bg-neutral-light
        transition-colors
        ${className}
      `}
      {...props}
    >
      {children}
    </tr>
  )
}

// TableHead 컴포넌트 (th)
export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean
  sorted?: 'asc' | 'desc' | false
  onSort?: () => void
}

export const TableHead: React.FC<TableHeadProps> = ({
  sortable = false,
  sorted = false,
  onSort,
  className = '',
  children,
  ...props
}) => {
  const paddingClass = `[table[data-compact='true']_&]:px-4 [table[data-compact='true']_&]:py-2 px-6 py-3`
  
  return (
    <th 
      className={`
        ${paddingClass}
        font-medium text-neutral-dark
        ${sortable ? 'cursor-pointer select-none hover:bg-neutral-lighter' : ''}
        ${className}
      `}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && (
          <span className="text-neutral-gray">
            {sorted === 'asc' && '↑'}
            {sorted === 'desc' && '↓'}
            {!sorted && '↕'}
          </span>
        )}
      </div>
    </th>
  )
}

// TableCell 컴포넌트 (td)
export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className = '',
  children,
  ...props
}) => {
  const paddingClass = `[table[data-compact='true']_&]:px-4 [table[data-compact='true']_&]:py-2 px-6 py-4`
  
  return (
    <td 
      className={`
        ${paddingClass}
        text-neutral-dark
        ${className}
      `}
      {...props}
    >
      {children}
    </td>
  )
}

// TableFooter 컴포넌트
export const TableFooter: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <tfoot 
      className={`bg-neutral-light border-t border-neutral-border ${className}`}
      {...props}
    >
      {children}
    </tfoot>
  )
}

// Pagination 컴포넌트
export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  maxVisiblePages?: number
  className?: string
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 7,
  className = ''
}) => {
  const getPageNumbers = () => {
    const pages = []
    const halfVisible = Math.floor(maxVisiblePages / 2)
    
    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    return pages
  }
  
  const pageNumbers = getPageNumbers()
  
  const PageButton = ({ 
    page, 
    active = false, 
    disabled = false, 
    children 
  }: { 
    page?: number
    active?: boolean
    disabled?: boolean
    children: React.ReactNode 
  }) => (
    <button
      onClick={() => page && !disabled && !active && onPageChange(page)}
      disabled={disabled || active}
      className={`
        px-3 py-1 rounded-md text-sm font-medium
        transition-all duration-150
        ${active 
          ? 'bg-primary text-white cursor-default' 
          : disabled
          ? 'text-neutral-lighter cursor-not-allowed'
          : 'text-neutral-dark hover:bg-neutral-light cursor-pointer'
        }
      `}
    >
      {children}
    </button>
  )
  
  return (
    <nav className={`flex items-center gap-1 ${className}`}>
      {showFirstLast && currentPage > 1 && (
        <PageButton page={1} disabled={currentPage === 1}>
          ««
        </PageButton>
      )}
      
      <PageButton 
        page={currentPage - 1} 
        disabled={currentPage === 1}
      >
        ‹
      </PageButton>
      
      {pageNumbers[0] > 1 && (
        <span className="px-2 text-neutral-gray">...</span>
      )}
      
      {pageNumbers.map(page => (
        <PageButton 
          key={page} 
          page={page} 
          active={page === currentPage}
        >
          {page}
        </PageButton>
      ))}
      
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <span className="px-2 text-neutral-gray">...</span>
      )}
      
      <PageButton 
        page={currentPage + 1} 
        disabled={currentPage === totalPages}
      >
        ›
      </PageButton>
      
      {showFirstLast && currentPage < totalPages && (
        <PageButton page={totalPages} disabled={currentPage === totalPages}>
          »»
        </PageButton>
      )}
    </nav>
  )
}

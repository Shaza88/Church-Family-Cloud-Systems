export type SortDirection = 'asc' | 'desc' | '';

export interface SortOptions {
  active: string;
  direction: SortDirection;
}

export interface PageRequest {
  pageIndex: number;
  pageSize: number;
}

export interface QueryRequest extends PageRequest {
  sort?: SortOptions;
  search?: string;
  filters?: {
    status?: string | null;
    profession?: string | null;
    email?: string | null;
    phone?: string | null;
    city?: string | null;
    zip?: string | null;
  };
}

export interface PageResponse<T> {
  items: T[];
  total: number;
  pageIndex: number;
  pageSize: number;
}

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
}

export interface PageResponse<T> {
  items: T[];
  total: number;
  pageIndex: number;
  pageSize: number;
}

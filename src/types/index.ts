export type RecordType = 'book' | 'movie' | 'show';
export type RecordStatus = 'wish' | 'in_progress' | 'completed';

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface Record {
  id: string;
  title: string;
  type: RecordType;
  coverUrl?: string;
  year?: number;
  description?: string;
  status: RecordStatus;
  rating?: number;
  review?: string;
  tagIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RecordFormData {
  title: string;
  type: RecordType;
  coverUrl?: string;
  year?: number;
  description?: string;
  tagIds: string[];
}

export interface FilterOptions {
  type: RecordType | 'all';
  status: RecordStatus | 'all';
  searchKeyword: string;
  selectedTags: string[];
}

export interface FormErrors {
  title?: string;
  type?: string;
  coverUrl?: string;
  year?: string;
  description?: string;
  rating?: string;
  review?: string;
}

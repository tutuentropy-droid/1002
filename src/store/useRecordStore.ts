import { create } from 'zustand';
import type { Record, RecordFormData, RecordStatus, FilterOptions, Tag } from '../types';
import { generateId, STORAGE_KEY, TAG_STORAGE_KEY, TAG_COLORS } from '../utils/constants';
import { getFromStorage, setToStorage } from '../hooks/useLocalStorage';
import { initialMockData, initialMockTags } from '../mock/initialData';

interface RecordState {
  records: Record[];
  tags: Tag[];
  filters: FilterOptions;
  isLoaded: boolean;
  loadFromStorage: () => void;
  addRecord: (data: RecordFormData) => void;
  updateRecord: (id: string, data: Partial<Record>) => void;
  deleteRecord: (id: string) => void;
  updateStatus: (id: string, status: RecordStatus) => void;
  updateRating: (id: string, rating: number, review?: string) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  getFilteredRecords: () => Record[];
  saveToStorage: () => void;
  addTag: (name: string) => Tag;
  updateTag: (id: string, name: string) => void;
  deleteTag: (id: string) => void;
  getOrCreateTag: (name: string) => Tag;
  getTagRecordsCount: (tagId: string) => number;
}

export const useRecordStore = create<RecordState>((set, get) => ({
  records: [],
  tags: [],
  filters: {
    type: 'all',
    status: 'all',
    searchKeyword: '',
    selectedTags: [],
  },
  isLoaded: false,

  loadFromStorage: () => {
    if (get().isLoaded) return;
    
    const storedRecords = getFromStorage<Record[]>(STORAGE_KEY, []);
    const storedTags = getFromStorage<Tag[]>(TAG_STORAGE_KEY, []);
    
    if (storedRecords.length > 0) {
      const migratedRecords = storedRecords.map(record => ({
        ...record,
        tagIds: record.tagIds || [],
      }));
      set({ records: migratedRecords, tags: storedTags.length > 0 ? storedTags : initialMockTags, isLoaded: true });
    } else {
      set({ records: initialMockData, tags: storedTags.length > 0 ? storedTags : initialMockTags, isLoaded: true });
      setToStorage(STORAGE_KEY, initialMockData);
      if (storedTags.length === 0) {
        setToStorage(TAG_STORAGE_KEY, initialMockTags);
      }
    }
  },

  saveToStorage: () => {
    setToStorage(STORAGE_KEY, get().records);
    setToStorage(TAG_STORAGE_KEY, get().tags);
  },

  addRecord: (data: RecordFormData) => {
    const now = new Date().toISOString();
    const newRecord: Record = {
      id: generateId(),
      title: data.title.trim(),
      type: data.type,
      coverUrl: data.coverUrl?.trim() || undefined,
      year: data.year,
      description: data.description?.trim() || undefined,
      status: 'wish',
      tagIds: data.tagIds || [],
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ records: [newRecord, ...state.records] }));
    get().saveToStorage();
  },

  updateRecord: (id: string, data: Partial<Record>) => {
    const now = new Date().toISOString();
    set((state) => ({
      records: state.records.map((record) =>
        record.id === id
          ? { 
              ...record, 
              ...data, 
              title: data.title?.trim() ?? record.title,
              coverUrl: data.coverUrl?.trim() ?? record.coverUrl,
              description: data.description?.trim() ?? record.description,
              tagIds: data.tagIds ?? record.tagIds,
              updatedAt: now 
            }
          : record
      ),
    }));
    get().saveToStorage();
  },

  deleteRecord: (id: string) => {
    set((state) => ({
      records: state.records.filter((record) => record.id !== id),
    }));
    get().saveToStorage();
  },

  updateStatus: (id: string, status: RecordStatus) => {
    const now = new Date().toISOString();
    set((state) => ({
      records: state.records.map((record) =>
        record.id === id
          ? { 
              ...record, 
              status, 
              updatedAt: now,
              ...(status !== 'completed' ? { rating: undefined, review: undefined } : {}),
            }
          : record
      ),
    }));
    get().saveToStorage();
  },

  updateRating: (id: string, rating: number, review?: string) => {
    const now = new Date().toISOString();
    set((state) => ({
      records: state.records.map((record) =>
        record.id === id && record.status === 'completed'
          ? { 
              ...record, 
              rating, 
              review: review?.trim() ?? record.review,
              updatedAt: now 
            }
          : record
      ),
    }));
    get().saveToStorage();
  },

  setFilters: (filters: Partial<FilterOptions>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  getFilteredRecords: () => {
    const { records, filters } = get();
    let result = [...records];

    if (filters.type !== 'all') {
      result = result.filter((r) => r.type === filters.type);
    }

    if (filters.status !== 'all') {
      result = result.filter((r) => r.status === filters.status);
    }

    if (filters.searchKeyword.trim()) {
      const keyword = filters.searchKeyword.toLowerCase().trim();
      result = result.filter((r) =>
        r.title.toLowerCase().includes(keyword)
      );
    }

    if (filters.selectedTags.length > 0) {
      result = result.filter((r) =>
        filters.selectedTags.every((tagId) => r.tagIds.includes(tagId))
      );
    }

    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  addTag: (name: string) => {
    const now = new Date().toISOString();
    const existingTag = get().tags.find(t => t.name.toLowerCase() === name.toLowerCase().trim());
    if (existingTag) {
      return existingTag;
    }
    
    const newTag: Tag = {
      id: generateId(),
      name: name.trim(),
      color: TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)],
      createdAt: now,
    };
    set((state) => ({ tags: [...state.tags, newTag] }));
    get().saveToStorage();
    return newTag;
  },

  updateTag: (id: string, name: string) => {
    set((state) => ({
      tags: state.tags.map((tag) =>
        tag.id === id
          ? { ...tag, name: name.trim() }
          : tag
      ),
    }));
    get().saveToStorage();
  },

  deleteTag: (id: string) => {
    set((state) => ({
      tags: state.tags.filter((tag) => tag.id !== id),
      records: state.records.map((record) => ({
        ...record,
        tagIds: record.tagIds.filter((tagId) => tagId !== id),
      })),
      filters: {
        ...state.filters,
        selectedTags: state.filters.selectedTags.filter((tagId) => tagId !== id),
      },
    }));
    get().saveToStorage();
  },

  getOrCreateTag: (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error('标签名不能为空');
    }
    const existingTag = get().tags.find(t => t.name.toLowerCase() === trimmedName.toLowerCase());
    if (existingTag) {
      return existingTag;
    }
    return get().addTag(trimmedName);
  },

  getTagRecordsCount: (tagId: string) => {
    return get().records.filter((r) => r.tagIds.includes(tagId)).length;
  },
}));

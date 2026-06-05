import type { RecordType, RecordStatus } from '../types';

export const STORAGE_KEY = 'zhui-ju-zhui-shu-records';
export const TAG_STORAGE_KEY = 'zhui-ju-zhui-shu-tags';

export const TAG_COLORS = [
  'zhusha',
  'daiqing',
  'zhuqing',
  'yanzhi',
  'ziying',
  'qianfo',
  'qiuge',
  'fuchai',
];

export const RECORD_TYPES: { value: RecordType; label: string; color: string }[] = [
  { value: 'book', label: '书', color: 'zhusha' },
  { value: 'movie', label: '电影', color: 'daiqing' },
  { value: 'show', label: '剧', color: 'zhuqing' },
];

export const RECORD_STATUSES: { value: RecordStatus; label: string }[] = [
  { value: 'wish', label: '想看' },
  { value: 'in_progress', label: '在看' },
  { value: 'completed', label: '看完' },
];

export const TYPE_SEAL_CLASS: Record<RecordType, string> = {
  book: 'seal-book',
  movie: 'seal-movie',
  show: 'seal-show',
};

export const STATUS_LABEL: Record<RecordStatus, string> = {
  wish: '想看',
  in_progress: '在看',
  completed: '看完',
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

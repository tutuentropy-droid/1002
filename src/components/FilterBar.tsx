import { Search, X } from 'lucide-react';
import { useRecordStore } from '../store/useRecordStore';
import { RECORD_TYPES, RECORD_STATUSES } from '../utils/constants';
import type { RecordType, RecordStatus } from '../types';
import { Input } from './ui/Input';

export function FilterBar() {
  const { filters, setFilters, records, tags } = useRecordStore();

  const getTypeCount = (type: RecordType | 'all') => {
    if (type === 'all') return records.length;
    return records.filter((r) => r.type === type).length;
  };

  const getStatusCount = (status: RecordStatus | 'all') => {
    if (status === 'all') return records.length;
    return records.filter((r) => r.status === status).length;
  };

  const getTagCount = (tagId: string) => {
    return records.filter((r) => r.tagIds.includes(tagId)).length;
  };

  const handleTagToggle = (tagId: string) => {
    const isSelected = filters.selectedTags.includes(tagId);
    if (isSelected) {
      setFilters({
        selectedTags: filters.selectedTags.filter((id) => id !== tagId),
      });
    } else {
      setFilters({
        selectedTags: [...filters.selectedTags, tagId],
      });
    }
  };

  const clearAllTags = () => {
    setFilters({ selectedTags: [] });
  };

  return (
    <div className="bg-yuebai-50/80 backdrop-blur-sm rounded-xl border border-zhuqing-200/50 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-danmo-400" />
            <Input
              type="text"
              placeholder="搜索标题..."
              value={filters.searchKeyword}
              onChange={(e) => setFilters({ searchKeyword: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium text-songyan-600 mb-1.5 block">类型</label>
            <div className="flex flex-wrap gap-2">
              <button
                className={cn(
                  'filter-tag',
                  filters.type === 'all' ? 'filter-tag-active' : 'filter-tag-inactive'
                )}
                onClick={() => setFilters({ type: 'all' })}
              >
                全部 ({getTypeCount('all')})
              </button>
              {RECORD_TYPES.map((type) => (
                <button
                  key={type.value}
                  className={cn(
                    'filter-tag',
                    filters.type === type.value ? 'filter-tag-active' : 'filter-tag-inactive'
                  )}
                  onClick={() => setFilters({ type: type.value })}
                >
                  {type.label} ({getTypeCount(type.value)})
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-songyan-600 mb-1.5 block">状态</label>
            <div className="flex flex-wrap gap-2">
              <button
                className={cn(
                  'filter-tag',
                  filters.status === 'all' ? 'filter-tag-active' : 'filter-tag-inactive'
                )}
                onClick={() => setFilters({ status: 'all' })}
              >
                全部 ({getStatusCount('all')})
              </button>
              {RECORD_STATUSES.map((status) => (
                <button
                  key={status.value}
                  className={cn(
                    'filter-tag',
                    filters.status === status.value ? 'filter-tag-active' : 'filter-tag-inactive'
                  )}
                  onClick={() => setFilters({ status: status.value })}
                >
                  {status.label} ({getStatusCount(status.value)})
                </button>
              ))}
            </div>
          </div>

          {tags.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-songyan-600">标签筛选</label>
                {filters.selectedTags.length > 0 && (
                  <button
                    onClick={clearAllTags}
                    className="text-xs text-danmo-500 hover:text-zhusha-600 flex items-center gap-1"
                  >
                    <X size={12} />
                    清除筛选
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    className={cn(
                      'tag cursor-pointer transition-all duration-200',
                      filters.selectedTags.includes(tag.id)
                        ? `tag-${tag.color} ring-2 ring-offset-1 ring-${tag.color}-400`
                        : 'bg-yuebai-100 text-songyan-600 hover:bg-yuebai-200 border border-zhuqing-200'
                    )}
                  >
                    {tag.name} ({getTagCount(tag.id)})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

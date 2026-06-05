import { useState, useEffect, useRef } from 'react';
import type { Record as RecordModel, RecordFormData, Tag } from '../types';
import { RECORD_TYPES } from '../utils/constants';
import { validateRecordForm, hasErrors } from '../utils/validation';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Textarea } from './ui/Textarea';
import { useRecordStore } from '../store/useRecordStore';
import { X, Plus } from 'lucide-react';
import type { FormErrors } from '../types';

interface RecordFormProps {
  record?: RecordModel | null;
  onSubmit: (data: RecordFormData) => void;
  onCancel: () => void;
}

export function RecordForm({ record, onSubmit, onCancel }: RecordFormProps) {
  const isEditing = !!record;
  const { tags, getOrCreateTag } = useRecordStore();

  const [formData, setFormData] = useState<RecordFormData>({
    title: '',
    type: 'book',
    coverUrl: '',
    year: undefined,
    description: '',
    tagIds: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [tagInput, setTagInput] = useState('');
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (record) {
      setFormData({
        title: record.title,
        type: record.type,
        coverUrl: record.coverUrl || '',
        year: record.year,
        description: record.description || '',
        tagIds: record.tagIds || [],
      });
    }
  }, [record]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !tagInputRef.current?.contains(event.target as Node)
      ) {
        setShowTagDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedTags = tags.filter((t) => formData.tagIds.includes(t.id));
  const availableTags = tags.filter(
    (t) => !formData.tagIds.includes(t.id) && t.name.toLowerCase().includes(tagInput.toLowerCase())
  );

  const handleTagSelect = (tag: Tag) => {
    if (!formData.tagIds.includes(tag.id)) {
      setFormData((prev) => ({ ...prev, tagIds: [...prev.tagIds, tag.id] }));
    }
    setTagInput('');
    setShowTagDropdown(false);
  };

  const handleTagRemove = (tagId: string) => {
    setFormData((prev) => ({ ...prev, tagIds: prev.tagIds.filter((id) => id !== tagId) }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      try {
        const newTag = getOrCreateTag(tagInput.trim());
        if (!formData.tagIds.includes(newTag.id)) {
          setFormData((prev) => ({ ...prev, tagIds: [...prev.tagIds, newTag.id] }));
        }
        setTagInput('');
        setShowTagDropdown(false);
      } catch {
        // 标签为空，忽略
      }
    }
  };

  const handleChange = (field: keyof RecordFormData, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newErrors = validateRecordForm({ ...formData, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleBlur = (field: keyof RecordFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateRecordForm(formData);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    const validationErrors = validateRecordForm(formData);
    setErrors(validationErrors);

    if (!hasErrors(validationErrors)) {
      const submitData: RecordFormData = {
        ...formData,
        coverUrl: formData.coverUrl || undefined,
        year: formData.year ? Number(formData.year) : undefined,
        description: formData.description || undefined,
      };
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-songyan-700 mb-1.5">
          标题 <span className="text-zhusha-600">*</span>
        </label>
        <Input
          type="text"
          placeholder="请输入标题"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          onBlur={() => handleBlur('title')}
          error={touched.title ? errors.title : undefined}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-songyan-700 mb-1.5">
          类型 <span className="text-zhusha-600">*</span>
        </label>
        <Select
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value as RecordFormData['type'])}
          onBlur={() => handleBlur('type')}
          error={touched.type ? errors.type : undefined}
        >
          {RECORD_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-songyan-700 mb-1.5">
            年份
          </label>
          <Input
            type="number"
            placeholder="如：2024"
            value={formData.year || ''}
            onChange={(e) => handleChange('year', e.target.value ? Number(e.target.value) : undefined)}
            onBlur={() => handleBlur('year')}
            error={touched.year ? errors.year : undefined}
            min={1900}
            max={2100}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-songyan-700 mb-1.5">
            封面图片URL
          </label>
          <Input
            type="url"
            placeholder="https://..."
            value={formData.coverUrl}
            onChange={(e) => handleChange('coverUrl', e.target.value)}
            onBlur={() => handleBlur('coverUrl')}
            error={touched.coverUrl ? errors.coverUrl : undefined}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-songyan-700 mb-1.5">
          简介
        </label>
        <Textarea
          placeholder="请输入简介（选填，最多500字）"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          error={touched.description ? errors.description : undefined}
          rows={3}
        />
        <p className="mt-1 text-xs text-danmo-400 text-right">
          {formData.description?.length || 0}/500
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-songyan-700 mb-1.5">
          标签
        </label>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag.id}
                className={`tag tag-${tag.color}`}
              >
                {tag.name}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag.id)}
                  className="ml-1 hover:text-zhusha-600 transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="relative">
            <Input
              ref={tagInputRef}
              type="text"
              placeholder="输入标签名称，按回车创建或选择"
              value={tagInput}
              onChange={(e) => {
                setTagInput(e.target.value);
                setShowTagDropdown(true);
              }}
              onFocus={() => setShowTagDropdown(true)}
              onKeyDown={handleTagKeyDown}
            />
            {showTagDropdown && (availableTags.length > 0 || tagInput.trim()) && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-1 bg-yuebai-50 border border-zhuqing-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10"
              >
                {availableTags.length > 0 && (
                  <div className="p-2">
                    <p className="text-xs text-danmo-500 px-2 mb-1">选择已有标签</p>
                    {availableTags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTagSelect(tag)}
                        className={`w-full text-left px-2 py-1.5 rounded hover:bg-yuebai-100 flex items-center gap-2`}
                      >
                        <span className={`tag tag-${tag.color}`}>{tag.name}</span>
                      </button>
                    ))}
                  </div>
                )}
                {tagInput.trim() && !tags.some((t) => t.name.toLowerCase() === tagInput.toLowerCase().trim()) && (
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        const newTag = getOrCreateTag(tagInput.trim());
                        handleTagSelect(newTag);
                      } catch {
                        // 忽略
                      }
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-yuebai-100 flex items-center gap-2 text-daiqing-600 border-t border-zhuqing-200/50"
                  >
                    <Plus size={14} />
                    <span>创建新标签「{tagInput.trim()}」</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {formData.coverUrl && !errors.coverUrl && (
        <div>
          <label className="block text-sm font-medium text-songyan-700 mb-1.5">
            封面预览
          </label>
          <div className="w-full h-40 rounded-lg overflow-hidden border border-zhuqing-200/50 bg-yuebai-100">
            <img
              src={formData.coverUrl}
              alt="封面预览"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-zhuqing-200/50">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">
          {isEditing ? '保存修改' : '添加记录'}
        </Button>
      </div>
    </form>
  );
}

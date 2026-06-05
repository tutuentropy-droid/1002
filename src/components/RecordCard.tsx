import { useState } from 'react';
import { memo } from 'react';
import { Edit2, Trash2, Eye, PenTool, Check, Film, BookOpen, Monitor, MessageSquare } from 'lucide-react';
import type { Record, RecordStatus } from '../types';
import { TYPE_SEAL_CLASS, RECORD_STATUSES } from '../utils/constants';
import { useRecordStore } from '../store/useRecordStore';
import { StarRating } from './ui/StarRating';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { Modal } from './ui/Modal';
import { validateReview } from '../utils/validation';
import { cn } from '@/lib/utils';

interface RecordCardProps {
  record: Record;
  index: number;
  onEdit: (record: Record) => void;
}

const TypeIcon = ({ type }: { type: Record['type'] }) => {
  switch (type) {
    case 'book':
      return <BookOpen size={14} />;
    case 'movie':
      return <Film size={14} />;
    case 'show':
      return <Monitor size={14} />;
  }
};

const StatusIcon = ({ status }: { status: RecordStatus }) => {
  switch (status) {
    case 'wish':
      return <Eye size={14} />;
    case 'in_progress':
      return <PenTool size={14} />;
    case 'completed':
      return <Check size={14} />;
  }
};

export const RecordCard = memo(function RecordCard({ record, index, onEdit }: RecordCardProps) {
  const { updateStatus, updateRating, deleteRecord, tags } = useRecordStore();
  const recordTags = tags.filter((t) => record.tagIds.includes(t.id));
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reviewText, setReviewText] = useState(record.review || '');
  const [reviewError, setReviewError] = useState<string | undefined>();
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [imageError, setImageError] = useState(false);

  const staggerClass = `stagger-${(index % 6) + 1}`;

  const handleStatusChange = (status: RecordStatus) => {
    updateStatus(record.id, status);
  };

  const handleRatingChange = (rating: number) => {
    updateRating(record.id, rating, record.review);
  };

  const handleReviewSave = () => {
    const error = validateReview(reviewText);
    if (error) {
      setReviewError(error);
      return;
    }
    updateRating(record.id, record.rating || 5, reviewText);
    setIsEditingReview(false);
    setReviewError(undefined);
  };

  const handleDelete = () => {
    deleteRecord(record.id);
    setShowDeleteConfirm(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <div
        className={cn(
          'card animate-fade-in opacity-0',
          staggerClass
        )}
      >
        <div className="relative h-40 bg-gradient-to-br from-daiqing-100 to-zhuqing-100 overflow-hidden">
          {!imageError && record.coverUrl ? (
            <img
              src={record.coverUrl}
              alt={record.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <TypeIcon type={record.type} />
                <p className="text-sm text-danmo-500 mt-1">暂无封面</p>
              </div>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className={TYPE_SEAL_CLASS[record.type]}>
              <TypeIcon type={record.type} />
              <span className="ml-1 text-xs">
                {record.type === 'book' ? '书' : record.type === 'movie' ? '电影' : '剧'}
              </span>
            </span>
          </div>
          <div className="absolute top-3 right-3 flex gap-1">
            <Button
              variant="icon"
              className="bg-yuebai-50/90 backdrop-blur-sm hover:bg-yuebai-50"
              onClick={() => onEdit(record)}
              aria-label="编辑"
            >
              <Edit2 size={16} className="text-songyan-600" />
            </Button>
            <Button
              variant="icon"
              className="bg-yuebai-50/90 backdrop-blur-sm hover:bg-zhusha-50"
              onClick={() => setShowDeleteConfirm(true)}
              aria-label="删除"
            >
              <Trash2 size={16} className="text-zhusha-600" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-kai text-songyan-800 line-clamp-1">
              {record.title}
            </h3>
            {record.year && (
              <span className="text-sm text-danmo-500 whitespace-nowrap">
                {record.year}
              </span>
            )}
          </div>

          {record.description && (
            <p className="text-sm text-songyan-600 line-clamp-2 mb-3">
              {record.description}
            </p>
          )}

          {recordTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {recordTags.map((tag) => (
                <span
                  key={tag.id}
                  className={`tag tag-${tag.color}`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="mb-3">
            <div className="flex flex-wrap gap-1.5">
              {RECORD_STATUSES.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  className={cn(
                    'status-btn flex items-center gap-1',
                    record.status === status.value
                      ? 'status-btn-active animate-stamp'
                      : 'status-btn-inactive'
                  )}
                >
                  <StatusIcon status={status.value} />
                  <span className="text-xs">{status.label}</span>
                </button>
              ))}
            </div>
          </div>

          {record.status === 'completed' && (
            <div className="pt-3 border-t border-zhuqing-200/50 space-y-3">
              <div className="flex items-center justify-between">
                <StarRating
                  value={record.rating}
                  onChange={handleRatingChange}
                  size={18}
                />
                <span className="text-xs text-danmo-400">
                  {record.rating ? `${record.rating}星` : '点击评分'}
                </span>
              </div>

              {record.review && !isEditingReview ? (
                <div
                  className="p-3 bg-yuebai-100/50 rounded-lg cursor-pointer hover:bg-yuebai-100 transition-colors"
                  onClick={() => setIsEditingReview(true)}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare size={14} className="text-zhuqing-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-songyan-700 flex-1">{record.review}</p>
                  </div>
                </div>
              ) : isEditingReview ? (
                <div className="space-y-2">
                  <Textarea
                    placeholder="写下你的短评...（最多200字）"
                    value={reviewText}
                    onChange={(e) => {
                      setReviewText(e.target.value);
                      if (reviewError) setReviewError(undefined);
                    }}
                    error={reviewError}
                    rows={2}
                    autoFocus
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-danmo-400">
                      {reviewText.length}/200
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsEditingReview(false);
                          setReviewText(record.review || '');
                          setReviewError(undefined);
                        }}
                      >
                        取消
                      </Button>
                      <Button size="sm" onClick={handleReviewSave}>
                        保存
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingReview(true)}
                  className="w-full p-3 border-2 border-dashed border-zhuqing-200 rounded-lg text-sm text-danmo-500 hover:border-zhuqing-400 hover:text-songyan-600 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare size={14} />
                  添加短评
                </button>
              )}
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-zhuqing-200/30">
            <p className="text-xs text-danmo-400">
              更新于 {new Date(record.updatedAt).toLocaleDateString('zh-CN')}
            </p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="确认删除"
        maxWidth="max-w-sm"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zhusha-50 flex items-center justify-center">
            <Trash2 size={28} className="text-zhusha-600" />
          </div>
          <p className="text-songyan-700 mb-2">确定要删除「{record.title}」吗？</p>
          <p className="text-sm text-danmo-500 mb-6">此操作无法撤销，删除后数据将永久丢失。</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              取消
            </Button>
            <Button variant="secondary" onClick={handleDelete}>
              确认删除
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
});

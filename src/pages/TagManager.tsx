import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecordStore } from '../store/useRecordStore';
import { ArrowLeft, Edit2, Trash2, Check, X, Tag, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import type { Tag as TagType } from '../types';

export function TagManager() {
  const navigate = useNavigate();
  const { tags, loadFromStorage, updateTag, deleteTag, addTag, getTagRecordsCount } = useRecordStore();
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagError, setNewTagError] = useState<string | undefined>();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const handleEditStart = (tag: TagType) => {
    setEditingTag(tag.id);
    setEditName(tag.name);
  };

  const handleEditSave = (tagId: string) => {
    if (editName.trim()) {
      const exists = tags.find(
        (t) => t.id !== tagId && t.name.toLowerCase() === editName.trim().toLowerCase()
      );
      if (exists) {
        return;
      }
      updateTag(tagId, editName.trim());
    }
    setEditingTag(null);
  };

  const handleEditCancel = () => {
    setEditingTag(null);
    setEditName('');
  };

  const handleDelete = (tagId: string) => {
    deleteTag(tagId);
    setShowDeleteConfirm(null);
  };

  const handleAddTag = () => {
    const trimmedName = newTagName.trim();
    if (!trimmedName) {
      setNewTagError('标签名不能为空');
      return;
    }
    const exists = tags.find((t) => t.name.toLowerCase() === trimmedName.toLowerCase());
    if (exists) {
      setNewTagError('该标签已存在');
      return;
    }
    addTag(trimmedName);
    setNewTagName('');
    setNewTagError(undefined);
    setShowAddModal(false);
  };

  const sortedTags = [...tags].sort((a, b) =>
    getTagRecordsCount(b.id) - getTagRecordsCount(a.id)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-yuebai-100/90 backdrop-blur-md border-b border-zhuqing-200/30">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg hover:bg-yuebai-200 transition-colors"
              >
                <ArrowLeft size={20} className="text-songyan-600" />
              </button>
              <div>
                <h1 className="text-xl font-kai text-songyan-800">标签管理</h1>
                <p className="text-xs text-danmo-500 -mt-0.5">共 {tags.length} 个标签</p>
              </div>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="gap-2">
              <Plus size={18} />
              <span>新建标签</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        {tags.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yuebai-100 flex items-center justify-center">
              <Tag size={36} className="text-danmo-400" />
            </div>
            <h3 className="text-xl font-kai text-songyan-700 mb-2">暂无标签</h3>
            <p className="text-danmo-500 mb-6">添加记录时可以创建自定义标签</p>
            <Button onClick={() => setShowAddModal(true)} className="gap-2">
              <Plus size={18} />
              <span>创建第一个标签</span>
            </Button>
          </div>
        ) : (
          <div className="card">
            <div className="divide-y divide-zhuqing-200/50">
              {sortedTags.map((tag) => (
                <div
                  key={tag.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-yuebai-100/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {editingTag === tag.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditSave(tag.id);
                            if (e.key === 'Escape') handleEditCancel();
                          }}
                          className="max-w-xs"
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSave(tag.id)}
                          className="p-2"
                        >
                          <Check size={18} className="text-daiqing-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleEditCancel}
                          className="p-2"
                        >
                          <X size={18} className="text-danmo-500" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className={`tag tag-${tag.color}`}>
                          {tag.name}
                        </span>
                        <span className="text-sm text-danmo-500">
                          {getTagRecordsCount(tag.id)} 条记录
                        </span>
                      </>
                    )}
                  </div>
                  {editingTag !== tag.id && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditStart(tag)}
                        className="p-2"
                        aria-label="编辑标签"
                      >
                        <Edit2 size={16} className="text-songyan-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(tag.id)}
                        className="p-2 hover:bg-zhusha-50"
                        aria-label="删除标签"
                      >
                        <Trash2 size={16} className="text-zhusha-500" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewTagName('');
          setNewTagError(undefined);
        }}
        title="新建标签"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-songyan-700 mb-1.5">
              标签名称
            </label>
            <Input
              value={newTagName}
              onChange={(e) => {
                setNewTagName(e.target.value);
                if (newTagError) setNewTagError(undefined);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTag();
              }}
              placeholder="请输入标签名称"
              error={newTagError}
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-zhuqing-200/50">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                setNewTagName('');
                setNewTagError(undefined);
              }}
            >
              取消
            </Button>
            <Button onClick={handleAddTag}>创建</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="确认删除标签"
        maxWidth="max-w-sm"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zhusha-50 flex items-center justify-center">
            <Trash2 size={28} className="text-zhusha-600" />
          </div>
          <p className="text-songyan-700 mb-2">
            确定要删除「{tags.find((t) => t.id === showDeleteConfirm)?.name}」吗？
          </p>
          <p className="text-sm text-danmo-500 mb-6">
            删除后，所有关联该标签的记录将自动解除关联，此操作无法撤销。
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>
              取消
            </Button>
            <Button
              variant="secondary"
              onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
            >
              确认删除
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

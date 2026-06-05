import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { FilterBar } from '../components/FilterBar';
import { RecordCard } from '../components/RecordCard';
import { RecordForm } from '../components/RecordForm';
import { Modal } from '../components/ui/Modal';
import { useRecordStore } from '../store/useRecordStore';
import type { Record, RecordFormData } from '../types';
import { BookOpen, Film, Monitor, Sparkles } from 'lucide-react';

export function Home() {
  const { records, loadFromStorage, getFilteredRecords, addRecord, updateRecord } = useRecordStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const filteredRecords = getFilteredRecords();

  const handleAddSubmit = (data: RecordFormData) => {
    addRecord(data);
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (data: RecordFormData) => {
    if (editingRecord) {
      updateRecord(editingRecord.id, data);
      setEditingRecord(null);
    }
  };

  const handleEdit = (record: Record) => {
    setEditingRecord(record);
  };

  const stats = {
    total: records.length,
    books: records.filter((r) => r.type === 'book').length,
    movies: records.filter((r) => r.type === 'movie').length,
    shows: records.filter((r) => r.type === 'show').length,
    completed: records.filter((r) => r.status === 'completed').length,
    inProgress: records.filter((r) => r.status === 'in_progress').length,
    wish: records.filter((r) => r.status === 'wish').length,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onAddClick={() => setIsAddModalOpen(true)} />

      <main className="flex-1 container py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-daiqing-100 flex items-center justify-center">
              <Sparkles size={20} className="text-daiqing-600" />
            </div>
            <div>
              <p className="text-2xl font-kai text-songyan-800">{stats.total}</p>
              <p className="text-xs text-danmo-500">总记录</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zhusha-100 flex items-center justify-center">
              <BookOpen size={20} className="text-zhusha-600" />
            </div>
            <div>
              <p className="text-2xl font-kai text-songyan-800">{stats.books}</p>
              <p className="text-xs text-danmo-500">书籍</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-daiqing-100 flex items-center justify-center">
              <Film size={20} className="text-daiqing-600" />
            </div>
            <div>
              <p className="text-2xl font-kai text-songyan-800">{stats.movies}</p>
              <p className="text-xs text-danmo-500">电影</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zhuqing-100 flex items-center justify-center">
              <Monitor size={20} className="text-zhuqing-600" />
            </div>
            <div>
              <p className="text-2xl font-kai text-songyan-800">{stats.shows}</p>
              <p className="text-xs text-danmo-500">剧集</p>
            </div>
          </div>
        </div>

        <FilterBar />

        {filteredRecords.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRecords.map((record, index) => (
              <RecordCard
                key={record.id}
                record={record}
                index={index}
                onEdit={handleEdit}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yuebai-100 flex items-center justify-center">
              <BookOpen size={36} className="text-danmo-400" />
            </div>
            <h3 className="text-xl font-kai text-songyan-700 mb-2">暂无记录</h3>
            <p className="text-danmo-500 mb-6">
              {records.length === 0
                ? '开始添加你的第一条记录吧'
                : '没有符合筛选条件的记录'}
            </p>
            {records.length === 0 && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary"
              >
                添加第一条记录
              </button>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-zhuqing-200/30 py-4">
        <div className="container text-center">
          <p className="text-sm text-danmo-500">
            追剧追书 · 雅韵 · 记录你的精神足迹
          </p>
        </div>
      </footer>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="添加新记录"
      >
        <RecordForm
          onSubmit={handleAddSubmit}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        title="编辑记录"
      >
        <RecordForm
          record={editingRecord}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditingRecord(null)}
        />
      </Modal>
    </div>
  );
}

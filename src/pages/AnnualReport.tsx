import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecordStore } from '../store/useRecordStore';
import { BookOpen, Film, Monitor, TrendingUp, Star, Trophy, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Record, RecordType } from '../types';
import { TYPE_SEAL_CLASS } from '../utils/constants';

function getYearRecords(records: Record[], year: number): Record[] {
  return records.filter((record) => {
    const createdYear = new Date(record.createdAt).getFullYear();
    return createdYear === year;
  });
}

function getAvailableYears(records: Record[]): number[] {
  const years = new Set<number>();
  records.forEach((record) => {
    const createdYear = new Date(record.createdAt).getFullYear();
    years.add(createdYear);
  });
  const currentYear = new Date().getFullYear();
  years.add(currentYear);
  return Array.from(years).sort((a, b) => b - a);
}

function getTypeIcon(type: RecordType) {
  switch (type) {
    case 'book':
      return <BookOpen size={14} />;
    case 'movie':
      return <Film size={14} />;
    case 'show':
      return <Monitor size={14} />;
  }
}

function getTypeLabel(type: RecordType) {
  switch (type) {
    case 'book':
      return '书';
    case 'movie':
      return '电影';
    case 'show':
      return '剧';
  }
}

export function AnnualReport() {
  const navigate = useNavigate();
  const { records, loadFromStorage } = useRecordStore();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const availableYears = useMemo(() => getAvailableYears(records), [records]);

  const stats = useMemo(() => {
    const yearRecords = getYearRecords(records, selectedYear);

    const typeStats = {
      book: yearRecords.filter((r) => r.type === 'book').length,
      movie: yearRecords.filter((r) => r.type === 'movie').length,
      show: yearRecords.filter((r) => r.type === 'show').length,
    };

    const totalNew = yearRecords.length;
    const totalCompleted = yearRecords.filter((r) => r.status === 'completed').length;
    const completionRate = totalNew > 0 ? ((totalCompleted / totalNew) * 100).toFixed(1) : '0';

    const getAverageRating = (type: RecordType) => {
      const completed = yearRecords.filter(
        (r) => r.type === type && r.status === 'completed' && r.rating
      );
      if (completed.length === 0) return '-';
      const total = completed.reduce((sum, r) => sum + (r.rating || 0), 0);
      return (total / completed.length).toFixed(1);
    };

    const avgRatings = {
      book: getAverageRating('book'),
      movie: getAverageRating('movie'),
      show: getAverageRating('show'),
    };

    const completedByRating = yearRecords
      .filter((r) => r.status === 'completed' && r.rating)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return {
      typeStats,
      totalNew,
      totalCompleted,
      completionRate,
      avgRatings,
      completedByRating,
    };
  }, [records, selectedYear]);

  const handlePrevYear = () => {
    const currentIndex = availableYears.indexOf(selectedYear);
    if (currentIndex < availableYears.length - 1) {
      setSelectedYear(availableYears[currentIndex + 1]);
    }
  };

  const handleNextYear = () => {
    const currentIndex = availableYears.indexOf(selectedYear);
    if (currentIndex > 0) {
      setSelectedYear(availableYears[currentIndex - 1]);
    }
  };

  const isFirstYear = availableYears.indexOf(selectedYear) === availableYears.length - 1;
  const isLastYear = availableYears.indexOf(selectedYear) === 0;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-yuebai-100/90 backdrop-blur-md border-b border-zhuqing-200/30">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="w-10 h-10 rounded-lg bg-yuebai-200 flex items-center justify-center hover:bg-yuebai-300 transition-colors"
              >
                <ArrowLeft size={20} className="text-songyan-700" />
              </button>
              <div>
                <h1 className="text-2xl font-kai text-songyan-800 tracking-wider">
                  年度报告
                </h1>
                <p className="text-xs text-danmo-500 -mt-1">· {selectedYear} ·</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="card p-6 mb-6 text-center bg-gradient-to-br from-zhusha-50 to-daiqing-50">
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={handlePrevYear}
              disabled={isFirstYear}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isFirstYear
                  ? 'bg-danmo-200 text-danmo-400 cursor-not-allowed'
                  : 'bg-yuebai-200 hover:bg-yuebai-300 text-songyan-700'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="w-16 h-16 rounded-full bg-zhusha-600 flex items-center justify-center shadow-seal">
              <Trophy size={28} className="text-yuebai-50" />
            </div>
            <button
              onClick={handleNextYear}
              disabled={isLastYear}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isLastYear
                  ? 'bg-danmo-200 text-danmo-400 cursor-not-allowed'
                  : 'bg-yuebai-200 hover:bg-yuebai-300 text-songyan-700'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <h2 className="text-3xl font-kai text-songyan-800 mb-2">
            {selectedYear} 年度精神足迹
          </h2>
          <p className="text-danmo-500">记录你的阅读与观影时光</p>
          {availableYears.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-xs text-danmo-400">选择年份：</span>
              <div className="flex gap-1">
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedYear === year
                        ? 'bg-zhusha-600 text-yuebai-50'
                        : 'bg-yuebai-200 text-songyan-600 hover:bg-yuebai-300'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-daiqing-100 flex items-center justify-center">
                <TrendingUp size={20} className="text-daiqing-600" />
              </div>
              <h3 className="font-kai text-lg text-songyan-800">新增记录</h3>
            </div>
            <p className="text-4xl font-kai text-songyan-800 mb-4">{stats.totalNew}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-danmo-600">
                  <BookOpen size={16} className="text-zhusha-600" />
                  书籍
                </span>
                <span className="font-medium text-songyan-700">{stats.typeStats.book}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-danmo-600">
                  <Film size={16} className="text-daiqing-600" />
                  电影
                </span>
                <span className="font-medium text-songyan-700">{stats.typeStats.movie}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-danmo-600">
                  <Monitor size={16} className="text-zhuqing-600" />
                  剧集
                </span>
                <span className="font-medium text-songyan-700">{stats.typeStats.show}</span>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-zhusha-100 flex items-center justify-center">
                <Star size={20} className="text-zhusha-600" />
              </div>
              <h3 className="font-kai text-lg text-songyan-800">完成比例</h3>
            </div>
            <div className="relative w-28 h-28 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${Number(stats.completionRate) * 3.01} 301`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-kai text-songyan-800">{stats.completionRate}%</span>
                <span className="text-xs text-danmo-500">看完</span>
              </div>
            </div>
            <p className="text-center text-sm text-danmo-600">
              已完成 <span className="font-medium text-songyan-700">{stats.totalCompleted}</span> 项 / 新增{' '}
              <span className="font-medium text-songyan-700">{stats.totalNew}</span> 项
            </p>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-zhuqing-100 flex items-center justify-center">
                <Star size={20} className="text-zhuqing-600" />
              </div>
              <h3 className="font-kai text-lg text-songyan-800">平均评分</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-danmo-600">
                  <BookOpen size={16} className="text-zhusha-600" />
                  书籍
                </span>
                <span className="font-kai text-xl text-songyan-800">
                  {stats.avgRatings.book}
                  <span className="text-sm text-danmo-500 ml-1">星</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-danmo-600">
                  <Film size={16} className="text-daiqing-600" />
                  电影
                </span>
                <span className="font-kai text-xl text-songyan-800">
                  {stats.avgRatings.movie}
                  <span className="text-sm text-danmo-500 ml-1">星</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-danmo-600">
                  <Monitor size={16} className="text-zhuqing-600" />
                  剧集
                </span>
                <span className="font-kai text-xl text-songyan-800">
                  {stats.avgRatings.show}
                  <span className="text-sm text-danmo-500 ml-1">星</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-zhusha-100 flex items-center justify-center">
              <Trophy size={20} className="text-zhusha-600" />
            </div>
            <h3 className="font-kai text-xl text-songyan-800">评分排行榜</h3>
            <span className="text-sm text-danmo-500">{selectedYear}年看完的内容</span>
          </div>

          {stats.completedByRating.length > 0 ? (
            <div className="space-y-3">
              {stats.completedByRating.map((record, index) => (
                <div
                  key={record.id}
                  className="flex items-center gap-4 p-4 bg-yuebai-100/50 rounded-lg hover:bg-yuebai-100 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-kai text-sm ${
                      index === 0
                        ? 'bg-zhusha-500 text-yuebai-50'
                        : index === 1
                        ? 'bg-daiqing-500 text-yuebai-50'
                        : index === 2
                        ? 'bg-zhuqing-500 text-yuebai-50'
                        : 'bg-danmo-200 text-danmo-600'
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-daiqing-100 to-zhuqing-100 overflow-hidden flex-shrink-0">
                    {record.coverUrl ? (
                      <img
                        src={record.coverUrl}
                        alt={record.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {getTypeIcon(record.type)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={TYPE_SEAL_CLASS[record.type]}>
                        {getTypeIcon(record.type)}
                        <span className="ml-1 text-xs">{getTypeLabel(record.type)}</span>
                      </span>
                      <h4 className="font-kai text-songyan-800 truncate">{record.title}</h4>
                    </div>
                    {record.review && (
                      <p className="text-sm text-danmo-500 line-clamp-1">{record.review}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < (record.rating || 0) ? 'text-zhusha-500 fill-zhusha-500' : 'text-danmo-300'}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yuebai-100 flex items-center justify-center">
                <Trophy size={36} className="text-danmo-400" />
              </div>
              <h4 className="text-lg font-kai text-songyan-700 mb-2">暂无评分记录</h4>
              <p className="text-danmo-500">看完内容后添加评分，这里会展示你的榜单</p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-zhuqing-200/30 py-4">
        <div className="container text-center">
          <p className="text-sm text-danmo-500">
            追剧追书 · 雅韵 · 记录你的精神足迹
          </p>
        </div>
      </footer>
    </div>
  );
}

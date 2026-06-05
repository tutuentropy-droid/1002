import { BookOpen, Plus, BarChart3, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';

interface HeaderProps {
  onAddClick: () => void;
}

export function Header({ onAddClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-yuebai-100/90 backdrop-blur-md border-b border-zhuqing-200/30">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-zhusha-600 flex items-center justify-center shadow-seal">
                <BookOpen size={22} className="text-yuebai-50" />
              </div>
              <div>
                <h1 className="text-2xl font-kai text-songyan-800 tracking-wider">
                  追剧追书
                </h1>
                <p className="text-xs text-danmo-500 -mt-1">· 雅韵 ·</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/tags">
              <Button variant="outline" className="gap-2">
                <Tag size={18} />
                <span className="hidden sm:inline">标签管理</span>
              </Button>
            </Link>
            <Link to="/annual-report">
              <Button variant="outline" className="gap-2">
                <BarChart3 size={18} />
                <span className="hidden sm:inline">年度报告</span>
              </Button>
            </Link>
            <Button onClick={onAddClick} className="gap-2">
              <Plus size={18} />
              <span className="hidden sm:inline">添加记录</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

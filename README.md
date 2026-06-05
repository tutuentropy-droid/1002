# 追剧追书 · 雅韵

一款个人影视与读书追踪 Web 应用，帮助你记录想看、在看、已看完的书籍、电影和剧集，建立个人精神生活档案。

## ✨ 设计理念

**融中国古典美学于现代交互，如展卷品茗般雅致**

- **黛青** `#2C3E50` — 如远山深邃
- **月白** `#F5F0E8` — 如宣纸温润
- **朱砂** `#C0392B` — 如印泥明艳
- **松烟** `#34495E` — 如墨色沉郁
- **竹青** `#7F8C8D` — 如竹影清雅
- **鎏金** `#D4A017` — 如星光辉映

## 🚀 功能特性

### 内容管理
- ✅ 添加记录：标题、类型（书/电影/剧）、封面图片URL、年份、简介
- ✅ 删除记录：带确认弹窗，防止误操作
- ✅ 编辑记录：修改记录的基本信息

### 状态追踪
- 🔄 三态流转：想看 → 在看 → 看完
- 🎨 印章式状态切换动画
- ⚠️ 状态变更时自动处理评分和短评

### 评价系统
- ⭐ 五星打分（1-5星），仅"看完"状态可用
- 💬 短评撰写（最多200字），仅"看完"状态可用
- ✨ 星星点亮动画效果

### 浏览与筛选
- 🏠 首页卡片式展示所有记录
- 🔍 标题关键词实时搜索
- 📂 按类型筛选（全部/书/电影/剧）
- 📊 按状态筛选（全部/想看/在看/看完）
- 📈 顶部统计面板展示数据概览

### 表单验证
- ✅ 标题必填，1-100字
- ✅ 类型必选
- ✅ 封面URL格式校验
- ✅ 年份范围校验（1900-2100）
- ✅ 简介长度限制（最多500字）
- ✅ 短评长度限制（最多200字）

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | UI 框架 |
| TypeScript | 5.x | 类型系统 |
| Vite | 6.x | 构建工具 |
| Tailwind CSS | 3.x | CSS 框架 |
| Zustand | 5.x | 状态管理 |
| React Router | 7.x | 路由管理 |
| Lucide React | 0.x | 图标库 |
| localStorage | - | 数据持久化 |

## 📦 安装与运行

### 环境要求
- Node.js >= 16.x
- npm >= 8.x

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

### 类型检查
```bash
npm run check
```

### 代码检查
```bash
npm run lint
```

## 🐳 Docker 部署

### 环境变量配置

复制环境变量示例文件：
```bash
cp .env.example .env
```

环境变量说明：
- `PORT`: 服务端口（默认: 8080）
- `DEBUG_MODE`: 调试模式开关（默认: false）

### 使用 Docker Compose 启动

#### 构建并启动服务
```bash
docker-compose up -d --build
```

#### 查看服务状态
```bash
docker-compose ps
```

#### 查看日志
```bash
docker-compose logs -f
```

#### 停止服务
```bash
docker-compose down
```

### 使用 Docker 直接运行

#### 构建镜像
```bash
docker build -t zhui-ju-zhui-shu .
```

#### 运行容器
```bash
docker run -d -p 8080:80 --name zhui-ju-zhui-shu zhui-ju-zhui-shu
```

### 访问应用

启动后访问：`http://localhost:8080`

> **注意**: 本项目数据存储在浏览器 localStorage 中，数据持久化由浏览器管理，容器重启不会影响用户数据。

## 📁 项目结构

```
├── src/
│   ├── components/          # 可复用组件
│   │   ├── ui/             # 基础 UI 组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Textarea.tsx
│   │   │   └── StarRating.tsx
│   │   ├── RecordCard.tsx  # 记录卡片组件
│   │   ├── RecordForm.tsx  # 添加/编辑表单组件
│   │   ├── FilterBar.tsx   # 筛选栏组件
│   │   └── Header.tsx      # 顶部导航组件
│   ├── pages/              # 页面组件
│   │   └── Home.tsx        # 首页
│   ├── store/              # 状态管理
│   │   └── useRecordStore.ts
│   ├── hooks/              # 自定义 Hooks
│   │   └── useLocalStorage.ts
│   ├── utils/              # 工具函数
│   │   ├── validation.ts   # 表单验证
│   │   └── constants.ts    # 常量定义
│   ├── types/              # TypeScript 类型定义
│   │   └── index.ts
│   ├── mock/               # 模拟数据
│   │   └── initialData.ts
│   ├── lib/                # 工具库
│   │   └── utils.ts
│   ├── App.tsx             # 根组件
│   ├── main.tsx            # 入口文件
│   └── index.css           # 全局样式与 Tailwind 指令
├── public/                 # 静态资源
├── .trae/documents/        # 项目文档
│   ├── prd.md             # 产品需求文档
│   └── technical-architecture.md  # 技术架构文档
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 📊 数据模型

### Record 记录
```typescript
interface Record {
  id: string;           // 唯一标识
  title: string;        // 标题
  type: 'book' | 'movie' | 'show';  // 类型
  coverUrl?: string;    // 封面图片URL
  year?: number;        // 年份
  description?: string; // 简介
  status: 'wish' | 'in_progress' | 'completed';  // 状态
  rating?: number;      // 评分 1-5
  review?: string;      // 短评
  createdAt: string;    // 创建时间
  updatedAt: string;    // 更新时间
}
```

## 🎨 设计亮点

### 中国古典美学
- 宣纸纹理背景，淡墨晕染效果
- 印章式类型标签和状态按钮
- 书法字体（ZCOOL XiaoWei + Noto Serif SC）
- 卷轴展开式弹窗动画
- 水墨风格过渡动画

### 交互动效
- 页面加载：记录卡片错落淡入
- 状态切换：印章按下回弹效果
- 评分：星星点亮动画
- 弹窗：卷轴展开/收起
- 悬停：卡片微微浮起效果

### 响应式设计
- 桌面端：3列网格布局
- 平板端：2列网格布局
- 移动端：单列布局
- 触摸优化，最小44px触控区域

## 💾 数据存储

- 数据自动保存到浏览器 `localStorage`
- 首次访问自动加载示例数据
- 刷新页面数据不丢失
- 存储键名：`zhui-ju-zhui-shu-records`

## 📝 使用说明

1. **添加记录**：点击右上角「添加记录」按钮，填写表单后保存
2. **更新状态**：点击卡片上的「想看」「在看」「看完」按钮切换状态
3. **评分**：状态为「看完」后，点击星星进行打分
4. **写短评**：状态为「看完」后，点击「添加短评」按钮撰写
5. **编辑记录**：点击卡片右上角的编辑图标
6. **删除记录**：点击卡片右上角的删除图标，确认后删除
7. **筛选**：使用筛选栏按类型或状态过滤记录
8. **搜索**：在搜索框输入标题关键词实时搜索

## 📄 开源协议

MIT License
# 1002

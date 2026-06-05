import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { Home } from '../pages/Home'
import { useRecordStore } from '../store/useRecordStore'

function renderHome() {
  return render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  )
}

function getFilterSection() {
  return screen.getByText('类型').closest('div')!
}

function getStatusSection() {
  return screen.getByText('状态').closest('div')!
}

beforeEach(() => {
  const store = useRecordStore.getState()
  store.records = []
  store.tags = []
  store.filters = { type: 'all', status: 'all', searchKeyword: '', selectedTags: [] }
  store.isLoaded = false
  store.loadFromStorage()
})

describe('首页搜索与筛选集成测试', () => {
  describe('按类型筛选', () => {
    test('点击"书"筛选，只显示书籍类型记录', async () => {
      const user = userEvent.setup()
      renderHome()

      const typeSection = getFilterSection()
      await user.click(within(typeSection).getByText(/书 \(/))

      const recordCards = screen.getAllByRole('button', { name: '编辑' }).map(
        (btn) => btn.closest('[class*="card"]')!
      )
      expect(recordCards.length).toBe(3)

      expect(screen.getByText('活着')).toBeInTheDocument()
      expect(screen.getByText('三体')).toBeInTheDocument()
      expect(screen.getByText('百年孤独')).toBeInTheDocument()

      expect(screen.queryByText('霸王别姬')).not.toBeInTheDocument()
      expect(screen.queryByText('长安三万里')).not.toBeInTheDocument()
      expect(screen.queryByText('琅琊榜')).not.toBeInTheDocument()
    })

    test('点击"电影"筛选，只显示电影类型记录', async () => {
      const user = userEvent.setup()
      renderHome()

      const typeSection = getFilterSection()
      await user.click(within(typeSection).getByText(/电影 \(/))

      const titles = screen.getAllByRole('heading', { level: 3 })
      expect(titles.length).toBe(2)
      expect(screen.getByText('霸王别姬')).toBeInTheDocument()
      expect(screen.getByText('长安三万里')).toBeInTheDocument()
    })

    test('点击"剧"筛选，只显示剧集类型记录', async () => {
      const user = userEvent.setup()
      renderHome()

      const typeSection = getFilterSection()
      await user.click(within(typeSection).getByText(/剧 \(/))

      const titles = screen.getAllByRole('heading', { level: 3 })
      expect(titles.length).toBe(1)
      expect(screen.getByText('琅琊榜')).toBeInTheDocument()
    })

    test('点击"全部"恢复显示所有记录', async () => {
      const user = userEvent.setup()
      renderHome()

      const typeSection = getFilterSection()
      await user.click(within(typeSection).getByText(/电影 \(/))
      expect(screen.getAllByRole('heading', { level: 3 }).length).toBe(2)

      await user.click(within(typeSection).getByText(/全部 \(/))
      expect(screen.getAllByRole('heading', { level: 3 }).length).toBe(6)
    })
  })

  describe('按状态筛选', () => {
    test('点击"看完"筛选，只显示已完成记录', async () => {
      const user = userEvent.setup()
      renderHome()

      const statusSection = getStatusSection()
      await user.click(within(statusSection).getByText(/看完 \(/))

      const titles = screen.getAllByRole('heading', { level: 3 })
      expect(titles.length).toBe(3)
      expect(screen.getByText('活着')).toBeInTheDocument()
      expect(screen.getByText('霸王别姬')).toBeInTheDocument()
      expect(screen.getByText('琅琊榜')).toBeInTheDocument()
    })

    test('点击"在看"筛选，只显示进行中记录', async () => {
      const user = userEvent.setup()
      renderHome()

      const statusSection = getStatusSection()
      await user.click(within(statusSection).getByText(/在看 \(/))

      const titles = screen.getAllByRole('heading', { level: 3 })
      expect(titles.length).toBe(1)
      expect(screen.getByText('三体')).toBeInTheDocument()
    })

    test('点击"想看"筛选，只显示想看记录', async () => {
      const user = userEvent.setup()
      renderHome()

      const statusSection = getStatusSection()
      await user.click(within(statusSection).getByText(/想看 \(/))

      const titles = screen.getAllByRole('heading', { level: 3 })
      expect(titles.length).toBe(2)
      expect(screen.getByText('长安三万里')).toBeInTheDocument()
      expect(screen.getByText('百年孤独')).toBeInTheDocument()
    })
  })

  describe('类型和状态同时筛选', () => {
    test('筛选"书" + "看完"，只显示已完成书籍', async () => {
      const user = userEvent.setup()
      renderHome()

      const typeSection = getFilterSection()
      await user.click(within(typeSection).getByText(/书 \(/))

      const statusSection = getStatusSection()
      await user.click(within(statusSection).getByText(/看完 \(/))

      const titles = screen.getAllByRole('heading', { level: 3 })
      expect(titles.length).toBe(1)
      expect(screen.getByText('活着')).toBeInTheDocument()

      expect(screen.queryByText('三体')).not.toBeInTheDocument()
      expect(screen.queryByText('百年孤独')).not.toBeInTheDocument()
    })

    test('筛选"电影" + "想看"，只显示想看的电影', async () => {
      const user = userEvent.setup()
      renderHome()

      const typeSection = getFilterSection()
      await user.click(within(typeSection).getByText(/电影 \(/))

      const statusSection = getStatusSection()
      await user.click(within(statusSection).getByText(/想看 \(/))

      const titles = screen.getAllByRole('heading', { level: 3 })
      expect(titles.length).toBe(1)
      expect(screen.getByText('长安三万里')).toBeInTheDocument()
    })

    test('筛选"剧" + "想看"，结果为空', async () => {
      const user = userEvent.setup()
      renderHome()

      const typeSection = getFilterSection()
      await user.click(within(typeSection).getByText(/剧 \(/))

      const statusSection = getStatusSection()
      await user.click(within(statusSection).getByText(/想看 \(/))

      expect(screen.getByText('暂无记录')).toBeInTheDocument()
      expect(screen.getByText('没有符合筛选条件的记录')).toBeInTheDocument()
    })

    test('同时筛选后切换类型，状态筛选仍然生效', async () => {
      const user = userEvent.setup()
      renderHome()

      const typeSection = getFilterSection()
      await user.click(within(typeSection).getByText(/书 \(/))

      const statusSection = getStatusSection()
      await user.click(within(statusSection).getByText(/看完 \(/))

      expect(screen.getAllByRole('heading', { level: 3 }).length).toBe(1)

      await user.click(within(typeSection).getByText(/电影 \(/))

      const titles = screen.getAllByRole('heading', { level: 3 })
      expect(titles.length).toBe(2)
      expect(screen.getByText('霸王别姬')).toBeInTheDocument()
      expect(screen.getByText('琅琊榜')).not.toBeInTheDocument()
    })
  })

  describe('关键词搜索', () => {
    test('输入关键词"三体"，只显示匹配记录', async () => {
      const user = userEvent.setup()
      renderHome()

      const searchInput = screen.getByPlaceholderText('搜索标题...')
      await user.type(searchInput, '三体')

      const titles = screen.getAllByRole('heading', { level: 3 })
      expect(titles.length).toBe(1)
      expect(screen.getByText('三体')).toBeInTheDocument()
    })

    test('输入关键词"三"可以匹配"三体"和"长安三万里"', async () => {
      const user = userEvent.setup()
      renderHome()

      const searchInput = screen.getByPlaceholderText('搜索标题...')
      await user.type(searchInput, '三')

      const titles = screen.getAllByRole('heading', { level: 3 })
      expect(titles.length).toBe(2)
      expect(screen.getByText('三体')).toBeInTheDocument()
      expect(screen.getByText('长安三万里')).toBeInTheDocument()
    })

    test('搜索不区分大小写', async () => {
      const user = userEvent.setup()
      renderHome()

      const store = useRecordStore.getState()
      store.addRecord({
        title: 'ABC Test Book',
        type: 'book',
        tagIds: [],
      })

      const searchInput = screen.getByPlaceholderText('搜索标题...')
      await user.type(searchInput, 'abc')

      const titles = screen.getAllByRole('heading', { level: 3 })
      expect(titles.length).toBe(1)
      expect(screen.getByText('ABC Test Book')).toBeInTheDocument()
    })

    test('搜索与类型筛选组合使用', async () => {
      const user = userEvent.setup()
      renderHome()

      const typeSection = getFilterSection()
      await user.click(within(typeSection).getByText(/书 \(/))

      const searchInput = screen.getByPlaceholderText('搜索标题...')
      await user.type(searchInput, '活')

      const titles = screen.getAllByRole('heading', { level: 3 })
      expect(titles.length).toBe(1)
      expect(screen.getByText('活着')).toBeInTheDocument()
    })
  })

  describe('搜索结果为空', () => {
    test('输入不匹配的关键词，显示空状态提示', async () => {
      const user = userEvent.setup()
      renderHome()

      const searchInput = screen.getByPlaceholderText('搜索标题...')
      await user.type(searchInput, '不存在的记录')

      expect(screen.getByText('暂无记录')).toBeInTheDocument()
      expect(screen.getByText('没有符合筛选条件的记录')).toBeInTheDocument()
    })

    test('筛选组合导致无结果时，显示空状态提示', async () => {
      const user = userEvent.setup()
      renderHome()

      const typeSection = getFilterSection()
      await user.click(within(typeSection).getByText(/剧 \(/))

      const statusSection = getStatusSection()
      await user.click(within(statusSection).getByText(/想看 \(/))

      expect(screen.getByText('暂无记录')).toBeInTheDocument()
      expect(screen.getByText('没有符合筛选条件的记录')).toBeInTheDocument()
    })

    test('空结果提示区分"无数据"和"筛选无结果"', async () => {
      const store = useRecordStore.getState()
      store.records = []
      store.isLoaded = true

      renderHome()

      expect(screen.getByText('暂无记录')).toBeInTheDocument()
      expect(screen.getByText('开始添加你的第一条记录吧')).toBeInTheDocument()
      expect(screen.queryByText('没有符合筛选条件的记录')).not.toBeInTheDocument()
    })
  })

  describe('搜索词包含特殊字符', () => {
    test('搜索包含正则特殊字符"()"不会报错', async () => {
      const user = userEvent.setup()
      renderHome()

      const searchInput = screen.getByPlaceholderText('搜索标题...')
      await user.type(searchInput, '()')

      expect(screen.getByText('暂无记录')).toBeInTheDocument()
      expect(screen.getByText('没有符合筛选条件的记录')).toBeInTheDocument()
    })

    test('搜索包含正则特殊字符"[]"不会报错', async () => {
      const user = userEvent.setup()
      renderHome()

      const searchInput = screen.getByPlaceholderText('搜索标题...')
      await user.type(searchInput, '[]')

      expect(screen.getByText('暂无记录')).toBeInTheDocument()
      expect(screen.getByText('没有符合筛选条件的记录')).toBeInTheDocument()
    })

    test('搜索包含正则特殊字符"."不会报错', async () => {
      const user = userEvent.setup()
      renderHome()

      const searchInput = screen.getByPlaceholderText('搜索标题...')
      await user.type(searchInput, '.')

      expect(screen.getByText('暂无记录')).toBeInTheDocument()
      expect(screen.getByText('没有符合筛选条件的记录')).toBeInTheDocument()
    })

    test('搜索包含正则特殊字符"*+?"不会报错', async () => {
      const user = userEvent.setup()
      renderHome()

      const searchInput = screen.getByPlaceholderText('搜索标题...')
      await user.type(searchInput, '*+?')

      expect(screen.getByText('暂无记录')).toBeInTheDocument()
      expect(screen.getByText('没有符合筛选条件的记录')).toBeInTheDocument()
    })

    test('搜索包含特殊字符的标题可以匹配', async () => {
      const user = userEvent.setup()
      renderHome()

      const store = useRecordStore.getState()
      store.addRecord({
        title: '测试(特别版)',
        type: 'book',
        tagIds: [],
      })

      const searchInput = screen.getByPlaceholderText('搜索标题...')
      await user.type(searchInput, '测试(特别版)')

      const titles = screen.getAllByRole('heading', { level: 3 })
      expect(titles.length).toBe(1)
      expect(screen.getByText('测试(特别版)')).toBeInTheDocument()
    })

    test('搜索包含反斜杠不会报错', async () => {
      const user = userEvent.setup()
      renderHome()

      const searchInput = screen.getByPlaceholderText('搜索标题...')
      await user.type(searchInput, '\\')

      expect(screen.getByText('暂无记录')).toBeInTheDocument()
      expect(screen.getByText('没有符合筛选条件的记录')).toBeInTheDocument()
    })
  })
})

import { DailyRecord, getUserGoal } from './storage'

// 导出格式类型
export type ExportFormat = 'json' | 'csv' | 'txt'

// 导出数据接口
interface ExportData {
  goal: string
  period: string
  dailyAction: string
  startDate: string
  records: DailyRecord[]
}

// 生成CSV内容
const generateCSV = (data: ExportData): string => {
  const headers = ['日期', '完成度', '备注']
  const rows = data.records.map((record) => [
    new Date(record.date).toLocaleDateString(),
    `${record.completion}%`,
    record.note || '',
  ])

  return [
    `目标：${data.goal}`,
    `周期：${data.period}`,
    `每日行动：${data.dailyAction}`,
    `开始日期：${new Date(data.startDate).toLocaleDateString()}`,
    '',
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n')
}

// 生成TXT内容
const generateTXT = (data: ExportData): string => {
  const header = [
    '====== 宇宙订单进度报告 ======',
    `目标：${data.goal}`,
    `周期：${data.period}`,
    `每日行动：${data.dailyAction}`,
    `开始日期：${new Date(data.startDate).toLocaleDateString()}`,
    '\n打卡记录：',
  ].join('\n')

  const records = data.records
    .map(
      (record) =>
        `${new Date(record.date).toLocaleDateString()} - 完成度：${
          record.completion
        }% ${record.note ? `(${record.note})` : ''}`
    )
    .join('\n')

  return `${header}\n${records}`
}

// 导出数据
export const exportData = (format: ExportFormat = 'json'): string => {
  const goal = getUserGoal()
  if (!goal) throw new Error('未找到目标数据')

  const data: ExportData = {
    goal: goal.goal,
    period: goal.period,
    dailyAction: goal.dailyAction,
    startDate: goal.startDate || new Date().toISOString(),
    records: JSON.parse(localStorage.getItem('dailyRecords') || '[]'),
  }

  switch (format) {
    case 'csv':
      return generateCSV(data)
    case 'txt':
      return generateTXT(data)
    default:
      return JSON.stringify(data, null, 2)
  }
}

// 下载文件
export const downloadData = (format: ExportFormat = 'json') => {
  const content = exportData(format)
  const blob = new Blob([content], {
    type: `text/${format === 'json' ? 'json' : 'plain'}`,
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `cosmic-order-data.${format}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

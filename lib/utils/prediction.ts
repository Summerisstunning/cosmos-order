import { DailyRecord } from './storage'

// 计算趋势
const calculateTrend = (records: DailyRecord[]): number => {
  if (records.length < 2) return 0

  const recentRecords = records.slice(-7) // 使用最近7天的数据
  let sumX = 0
  let sumY = 0
  let sumXY = 0
  let sumX2 = 0
  const n = recentRecords.length

  recentRecords.forEach((record, i) => {
    sumX += i
    sumY += record.completion
    sumXY += i * record.completion
    sumX2 += i * i
  })

  // 计算线性回归斜率
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  return slope
}

// 预测未来完成度
export const predictFutureCompletion = (
  records: DailyRecord[],
  daysToPredict: number = 7
): number[] => {
  if (records.length === 0) return Array(daysToPredict).fill(0)

  const trend = calculateTrend(records)
  const lastCompletion = records[records.length - 1].completion

  return Array.from({ length: daysToPredict }, (_, i) => {
    let predicted = lastCompletion + trend * (i + 1)
    // 限制在0-100范围内
    predicted = Math.min(100, Math.max(0, predicted))
    return Math.round(predicted)
  })
}

// 预测目标完成时间
export const predictCompletionDate = (
  records: DailyRecord[],
  targetCompletion: number = 100
): Date | null => {
  if (records.length === 0) return null

  const trend = calculateTrend(records)
  if (trend <= 0) return null // 如果趋势为负，无法预测完成时间

  const lastCompletion = records[records.length - 1].completion
  const remainingCompletion = targetCompletion - lastCompletion
  const daysNeeded = Math.ceil(remainingCompletion / trend)

  const today = new Date()
  const predictedDate = new Date(today)
  predictedDate.setDate(today.getDate() + daysNeeded)

  return predictedDate
}

// 计算当前进度
export const calculateProgress = (records: DailyRecord[]): {
  current: number
  trend: string
  prediction: string
} => {
  if (records.length === 0) {
    return {
      current: 0,
      trend: '暂无数据',
      prediction: '继续加油！',
    }
  }

  const trend = calculateTrend(records)
  const lastCompletion = records[records.length - 1].completion
  const predictedDate = predictCompletionDate(records)

  return {
    current: lastCompletion,
    trend: trend > 0 ? '上升趋势' : trend < 0 ? '下降趋势' : '保持稳定',
    prediction: predictedDate
      ? `预计${predictedDate.toLocaleDateString()}达成目标`
      : '继续保持当前进度',
  }
}

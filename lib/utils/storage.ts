// 类型定义
export interface UserGoal {
  goal: string
  period: string
  dailyAction?: {
    baseMinutes: number
    activity: string
    extraAdvice?: string
    useIncrement: boolean
  }
  progress?: {
    [date: string]: {
      completion: number  // 0, 60, 80, 100
      mode: 'morning' | 'night'
    }
  }
  startDate?: string
}

const STORAGE_KEY = 'cosmos-user-goal'

export function getUserGoal(): UserGoal | null {
  if (typeof window === 'undefined') return null
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored)
  } catch (error) {
    console.error('Error parsing stored goal:', error)
    return null
  }
}

export function setUserGoal(goal: UserGoal): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goal))
  } catch (error) {
    console.error('Error storing goal:', error)
  }
}

export function updateDailyProgress(completion: number, mode: 'morning' | 'night'): void {
  const goal = getUserGoal()
  if (!goal) return

  const today = new Date().toISOString().split('T')[0]
  
  goal.progress = goal.progress || {}
  goal.progress[today] = { completion, mode }
  
  setUserGoal(goal)
}

export function getDailyProgress(date?: string): { completion: number, mode: 'morning' | 'night' } | null {
  const goal = getUserGoal()
  if (!goal?.progress) return null

  const targetDate = date || new Date().toISOString().split('T')[0]
  return goal.progress[targetDate] || null
}

export function getStreakCount(): number {
  const goal = getUserGoal()
  if (!goal?.progress) return 0

  const today = new Date().toISOString().split('T')[0]
  const dates = Object.keys(goal.progress).sort()
  
  let streak = 0
  let currentDate = new Date(today)
  
  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0]
    const progress = goal.progress[dateStr]
    
    if (!progress || progress.completion === 0) break
    
    streak++
    currentDate.setDate(currentDate.getDate() - 1)
  }
  
  return streak
}

export function getTotalDays(): number {
  const goal = getUserGoal()
  if (!goal?.progress) return 0
  
  return Object.keys(goal.progress).filter(date => {
    const progress = goal.progress![date]
    return progress.completion > 0
  }).length
}

export function getLastDayProgress(): { completion: number, message: string } | null {
  const goal = getUserGoal()
  if (!goal?.progress) return null

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]
  
  const progress = goal.progress[yesterdayStr]
  if (!progress) return null

  let message = '继续加油！'
  if (progress.completion === 100) message = '太棒了！'
  else if (progress.completion >= 80) message = '不错哦！'
  else if (progress.completion >= 60) message = '还可以！'
  
  return {
    completion: progress.completion,
    message
  }
}

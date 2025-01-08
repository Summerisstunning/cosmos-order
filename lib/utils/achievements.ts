import { DailyRecord } from './storage'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  condition: (records: DailyRecord[]) => boolean
  reward?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

// 成就列表
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: '星际启程',
    description: '完成第一次打卡',
    icon: '🚀',
    condition: (records) => records.length >= 1,
    rarity: 'common',
  },
  {
    id: 'week_streak',
    title: '七日恒星',
    description: '连续打卡7天',
    icon: '⭐',
    condition: (records) => {
      let streak = 1
      for (let i = records.length - 1; i > 0; i--) {
        const curr = new Date(records[i].date)
        const prev = new Date(records[i - 1].date)
        const diffDays = Math.floor(
          (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
        )
        if (diffDays === 1) streak++
        else break
      }
      return streak >= 7
    },
    rarity: 'rare',
  },
  {
    id: 'month_master',
    title: '月球守护者',
    description: '累计打卡30天',
    icon: '🌙',
    condition: (records) => records.length >= 30,
    rarity: 'epic',
  },
  {
    id: 'perfect_week',
    title: '完美星期',
    description: '连续7天100%完成度',
    icon: '💫',
    condition: (records) => {
      const lastWeek = records.slice(-7)
      return (
        lastWeek.length === 7 &&
        lastWeek.every((record) => record.completion === 100)
      )
    },
    rarity: 'legendary',
  },
  {
    id: 'early_bird',
    title: '晨星捕手',
    description: '连续3天在早上完成打卡',
    icon: '🌅',
    condition: (records) => {
      const lastThree = records.slice(-3)
      return (
        lastThree.length === 3 &&
        lastThree.every((record) => {
          const hour = new Date(record.date).getHours()
          return hour < 10
        })
      )
    },
    rarity: 'rare',
  },
  {
    id: 'comeback',
    title: '涅槃重生',
    description: '中断后重新开始打卡',
    icon: '🔥',
    condition: (records) => {
      if (records.length < 3) return false
      const lastThree = records.slice(-3)
      const gaps = []
      for (let i = 1; i < lastThree.length; i++) {
        const curr = new Date(lastThree[i].date)
        const prev = new Date(lastThree[i - 1].date)
        const diffDays = Math.floor(
          (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
        )
        gaps.push(diffDays)
      }
      return gaps.some((gap) => gap > 1) && gaps[gaps.length - 1] === 1
    },
    rarity: 'epic',
  },
]

// 获取已解锁的成就
export const getUnlockedAchievements = (records: DailyRecord[]): Achievement[] => {
  return ACHIEVEMENTS.filter((achievement) => achievement.condition(records))
}

// 检查新解锁的成就
export const checkNewAchievements = (
  records: DailyRecord[]
): Achievement[] => {
  const unlockedAchievements = getUnlockedAchievements(records)
  const previouslyUnlocked = JSON.parse(
    localStorage.getItem('unlockedAchievements') || '[]'
  )
  
  const newAchievements = unlockedAchievements.filter(
    (achievement) =>
      !previouslyUnlocked.includes(achievement.id)
  )

  // 保存新解锁的成就
  localStorage.setItem(
    'unlockedAchievements',
    JSON.stringify(unlockedAchievements.map((a) => a.id))
  )

  return newAchievements
}

// 获取成就完成度
export const getAchievementProgress = (): {
  total: number
  unlocked: number
  percentage: number
} => {
  const unlockedIds = JSON.parse(
    localStorage.getItem('unlockedAchievements') || '[]'
  )
  return {
    total: ACHIEVEMENTS.length,
    unlocked: unlockedIds.length,
    percentage: Math.round((unlockedIds.length / ACHIEVEMENTS.length) * 100),
  }
}

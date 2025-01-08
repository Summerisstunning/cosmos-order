'use client'

import { AchievementCard } from '@/components/cosmos/achievement-card'
import { CosmicCard } from '@/components/cosmos/cosmic-card'
import { ParticleEffect } from '@/components/cosmos/particle-effect'
import { StarBackground } from '@/components/cosmos/star-background'
import {
  ACHIEVEMENTS,
  getAchievementProgress,
  getUnlockedAchievements,
} from '@/lib/utils/achievements'
import { getDailyRecords } from '@/lib/utils/storage'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function AchievementsPage() {
  const [unlockedAchievements, setUnlockedAchievements] = useState(
    ACHIEVEMENTS
  )
  const [progress, setProgress] = useState({
    total: 0,
    unlocked: 0,
    percentage: 0,
  })

  useEffect(() => {
    const records = getDailyRecords()
    setUnlockedAchievements(getUnlockedAchievements(records))
    setProgress(getAchievementProgress())
  }, [])

  return (
    <main className="min-h-screen p-4 pb-24">
      <StarBackground />
      <ParticleEffect count={15} speed={0.5} />

      <div className="mx-auto max-w-2xl">
        {/* 页面标题 */}
        <motion.h1
          className="mb-6 text-2xl font-bold text-star-primary"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          宇宙成就
        </motion.h1>

        {/* 进度概览 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CosmicCard>
            <div className="p-4">
              <h2 className="mb-4 text-lg font-bold text-star-primary">
                成就进度
              </h2>
              <div className="mb-2 flex justify-between text-sm text-star-secondary">
                <span>
                  已解锁 {progress.unlocked}/{progress.total}
                </span>
                <span>{progress.percentage}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-cosmos-dark">
                <motion.div
                  className="h-full bg-cosmos-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </CosmicCard>
        </motion.div>

        {/* 成就列表 */}
        <div className="grid gap-4">
          {ACHIEVEMENTS.map((achievement, index) => {
            const isUnlocked = unlockedAchievements.some(
              (a) => a.id === achievement.id
            )
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 3) }}
              >
                {isUnlocked ? (
                  <AchievementCard achievement={achievement} />
                ) : (
                  <CosmicCard className="p-4 opacity-50 grayscale">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-cosmos-dark/50" />
                      <div>
                        <h3 className="font-bold text-star-primary">
                          ??? 未解锁
                        </h3>
                        <p className="text-sm text-star-secondary">
                          继续努力解锁这个成就吧！
                        </p>
                      </div>
                    </div>
                  </CosmicCard>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

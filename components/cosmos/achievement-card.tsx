'use client'

import { Achievement } from '@/lib/utils/achievements'
import { motion } from 'framer-motion'
import { CosmicCard } from './cosmic-card'

const rarityColors = {
  common: 'bg-blue-500',
  rare: 'bg-purple-500',
  epic: 'bg-yellow-500',
  legendary: 'bg-red-500',
}

interface AchievementCardProps {
  achievement: Achievement
  isNew?: boolean
}

export const AchievementCard = ({
  achievement,
  isNew = false,
}: AchievementCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <CosmicCard className="relative overflow-hidden">
        {/* 新解锁标记 */}
        {isNew && (
          <div className="absolute right-0 top-0">
            <div className="translate-x-1/2 -translate-y-1/2 rotate-45 bg-cosmos-gold px-4 py-1 text-xs font-bold text-cosmos-dark">
              NEW!
            </div>
          </div>
        )}

        <div className="flex items-start gap-4 p-4">
          {/* 图标 */}
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cosmos-dark/50 text-2xl">
            {achievement.icon}
          </div>

          {/* 内容 */}
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="font-bold text-star-primary">
                {achievement.title}
              </h3>
              <span
                className={`rounded px-2 py-0.5 text-xs ${
                  rarityColors[achievement.rarity]
                }`}
              >
                {achievement.rarity.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-star-secondary">
              {achievement.description}
            </p>
            {achievement.reward && (
              <p className="mt-2 text-xs text-cosmos-gold">
                奖励：{achievement.reward}
              </p>
            )}
          </div>
        </div>
      </CosmicCard>
    </motion.div>
  )
}

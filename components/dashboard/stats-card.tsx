'use client'

import { CosmicCard } from '@/components/cosmos/cosmic-card'
import { motion } from 'framer-motion'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: string
}

export const StatsCard = ({
  title,
  value,
  description,
  icon,
}: StatsCardProps) => {
  return (
    <CosmicCard className="p-4">
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {icon && (
          <div className="text-3xl text-cosmos-gold opacity-80">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-sm font-medium text-star-secondary">
            {title}
          </h3>
          <div className="mt-1 text-2xl font-bold text-star-primary">
            {value}
          </div>
          {description && (
            <p className="mt-1 text-xs text-star-secondary/80">
              {description}
            </p>
          )}
        </div>
      </motion.div>
    </CosmicCard>
  )
}

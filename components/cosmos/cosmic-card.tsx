'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import React from 'react'

interface CosmicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'highlight'
  hover?: boolean
}

export const CosmicCard = ({
  className,
  children,
  variant = 'default',
  hover = true,
  ...props
}: CosmicCardProps) => {
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-xl backdrop-blur-lg',
        variant === 'default'
          ? 'bg-cosmos-dark/30 shadow-lg'
          : 'bg-gradient-to-br from-cosmos-gold/20 to-cosmos-blue/20 shadow-xl',
        hover && 'hover:shadow-cosmos-gold/10',
        className
      )}
      whileHover={
        hover
          ? {
              scale: 1.02,
              transition: { duration: 0.2 },
            }
          : undefined
      }
      {...props}
    >
      {variant === 'highlight' && (
        <div className="absolute inset-0 bg-gradient-to-br from-cosmos-gold/10 to-cosmos-blue/10" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

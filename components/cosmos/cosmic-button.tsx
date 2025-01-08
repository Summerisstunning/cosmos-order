'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import React from 'react'

interface CosmicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'
  size?: 'default' | 'lg'
  children: React.ReactNode
}

export const CosmicButton = ({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}: CosmicButtonProps) => {
  return (
    <motion.button
      className={cn(
        'relative overflow-hidden rounded-lg font-medium tracking-wide transition-all',
        variant === 'default'
          ? 'bg-gradient-to-r from-cosmos-gold to-cosmos-blue text-white'
          : 'border-2 border-cosmos-gold bg-transparent text-cosmos-gold',
        size === 'default' ? 'px-6 py-2 text-sm' : 'px-8 py-3 text-lg',
        'hover:shadow-lg hover:shadow-cosmos-gold/20',
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-cosmos-gold/20 to-cosmos-blue/20"
        initial={{ x: '100%' }}
        whileHover={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      />
    </motion.button>
  )
}

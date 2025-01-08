'use client'

import { motion } from 'framer-motion'
import React from 'react'

// 渐入动画
export const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
)

// 缩放动画
export const ScaleIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
)

// 滑入动画
export const SlideIn = ({
  children,
  direction = 'left',
  delay = 0,
}: {
  children: React.ReactNode
  direction?: 'left' | 'right' | 'top' | 'bottom'
  delay?: number
}) => {
  const directionMap = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    top: { x: 0, y: -50 },
    bottom: { x: 0, y: 50 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

// 星星闪烁动画
export const StarBlink = ({ size = 2, delay = 0 }: { size?: number; delay?: number }) => (
  <motion.div
    className="absolute rounded-full bg-white"
    style={{ width: size, height: size }}
    animate={{
      opacity: [0.2, 1, 0.2],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 2 + Math.random() * 2,
      delay: delay + Math.random() * 2,
      repeat: Infinity,
    }}
  />
)

// 流星动画
export const ShootingStar = () => {
  const startX = -20 // 起始位置
  const startY = Math.random() * 30 // 随机起始高度
  const duration = 1.5 + Math.random() * 0.5 // 随机持续时间

  return (
    <motion.div
      className="absolute h-px w-20 bg-gradient-to-r from-transparent via-white to-transparent"
      style={{
        top: `${startY}%`,
        left: `${startX}%`,
        transform: 'rotate(45deg)',
      }}
      animate={{
        x: ['0vw', '120vw'],
        y: ['0vh', '120vh'],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatDelay: 3 + Math.random() * 5,
        ease: 'linear',
      }}
    />
  )
}

// 波纹动画
export const Ripple = ({ color = 'rgba(245, 195, 44, 0.2)' }) => (
  <motion.div
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
    style={{ border: `2px solid ${color}` }}
    animate={{
      scale: [1, 2],
      opacity: [1, 0],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeOut',
    }}
  />
)

// 加载动画
export const LoadingSpinner = () => (
  <motion.div
    className="h-6 w-6 rounded-full border-2 border-star-secondary border-t-transparent"
    animate={{ rotate: 360 }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    }}
  />
)

// 成功动画
export const SuccessCheck = () => (
  <motion.div
    className="relative h-16 w-16"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{
      type: 'spring',
      stiffness: 200,
      damping: 20,
    }}
  >
    <motion.div
      className="absolute left-0 top-1/2 h-1 w-8 origin-left bg-cosmos-gold"
      initial={{ rotate: 45, scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ delay: 0.2 }}
    />
    <motion.div
      className="absolute right-0 top-0 h-1 w-12 origin-right bg-cosmos-gold"
      initial={{ rotate: -45, scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ delay: 0.3 }}
    />
  </motion.div>
)

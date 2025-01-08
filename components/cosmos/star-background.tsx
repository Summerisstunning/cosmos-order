'use client'

import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  delay: number
  duration: number
}

// 使用 dynamic 导入确保客户端渲染
const StarBackgroundClient = () => {
  const [stars, setStars] = useState<Star[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // 生成随机星星
    const generateStars = () => {
      const newStars: Star[] = []
      for (let i = 0; i < 30; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.3,
          delay: Math.random() * 3,
          duration: 1.5 + Math.random() * 2
        })
      }
      return newStars
    }

    // 初始化星星
    setStars(generateStars())
    setMounted(true)

    // 每隔一段时间重新生成一些星星
    const interval = setInterval(() => {
      setStars(prevStars => {
        const newStars = [...prevStars]
        // 随机替换 3-5 颗星星
        const replaceCount = Math.floor(Math.random() * 3) + 3
        for (let i = 0; i < replaceCount; i++) {
          const index = Math.floor(Math.random() * newStars.length)
          newStars[index] = {
            id: newStars[index].id,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.3,
            delay: 0,
            duration: 1.5 + Math.random() * 2
          }
        }
        return newStars
      })
    }, 3000) // 每3秒更新一次

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {/* 金光闪烁效果 */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-[#FFD700]"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            boxShadow: '0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700',
          }}
          animate={{
            opacity: [0, star.opacity, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// 导出使用 dynamic 包装的组件
export const StarBackground = dynamic(() => Promise.resolve(StarBackgroundClient), {
  ssr: false,
})

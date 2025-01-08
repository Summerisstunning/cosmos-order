'use client'

import { motion } from 'framer-motion'
import React, { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  velocity: {
    x: number
    y: number
  }
}

interface ParticleEffectProps {
  count?: number
  colors?: string[]
  speed?: number
}

const ParticleEffectClient = ({
  count = 20,
  colors = ['#F5C32C', '#4FAAF8', '#FFFFFF'],
  speed = 1,
}: ParticleEffectProps) => {
  const particlesRef = useRef<Particle[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()
  const lastUpdateRef = useRef<number>(0)

  // 初始化粒子
  useEffect(() => {
    // 生成初始粒子
    particlesRef.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocity: {
        x: (Math.random() - 0.5) * speed,
        y: (Math.random() - 0.5) * speed,
      },
    }))

    // 更新粒子位置
    const updateParticles = (timestamp: number) => {
      if (!containerRef.current) return

      if (timestamp - lastUpdateRef.current >= 16) { // 约60fps
        const particles = particlesRef.current
        for (let i = 0; i < particles.length; i++) {
          const particle = particles[i]
          
          // 更新位置
          particle.x += particle.velocity.x
          particle.y += particle.velocity.y

          // 边界检查
          if (particle.x < 0 || particle.x > 100) {
            particle.velocity.x *= -1
          }
          if (particle.y < 0 || particle.y > 100) {
            particle.velocity.y *= -1
          }

          // 更新DOM
          const element = containerRef.current.children[i] as HTMLElement
          if (element) {
            element.style.transform = `translate(${particle.x}%, ${particle.y}%)`
          }
        }
        lastUpdateRef.current = timestamp
      }
      animationFrameRef.current = requestAnimationFrame(updateParticles)
    }

    // 开始动画
    animationFrameRef.current = requestAnimationFrame(updateParticles)

    // 清理
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [count, colors, speed])

  return (
    <div ref={containerRef} className="pointer-events-none fixed inset-0 z-10">
      {Array.from({ length: count }).map((_, i) => {
        const particle = particlesRef.current[i] || {
          id: i,
          x: 0,
          y: 0,
          size: 2,
          color: colors[0],
        }
        return (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              transform: `translate(${particle.x}%, ${particle.y}%)`,
              transition: 'transform 0.016s linear',
            }}
          />
        )
      })}
    </div>
  )
}

// 导出使用 dynamic 包装的组件
export const ParticleEffect = dynamic(
  () => Promise.resolve(ParticleEffectClient),
  {
    ssr: false,
  }
)

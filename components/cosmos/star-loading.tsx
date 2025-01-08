'use client'

import { useEffect, useState } from 'react'
import { StarBackground } from './star-background'

// 金色光电粒子效果
function GoldenParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            background: '#D4B86A',
            opacity: Math.random() * 0.5 + 0.3,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 3 + 2}s`,
          }}
        />
      ))}
    </div>
  )
}

export function StarLoading() {
  const [text, setText] = useState('')
  const fullText = '闭目虔心递愿函 宇宙回赠日行笺'

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      setText(fullText.slice(0, index))
      index++
      if (index > fullText.length) {
        index = 0
      }
    }, 200)

    return () => clearInterval(timer)
  }, [])

  return (
    <main className="relative min-h-screen">
      <StarBackground />
      <GoldenParticles />
      <div className="absolute inset-0 flex items-center justify-center -translate-y-20">
        <h1 className="text-center text-2xl font-medium text-white">
          {text}
          <span className="animate-pulse">_</span>
        </h1>
      </div>
    </main>
  )
}

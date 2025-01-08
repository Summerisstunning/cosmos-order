'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { CosmicButton } from './cosmic-button'

interface AudioPlayerProps {
  src: string
  duration?: number // 单位：秒
  onComplete?: () => void
  autoPlay?: boolean
}

export const AudioPlayer = ({
  src,
  duration,
  onComplete,
  autoPlay = false,
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (autoPlay) {
      handlePlay()
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          const currentProgress =
            (audioRef.current.currentTime / (duration || audioRef.current.duration)) * 100
          setProgress(currentProgress)

          if (currentProgress >= 100) {
            handleComplete()
          }
        }
      }, 100)
    }
  }

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }

  const handleComplete = () => {
    setIsPlaying(false)
    setProgress(100)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    onComplete?.()
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <audio ref={audioRef} src={src} onEnded={handleComplete} />
      
      <motion.div
        className="relative h-32 w-32"
        animate={{
          scale: isPlaying ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: isPlaying ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        {/* 外圈光环 */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-cosmos-gold/20 to-cosmos-blue/20"
          animate={{
            scale: isPlaying ? [1.1, 1.2, 1.1] : 1.1,
            opacity: isPlaying ? [0.5, 0.8, 0.5] : 0.5,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* 播放按钮 */}
        <CosmicButton
          className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full p-0"
          onClick={isPlaying ? handlePause : handlePlay}
        >
          <span className="text-2xl">
            {isPlaying ? '⏸' : '▶️'}
          </span>
        </CosmicButton>
      </motion.div>

      {/* 进度条 */}
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-cosmos-dark">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cosmos-gold to-cosmos-blue"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 剩余时间 */}
      {duration && (
        <div className="text-sm text-star-secondary">
          {Math.ceil((duration * (100 - progress)) / 100)}秒
        </div>
      )}
    </div>
  )
}

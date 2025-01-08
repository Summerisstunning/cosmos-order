'use client'

import { AudioPlayer } from '@/components/cosmos/audio-player'
import { CosmicButton } from '@/components/cosmos/cosmic-button'
import { CosmicCard } from '@/components/cosmos/cosmic-card'
import { StarBackground } from '@/components/cosmos/star-background'
import { ParticleEffect } from '@/components/cosmos/particle-effect'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

// 安慰语录库
const COMFORT_MESSAGES = [
  {
    title: '低谷也是风景',
    message: '每个人都会有低潮的时候，这很正常。重要的是，你选择了面对而不是逃避。',
    tip: '试试深呼吸，感受此刻的平静',
  },
  {
    title: '你并不孤单',
    message: '在追求目标的路上，所有人都会遇到挫折。这是成长的必经之路。',
    tip: '给自己一个温暖的拥抱',
  },
  {
    title: '放慢脚步也可以',
    message: '不必和别人比较，每个人都有自己的节奏。慢一点没关系，停下来也没关系。',
    tip: '今天可以只完成 1% 的目标',
  },
  {
    title: '明天依然崭新',
    message: '今天没有完成目标也没关系，明天的太阳依然会升起，新的机会永远存在。',
    tip: '试试放空思绪，听听舒缓的音乐',
  },
  {
    title: '相信自己的力量',
    message: '你比自己想象的要坚强得多。每一次坚持，都在让自己变得更强大。',
    tip: '列出三件今天值得感恩的小事',
  },
  {
    title: '接纳不完美',
    message: '人生就像一幅画作，不完美的笔触才让它独特而美丽。',
    tip: '对自己说声"你已经很棒了"',
  },
  {
    title: '休息也是前进',
    message: '就像大树需要扎根一样，休息是为了更好的生长。给自己一个喘息的机会。',
    tip: '闭上眼睛，想象自己是一棵正在生长的树',
  },
]

// 呼吸引导文案
const BREATHING_GUIDE = [
  { text: '深深地吸气...', duration: 4 },
  { text: '屏住呼吸...', duration: 4 },
  { text: '缓缓地呼气...', duration: 4 },
  { text: '让心情平静下来', duration: 4 },
]

export default function ComfortPage() {
  const [currentMessage, setCurrentMessage] = useState(COMFORT_MESSAGES[0])
  const [isBreathing, setIsBreathing] = useState(false)
  const [breathingStep, setBreathingStep] = useState(0)
  const [showParticles, setShowParticles] = useState(false)

  // 随机切换安慰消息
  const changeMessage = () => {
    // 随机选择一个不同的消息
    let nextIndex
    do {
      nextIndex = Math.floor(Math.random() * COMFORT_MESSAGES.length)
    } while (COMFORT_MESSAGES[nextIndex] === currentMessage)
    
    setCurrentMessage(COMFORT_MESSAGES[nextIndex])
    setShowParticles(true)
    setTimeout(() => setShowParticles(false), 2000)
  }

  // 开始呼吸引导
  const startBreathing = () => {
    setIsBreathing(true)
    setBreathingStep(0)

    // 循环播放呼吸引导
    let step = 0
    const breathingCycle = () => {
      const interval = setInterval(() => {
        step = (step + 1) % BREATHING_GUIDE.length
        setBreathingStep(step)
        
        if (step === 0) {
          clearInterval(interval)
          setIsBreathing(false)
        }
      }, BREATHING_GUIDE[step].duration * 1000)

      return interval
    }

    const interval = breathingCycle()
    return () => clearInterval(interval)
  }

  return (
    <main className="relative min-h-screen bg-cosmos-dark p-4">
      <StarBackground />
      {showParticles && <ParticleEffect count={20} speed={1} />}

      <div className="mx-auto max-w-2xl">
        <motion.h1
          className="mb-6 text-2xl font-bold text-star-primary"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          情绪加油站
        </motion.h1>

        {/* 主要内容区 */}
        <div className="space-y-6">
          {/* 心情安慰卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CosmicCard className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMessage.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-bold text-cosmos-gold">
                    {currentMessage.title}
                  </h2>
                  <p className="text-star-secondary">
                    {currentMessage.message}
                  </p>
                  <p className="text-sm text-cosmos-blue">
                    💡 小建议：{currentMessage.tip}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-4 flex justify-end">
                <CosmicButton onClick={changeMessage}>
                  换一条
                </CosmicButton>
              </div>
            </CosmicCard>
          </motion.div>

          {/* 呼吸引导区 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CosmicCard className="p-6">
              <h2 className="mb-4 text-lg font-medium text-star-primary">
                深呼吸练习
              </h2>
              
              {isBreathing ? (
                <motion.div
                  className="flex h-40 items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="text-center text-xl text-cosmos-gold"
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ 
                      scale: breathingStep === 1 ? 1.2 : 1,
                      opacity: 1,
                      transition: { 
                        duration: BREATHING_GUIDE[breathingStep].duration,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    {BREATHING_GUIDE[breathingStep].text}
                  </motion.div>
                </motion.div>
              ) : (
                <div className="flex justify-center">
                  <CosmicButton onClick={startBreathing}>
                    开始引导
                  </CosmicButton>
                </div>
              )}
            </CosmicCard>
          </motion.div>

          {/* 音乐放松区 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <CosmicCard className="p-6">
              <h2 className="mb-4 text-lg font-medium text-star-primary">
                放松音乐
              </h2>
              <p className="mb-4 text-sm text-star-secondary">
                闭上眼睛，让音乐带你进入平静的宇宙
              </p>
              <AudioPlayer
                src="/meditation.mp3"
                duration={180}
              />
            </CosmicCard>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

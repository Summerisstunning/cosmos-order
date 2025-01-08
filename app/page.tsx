'use client'

import { CosmicButton } from '@/components/cosmos/cosmic-button'
import { StarBackground } from '@/components/cosmos/star-background'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const TypewriterText = () => {
  const [fixedText, setFixedText] = useState('')
  const [dynamicText, setDynamicText] = useState('')
  const firstPart = "只需每天三分钟，"
  const secondPart = "改变从此开始"
  
  useEffect(() => {
    // 第一次完整显示
    let index = 0
    const firstTimer = setInterval(() => {
      if (index < firstPart.length + secondPart.length) {
        const currentText = (firstPart + secondPart).substring(0, index + 1)
        if (index < firstPart.length) {
          setFixedText(currentText)
        } else {
          setFixedText(firstPart)
          setDynamicText(secondPart.substring(0, index - firstPart.length + 1))
        }
        index++
      } else {
        clearInterval(firstTimer)
        // 开始循环动画
        startLoop()
      }
    }, 200)

    return () => clearInterval(firstTimer)
  }, [])

  const startLoop = () => {
    let index = 0
    let direction = -1 // 开始时先删除
    
    const loopTimer = setInterval(() => {
      if (direction === 1) {
        if (index < secondPart.length) {
          setDynamicText(secondPart.substring(0, index + 1))
          index++
        } else {
          setTimeout(() => {
            direction = -1
            index = secondPart.length - 1
          }, 2000)
        }
      } else {
        if (index >= 0) {
          setDynamicText(secondPart.substring(0, index))
          index--
        } else {
          setTimeout(() => {
            direction = 1
            index = 0
          }, 500)
        }
      }
    }, 200)

    return () => clearInterval(loopTimer)
  }

  return (
    <span>
      <span>{fixedText}</span>
      <span>{dynamicText}</span>
    </span>
  )
}

export default function Home() {
  const router = useRouter()

  return (
    <main className="relative min-h-screen">
      {/* 背景图 */}
      <Image
        src="/背景图1.png"
        alt="宇宙背景"
        fill
        priority
        className="object-cover"
        sizes="100vw"
        quality={100}
      />

      {/* 星星效果 */}
      <StarBackground />

      {/* 页面内容 */}
      <div className="relative flex min-h-screen flex-col items-center">
        {/* 主要内容 */}
        <motion.div
          className="mt-[20vh] flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center">
            <motion.h1 
              className="mb-3 text-[32px] font-medium text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              宇宙订单
            </motion.h1>
            <motion.div 
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-base text-white/80">
                <TypewriterText />
              </p>
              {/* 响应式分隔线 */}
              <div className="relative mx-auto mt-4 h-[1px] w-[50vw]">
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 20%, rgba(255,255,255,0.3) 80%, transparent 100%)',
                    height: '1px'
                  }}
                />
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={() => {
                // 使用原生方式预加载图片
                const preloadImage = new window.Image()
                preloadImage.src = '/背景图2.png'
                preloadImage.onload = () => {
                  router.push('/setup')
                }
              }}
              className="group relative h-12 min-w-[240px] overflow-hidden rounded-lg bg-transparent text-base font-light text-white transition-all hover:scale-105"
              style={{
                backgroundImage: 'url("/选择完提示窗背景.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
              <span className="relative z-10">向宇宙发送订单</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}

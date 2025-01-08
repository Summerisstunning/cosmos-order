'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import { StarBackground } from '@/components/cosmos/star-background'
import { getUserGoal, setUserGoal } from '@/lib/utils/storage'

export default function PeriodPage() {
  const router = useRouter()
  const [number, setNumber] = useState('1')
  const [unit, setUnit] = useState('周')

  const handleNext = () => {
    const userGoal = getUserGoal()
    if (!userGoal) {
      router.push('/setup')
      return
    }

    // 更新目标的周期和开始日期
    setUserGoal({
      ...userGoal,
      period: `${number}${unit}`,
      startDate: new Date().toISOString()
    })

    // 跳转到生成每日行动页面
    router.push('/setup/generate-action')
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 背景图 */}
      <Image
        src="/背景图2.png"
        alt="宇宙背景"
        fill
        priority
        className="object-cover object-top"
        sizes="100vw"
        quality={100}
      />

      {/* 星星效果 */}
      <StarBackground />

      {/* 页面内容 */}
      <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
        {/* 返回按钮 */}
        <motion.button
          className="absolute left-4 top-4 flex items-center space-x-2 text-white/80 hover:text-white"
          onClick={() => router.back()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Image src="/back.png" alt="返回" width={24} height={24} />
        </motion.button>

        <div className="w-full max-w-xl">
          {/* 主要内容容器 */}
          <div 
            className="relative mx-auto w-full rounded-3xl p-8"
            style={{
              backgroundImage: 'url("/引导窗背景.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '0 0 30px rgba(255, 215, 0, 0.1)',
            }}
          >
            <div className="space-y-6">
              {/* 标题和装饰线 */}
              <div className="relative flex items-center justify-center">
                <div className="absolute left-0 h-[1px] w-[30%]" style={{
                  background: 'linear-gradient(90deg, transparent, #FFD700)'
                }} />
                <h1 className="px-8 text-center text-2xl font-medium text-white">
                  设定实现目标的周期
                </h1>
                <div className="absolute right-0 h-[1px] w-[30%]" style={{
                  background: 'linear-gradient(90deg, #FFD700, transparent)'
                }} />
              </div>

              <p className="text-center text-sm text-white/60">
                选择合适的时间，让目标循序渐进
              </p>
              
              <div className="flex justify-center space-x-4">
                {/* 数字选择 */}
                <select
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="h-12 w-24 rounded-lg bg-white px-4 text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>

                {/* 单位选择 */}
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="h-12 w-24 rounded-lg bg-white px-4 text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option value="天">天</option>
                  <option value="周">周</option>
                  <option value="月">月</option>
                  <option value="年">年</option>
                </select>
              </div>

              {/* 下一步按钮 */}
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white/20"
                >
                  <Image 
                    src="/next.png" 
                    alt="下一步" 
                    width={24} 
                    height={24}
                    className="transition-transform group-hover:translate-x-1" 
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

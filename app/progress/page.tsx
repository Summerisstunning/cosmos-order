'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { StarBackground } from '@/components/cosmos/star-background'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getUserGoal, getStreakCount, getTotalDays } from '@/lib/utils/storage'

export default function ProgressPage() {
  const router = useRouter()
  const [streakDays, setStreakDays] = useState(0)
  const [totalDays, setTotalDays] = useState(0)
  const [userGoal, setUserGoal] = useState<any>(null)

  useEffect(() => {
    const goal = getUserGoal()
    if (!goal) {
      router.push('/setup')
      return
    }
    setUserGoal(goal)

    // 获取连续打卡天数和总天数
    setStreakDays(getStreakCount())
    setTotalDays(getTotalDays())
  }, [router])

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 背景图 */}
      <Image
        src="/背景图2.png"
        alt="宇宙背景"
        fill
        priority
        className="object-cover"
        sizes="100vw"
        quality={100}
      />
      
      <StarBackground />

      {/* 顶部栏 */}
      <div className="relative z-10">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={() => router.back()}
          >
            返回
          </Button>
          <div className="text-xl font-bold text-white">
            进度概览
          </div>
          <div className="w-[64px]" />
        </div>
      </div>

      {/* 主要内容 */}
      <div className="container relative z-10 mx-auto mt-8 px-4">
        {/* 目标显示 */}
        <Card className="mb-6 bg-black/30 p-6 backdrop-blur-lg">
          <h1 className="text-center text-2xl font-bold text-white">
            {userGoal?.goal}
          </h1>
        </Card>

        {/* 统计数据 */}
        <Card className="mb-6 bg-black/30 p-6 backdrop-blur-lg">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {streakDays}
              </div>
              <div className="mt-2 text-sm text-white/80">
                连续打卡天数
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {totalDays}
              </div>
              <div className="mt-2 text-sm text-white/80">
                累计打卡天数
              </div>
            </div>
          </div>
        </Card>

        {/* 激励文案 */}
        <Card className="bg-black/30 p-6 backdrop-blur-lg">
          <p className="text-center text-lg text-white">
            你已经和宇宙链接 {totalDays} 天
            {streakDays >= 7 && (
              <span className="mt-2 block text-sm">
                🌟 恭喜你获得了 {Math.floor(streakDays / 7)} 周连续打卡的成就！
              </span>
            )}
          </p>
        </Card>
      </div>
    </main>
  )
}

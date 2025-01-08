'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { StarBackground } from '@/components/cosmos/star-background'
import { getUserGoal, setUserGoal } from '@/lib/utils/storage'

export default function GenerateActionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dailyAction, setDailyAction] = useState<{
    baseMinutes: number
    activity: string
    extraAdvice?: string
  } | null>(null)

  useEffect(() => {
    const generateDailyAction = async () => {
      const userGoal = getUserGoal()
      if (!userGoal?.goal || !userGoal?.period) {
        router.replace('/setup')
        return
      }

      try {
        const response = await fetch('/api/daily-action', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            goal: userGoal.goal,
            period: userGoal.period
          })
        })

        if (!response.ok) {
          const errorData = await response.text()
          console.error('API Error:', response.status, errorData)
          throw new Error('生成每日行动计划失败')
        }

        const result = await response.json()
        
        if (result.error) {
          throw new Error(result.error)
        }

        setDailyAction(result)
        
        // 更新目标信息
        setUserGoal({
          ...userGoal,
          dailyAction: result
        })

        setLoading(false)
      } catch (error) {
        console.error('Error:', error)
        setError(error instanceof Error ? error.message : '生成每日行动计划失败，请重试')
        setLoading(false)
      }
    }

    generateDailyAction()
  }, [router])

  const handleNext = () => {
    router.replace('/success')
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* 背景图 */}
      <Image
        src="/背景图3.png"
        alt="宇宙背景"
        fill
        priority
        className="object-cover"
        sizes="100vw"
        quality={100}
      />
      
      <StarBackground />

      <div className="container relative z-10 mx-auto flex min-h-screen flex-col items-center justify-center px-4">
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
                  生成每日行动
                </h1>
                <div className="absolute right-0 h-[1px] w-[30%]" style={{
                  background: 'linear-gradient(90deg, #FFD700, transparent)'
                }} />
              </div>

              <div className="flex flex-col items-center justify-center space-y-4">
                {loading ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-white" />
                    <p className="text-white/80">正在生成每日行动计划...</p>
                  </div>
                ) : error ? (
                  <div className="text-center">
                    <p className="text-red-400">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-4 rounded-lg bg-white/10 px-6 py-2 text-white hover:bg-white/20"
                    >
                      重试
                    </button>
                  </div>
                ) : dailyAction ? (
                  <div className="text-center space-y-6">
                    <div className="space-y-4">
                      <p className="text-xl font-medium text-white">
                        每天{dailyAction.activity} {dailyAction.baseMinutes}分钟
                      </p>
                      {dailyAction.extraAdvice && (
                        <p className="text-white/80">
                          {dailyAction.extraAdvice}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleNext}
                      className="rounded-lg bg-white/10 px-8 py-3 text-white transition-all hover:bg-white/20"
                    >
                      确认
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

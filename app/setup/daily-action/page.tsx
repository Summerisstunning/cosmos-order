'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { StarBackground } from '@/components/cosmos/star-background'
import { StarLoading } from '@/components/cosmos/star-loading'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { getUserGoal, setUserGoal } from '@/lib/utils/storage'

export default function DailyActionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dailyAction, setDailyAction] = useState<any>(null)
  const [useIncrement, setUseIncrement] = useState(false)

  useEffect(() => {
    const generateAction = async () => {
      setLoading(true)
      setError(null)
      try {
        const goal = getUserGoal()
        if (!goal) {
          router.push('/setup')
          return
        }

        const response = await fetch('/api/daily-action', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            goal: goal.goal,
            period: goal.period
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || '生成行动建议失败')
        }

        const data = await response.json()
        setDailyAction(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '生成行动建议失败')
      } finally {
        setLoading(false)
      }
    }

    generateAction()
  }, [router])

  const handleSubmit = () => {
    const goal = getUserGoal()
    if (!goal || !dailyAction) return

    goal.dailyAction = {
      ...dailyAction,
      useIncrement,
    }

    setUserGoal(goal)
    router.push('/success')
  }

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden">
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
        <div className="container relative z-10 mx-auto flex min-h-screen flex-col items-center justify-center px-4">
          <div className="relative w-full max-w-lg">
            <div className="absolute inset-0 rounded-lg border-2 border-[#D4B86A]" />
            <div className="absolute inset-[1px] rounded-lg border border-black bg-black/30 backdrop-blur-lg" />
            <div className="relative p-8">
              <div className="h-40">
                <StarLoading text="正在生成你的每日计划" />
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !dailyAction) {
    return (
      <main className="relative min-h-screen overflow-hidden">
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
        <div className="container relative z-10 mx-auto flex min-h-screen flex-col items-center justify-center px-4">
          <div className="relative w-full max-w-lg">
            <div className="absolute inset-0 rounded-lg border-2 border-[#D4B86A]" />
            <div className="absolute inset-[1px] rounded-lg border border-black bg-black/30 backdrop-blur-lg" />
            <div className="relative p-8">
              <div className="space-y-4">
                <div className="text-center text-red-500">
                  {error || '生成行动建议失败，请重试'}
                </div>
                <Button
                  className="w-full bg-[#D4B86A] hover:bg-[#D4B86A]/80"
                  onClick={() => window.location.reload()}
                >
                  重新生成
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
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

      <div className="container relative z-10 mx-auto flex min-h-screen flex-col items-center justify-center px-4">
        <div className="relative w-full max-w-lg">
          <div className="absolute inset-0 rounded-lg border-2 border-[#D4B86A]" />
          <div className="absolute inset-[1px] rounded-lg border border-black bg-black/30 backdrop-blur-lg" />
          
          <div className="relative p-8">
            <div className="flex flex-col items-center space-y-8">
              <div className="w-full text-center">
                <div className="relative py-4">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4B86A] to-transparent" />
                  <h2 className="text-xl font-medium text-[#D4B86A]">
                    每日行动建议
                  </h2>
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4B86A] to-transparent" />
                </div>
              </div>

              <div className="w-full">
                <div className="rounded-lg border border-black bg-black p-6">
                  <p className="text-center text-lg text-white">
                    每天{dailyAction.activity} {dailyAction.baseMinutes}分钟
                  </p>
                  {dailyAction.extraAdvice && (
                    <p className="mt-4 text-center text-sm text-white/80">
                      {dailyAction.extraAdvice}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full">
                <div className="space-y-4">
                  <h2 className="text-xl font-medium text-[#D4B86A]">
                    每日行动建议
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={useIncrement}
                      onCheckedChange={setUseIncrement}
                    />
                    <span className="text-white">每周递增行动时长</span>
                  </div>
                  {useIncrement && (
                    <p className="text-sm text-white/60">
                      每周行动时长将自动增加5%
                    </p>
                  )}
                </div>
              </div>

              <Button
                className="w-full bg-[#D4B86A] hover:bg-[#D4B86A]/80"
                onClick={handleSubmit}
              >
                提交订单
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

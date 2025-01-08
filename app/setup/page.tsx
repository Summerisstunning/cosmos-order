'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { StarBackground } from '@/components/cosmos/star-background'

export default function SetupPage() {
  const router = useRouter()
  const [goal, setGoal] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNext = async () => {
    if (!goal.trim() || loading) return
    setLoading(true)
    router.push(`/setup/period?goal=${encodeURIComponent(goal)}`)
  }

  return (
    <main className="relative min-h-screen">
      {/* 背景图 */}
      <Image
        src="/背景图1.png"
        alt="背景"
        fill
        priority
        className="object-cover"
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
                  请写下你的目标
                </h1>
                <div className="absolute right-0 h-[1px] w-[30%]" style={{
                  background: 'linear-gradient(90deg, #FFD700, transparent)'
                }} />
              </div>

              <p className="text-center text-sm text-white/60">
                写下的目标尽可能的具体可衡量
              </p>

              <div className="flex justify-center">
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="我想..."
                  className="h-24 w-[80%] resize-none rounded-lg bg-white p-4 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              {/* 下一步按钮 */}
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!goal.trim() || loading}
                  className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white/20 disabled:opacity-50"
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

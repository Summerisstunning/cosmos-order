'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { StarBackground } from '@/components/cosmos/star-background'
import { getUserGoal } from '@/lib/utils/storage'

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [videoEnded, setVideoEnded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // 检查是否有保存的目标
    const goal = getUserGoal()
    if (!goal?.goal || !goal?.period) {
      // 如果没有目标信息，重定向回首页
      router.replace('/')
      return
    }

    const video = videoRef.current
    if (!video) return

    const handleVideoEnd = () => {
      setVideoEnded(true)
      // 视频结束后 2 秒跳转到 dashboard
      setTimeout(() => {
        router.replace('/dashboard')
      }, 2000)
    }

    video.addEventListener('ended', handleVideoEnd)

    // 确保视频自动播放
    video.play().catch(error => {
      console.error('Error playing video:', error)
      // 如果视频播放失败，直接显示结果并准备跳转
      setVideoEnded(true)
      setTimeout(() => {
        router.replace('/dashboard')
      }, 2000)
    })

    return () => {
      video.removeEventListener('ended', handleVideoEnd)
    }
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

      {/* 视频层 */}
      <div className="relative z-10 h-full w-full">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          muted
          autoPlay
        >
          <source src="/动画1.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 成功消息 */}
      {videoEnded && (
        <div className="absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center">
          <div 
            className="relative w-full max-w-md"
            style={{
              backgroundImage: 'url("/动画结束提示窗背景.png")',
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              padding: '2rem'
            }}
          >
            <div className="text-center">
              <p className="text-xl font-medium text-white">
                恭喜，你的订单已被宇宙接收！
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

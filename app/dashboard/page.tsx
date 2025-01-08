'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { TopNav } from '@/components/nav/top-nav'
import { getUserGoal, setUserGoal } from '@/lib/utils/storage'
import { StarBackground } from '@/components/cosmos/star-background'

// 进度选项
const PROGRESS_VALUES = [0, 20, 40, 60, 80, 100]

export default function DashboardPage() {
  const [goal, setGoal] = useState('')
  const [daysLeft, setDaysLeft] = useState(0)
  const [selectedTime, setSelectedTime] = useState<'morning' | 'evening' | null>(null)
  const [showVideo, setShowVideo] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dailyAction, setDailyAction] = useState<{
    baseMinutes: number
    activity: string
    extraAdvice?: string
  } | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // 进度选择状态
  const [selectedProgress, setSelectedProgress] = useState<number | null>(null)
  const [hoverProgress, setHoverProgress] = useState<number | null>(null)

  useEffect(() => {
    // 设置视频循环播放30秒
    let videoTimer: NodeJS.Timeout | null = null;
    if (videoRef.current && showVideo) {
      videoTimer = setTimeout(() => {
        setVideoEnded(true);
        setShowVideo(false);
      }, 30000); // 30秒后结束
    }
    return () => {
      if (videoTimer) {
        clearTimeout(videoTimer);
      }
    };
  }, [showVideo]);

  useEffect(() => {
    const userGoal = getUserGoal()
    if (userGoal) {
      setGoal(userGoal.goal)
      setDailyAction(userGoal.dailyAction || null)
      setProgress(userGoal.progress || 0)

      // 计算剩余天数
      let totalDays = 0
      switch (userGoal.period) {
        case 'week':
          totalDays = 7
          break
        case 'month':
          totalDays = 30
          break
        case 'year':
          totalDays = 365
          break
        default:
          totalDays = 7
      }

      const startDate = new Date(userGoal.startDate)
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + totalDays)
      const today = new Date()
      const diffTime = endDate.getTime() - today.getTime()
      const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
      setDaysLeft(diffDays)
    }
  }, [])

  const handleTimeSelect = (time: 'morning' | 'evening') => {
    setSelectedTime(time)
    if (time === 'morning') {
      setShowVideo(true)
      setVideoEnded(false)
    } else {
      setShowVideo(false)
      setVideoEnded(false)
    }
  }

  // 获取进度图标状态
  const getProgressIconPath = (value: number) => {
    if (selectedProgress !== null && value <= selectedProgress) {
      return `/${value}_选中.png`
    }
    if (hoverProgress !== null && value <= hoverProgress) {
      return `/${value}_预选中.png`
    }
    return `/${value}_未被选中.png`
  }

  // 保存进度
  const handleSaveProgress = () => {
    if (selectedProgress !== null) {
      const userGoal = getUserGoal()
      if (userGoal) {
        setUserGoal({
          ...userGoal,
          progress: selectedProgress
        })
        setProgress(selectedProgress)
      }
    }
  }

  return (
    <main className="cosmos-bg relative min-h-screen overflow-hidden">
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
      <TopNav 
        isHomeActive={false} 
        onTimeSelect={handleTimeSelect}
        selectedTime={selectedTime}
      />

      <div className="container relative z-10 mx-auto flex min-h-screen flex-col items-center px-4 pt-20">
        {/* 目标显示 */}
        <div className="flex flex-col items-center space-y-4">
          <h1 className="goal-text text-4xl font-bold text-white">{goal}</h1>
          <div className="relative">
            <Image
              src="/白色渐变分割线.png"
              alt="分割线"
              width={300}
              height={2}
              className="my-4"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-medium text-white">剩余</span>
            <span className="text-4xl font-medium text-white">
              {daysLeft.toString()}
            </span>
            <span className="text-2xl font-medium text-white">天</span>
          </div>

          {/* 进度条 */}
          <div className="mt-8 w-full max-w-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg text-white/80">进度</span>
              <span className="text-lg text-white">{progress}%</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-white/10">
              <div 
                className="absolute left-0 top-0 h-full rounded-full"
                style={{ 
                  width: `${progress}%`,
                  backgroundImage: 'url("/金色渐变线.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'left center'
                }}
              />
            </div>
          </div>
        </div>

        {selectedTime === 'morning' ? (
          videoEnded ? (
            <div className="text-center mt-12">
              <h2 className="text-2xl font-medium text-white">链接完成！</h2>
              <p className="mt-2 text-lg text-white/80">
                你已获得一份来自宇宙的能量，去开启新的一天奇迹吧！
              </p>
            </div>
          ) : (
            <div className="text-center mt-12">
              {showVideo && (
                <div className="relative flex flex-col items-center">
                  <div className="relative overflow-hidden rounded-lg bg-black/30 p-4 backdrop-blur-lg">
                    <video
                      ref={videoRef}
                      src="/链接动态视频.mp4"
                      className="w-full max-w-sm cursor-pointer rounded-lg"
                      loop
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.play();
                        }
                      }}
                    />
                  </div>
                  <p className="mt-6 text-xl font-medium text-white">
                    点击上方与宇宙链接1分钟
                  </p>
                  <p className="mt-4 max-w-lg text-center text-sm text-white/80">
                    闭上眼睛想象你已经完成了你的心愿，那么你将会拥有怎么样的人生呢，
                    而这只需要从今天的一小步行动
                    {dailyAction ? `"${dailyAction.activity} ${dailyAction.baseMinutes}分钟"` : ''}
                    开始。
                  </p>
                </div>
              )}
            </div>
          )
        ) : selectedTime === 'evening' ? (
          <div className="mt-12">
            {/* 进度选择 */}
            <div className="w-full max-w-5xl mx-auto">
              <p className="mb-12 text-center text-xl text-white/80">
                请选择今日完成度
              </p>
              
              <div className="grid grid-cols-3 gap-12 px-8">
                {PROGRESS_VALUES.map((value) => (
                  <button
                    key={value}
                    onClick={() => setSelectedProgress(value)}
                    onMouseEnter={() => setHoverProgress(value)}
                    onMouseLeave={() => setHoverProgress(null)}
                    className="group relative aspect-square w-full overflow-hidden rounded-lg transition-transform hover:scale-105"
                    style={{ minHeight: '200px' }}
                  >
                    <Image
                      src={getProgressIconPath(value)}
                      alt={`完成度 ${value}%`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 200px, 300px"
                    />
                  </button>
                ))}
              </div>

              {/* 确认按钮 */}
              {selectedProgress !== null && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={handleSaveProgress}
                    className="rounded-lg bg-white px-12 py-4 text-xl text-black transition-all hover:bg-white/90"
                  >
                    确认完成度
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}

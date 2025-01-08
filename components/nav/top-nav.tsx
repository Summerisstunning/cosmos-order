'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

interface TopNavProps {
  isHomeActive?: boolean
  onTimeSelect?: (time: 'morning' | 'evening') => void
  selectedTime?: 'morning' | 'evening' | null
}

export function TopNav({ 
  isHomeActive = false, 
  onTimeSelect,
  selectedTime = null 
}: TopNavProps) {
  const router = useRouter()
  const pathname = usePathname()

  // 导航项配置
  const navItems = [
    {
      name: '早上',
      path: '/morning',
      show: pathname === '/morning',
    },
    {
      name: '晚上',
      path: '/evening',
      show: pathname === '/evening',
    },
  ]

  // 图标配置
  const icons = [
    {
      name: '喜欢',
      path: '/progress',
      normalIcon: '/love.png',
      selectedIcon: '/love_select.png',
      previewIcon: '/love_preview.png',
    },
    {
      name: '日历',
      path: '/calendar',
      normalIcon: '/calendar.png',
      selectedIcon: '/calendar_select.png',
      previewIcon: '/calendar_preview.png',
    },
    {
      name: '主页',
      path: '/dashboard',
      normalIcon: '/home.png',
      selectedIcon: '/home_select.png',
      previewIcon: '/home_preview.png',
    },
  ]

  // 获取图标状态
  const getIconStatus = (iconPath: string) => {
    if (pathname === iconPath) return 'preview'
    return 'normal'
  }

  // 获取图标源
  const getIconSrc = (icon: typeof icons[0]) => {
    const status = getIconStatus(icon.path)
    if (status === 'preview') return icon.previewIcon
    return icon.normalIcon
  }

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between p-4">
      <Link href="/" className="text-2xl font-bold text-white">
        宇宙订单
      </Link>

      {/* 早晚切换按钮 */}
      <div className="absolute left-1/2 top-4 z-20 flex -translate-x-1/2 space-x-4">
        <button
          onClick={() => onTimeSelect?.('morning')}
          className={`rounded-lg px-6 py-2 ${
            selectedTime === 'morning' ? 'bg-white text-black' : 'bg-black/20 text-white'
          }`}
        >
          早上
        </button>
        <button
          onClick={() => onTimeSelect?.('evening')}
          className={`rounded-lg px-6 py-2 ${
            selectedTime === 'evening' ? 'bg-white text-black' : 'bg-black/20 text-white'
          }`}
        >
          晚上
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {icons.map((icon) => (
          <Link key={icon.name} href={icon.path}>
            <div className="group relative">
              {icon.name === '主页' ? (
                <div
                  className={`rounded-lg ${
                    isHomeActive ? 'bg-white' : 'bg-black/20'
                  } p-2`}
                >
                  <Image 
                    src={isHomeActive ? '/home_preview.png' : '/home.png'}
                    alt="主页"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                </div>
              ) : (
                <Image
                  src={getIconSrc(icon)}
                  alt={icon.name}
                  width={24}
                  height={24}
                  className="nav-icon"
                />
              )}
            </div>
          </Link>
        ))}
      </div>
    </nav>
  )
}

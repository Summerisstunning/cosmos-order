'use client'

import { CosmicButton } from './cosmic-button'
import { CosmicCard } from './cosmic-card'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

interface ShareCardProps {
  title: string
  description: string
  data: {
    label: string
    value: string | number
  }[]
  onClose: () => void
}

const ShareCardClient = ({
  title,
  description,
  data,
  onClose,
}: ShareCardProps) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleShare = async () => {
    setIsGenerating(true)
    try {
      const card = document.getElementById('share-card')
      if (!card) return

      // 动态导入 html2canvas
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(card, {
        backgroundColor: '#1E1E2F',
        scale: 2,
      })

      // 转换为图片
      const image = canvas.toDataURL('image/png')
      
      // 创建下载链接
      const link = document.createElement('a')
      link.download = '我的宇宙订单.png'
      link.href = image
      link.click()

      // 如果平台支持，也可以使用原生分享
      if (navigator.share) {
        const blob = await (await fetch(image)).blob()
        const file = new File([blob], '我的宇宙订单.png', { type: 'image/png' })
        
        await navigator.share({
          title: '我的宇宙订单',
          text: '看看我在宇宙订单的进展！',
          files: [file],
        })
      }
    } catch (error) {
      console.error('分享失败:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!mounted) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cosmos-dark/80 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <CosmicCard className="relative overflow-hidden p-6" id="share-card">
          {/* 背景装饰 */}
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-cosmos-gold/20 to-cosmos-blue/20 blur-xl" />
          
          {/* 内容 */}
          <div className="relative">
            <h2 className="mb-2 text-2xl font-bold text-star-primary">
              {title}
            </h2>
            <p className="mb-6 text-star-secondary">{description}</p>

            {/* 数据展示 */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-cosmos-dark/50 p-3"
                >
                  <div className="text-sm text-star-secondary">
                    {item.label}
                  </div>
                  <div className="text-lg font-bold text-cosmos-gold">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Logo和水印 */}
            <div className="text-center text-sm text-star-secondary/60">
              - 宇宙订单 -
            </div>
          </div>
        </CosmicCard>

        {/* 操作按钮 */}
        <div className="mt-4 flex justify-end gap-4">
          <CosmicButton variant="outline" onClick={onClose}>
            关闭
          </CosmicButton>
          <CosmicButton onClick={handleShare} disabled={isGenerating}>
            {isGenerating ? '生成中...' : '分享图片'}
          </CosmicButton>
        </div>
      </motion.div>
    </motion.div>
  )
}

// 导出使用 dynamic 包装的组件
export const ShareCard = dynamic(() => Promise.resolve(ShareCardClient), {
  ssr: false,
})

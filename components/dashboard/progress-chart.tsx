'use client'

import { DailyRecord } from '@/lib/utils/storage'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface ProgressChartProps {
  records: DailyRecord[]
  days?: number // 显示最近几天的数据
}

export const ProgressChart = ({ records, days = 7 }: ProgressChartProps) => {
  // 获取最近 N 天的数据
  const recentRecords = records.slice(-days)

  // 处理数据
  const labels = recentRecords.map((record) => {
    const date = new Date(record.date)
    return `${date.getMonth() + 1}/${date.getDate()}`
  })

  const data = {
    labels,
    datasets: [
      {
        label: '完成度',
        data: recentRecords.map((record) => record.completion),
        borderColor: '#F5C32C',
        backgroundColor: 'rgba(245, 195, 44, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#F5C32C',
        pointBorderColor: '#F5C32C',
        pointHoverBackgroundColor: '#4FAAF8',
        pointHoverBorderColor: '#4FAAF8',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(30, 30, 47, 0.8)',
        titleColor: '#FFFFFF',
        bodyColor: '#CCCCCC',
        borderColor: 'rgba(245, 195, 44, 0.1)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            return `完成度: ${context.parsed.y}%`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#CCCCCC',
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(204, 204, 204, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#CCCCCC',
          callback: function (value: number) {
            return value + '%'
          },
        },
      },
    },
  }

  return (
    <div className="h-[300px] w-full">
      <Line data={data} options={options as any} />
    </div>
  )
}

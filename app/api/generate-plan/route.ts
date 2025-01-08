import { NextResponse } from 'next/server'

// 定义更灵活的运动建议
const exerciseOptions = [
  {
    type: '有氧运动',
    suggestions: ['快走', '慢跑', '游泳', '骑行', '跳绳'],
    defaultDuration: 20,
  },
  {
    type: '力量训练',
    suggestions: ['俯卧撑', '仰卧起坐', '深蹲', '平板支撑'],
    defaultDuration: 15,
  },
  {
    type: '柔韧性训练',
    suggestions: ['瑜伽', '拉伸', '太极'],
    defaultDuration: 15,
  },
]

// 根据目标生成合适的计划
function generateAIPlan(goal: string, duration: { value: number; unit: string }) {
  // 将不同单位转换为天数
  let totalDays: number
  switch (duration.unit) {
    case '天':
      totalDays = duration.value
      break
    case '周':
      totalDays = duration.value * 7
      break
    case '月':
      totalDays = duration.value * 30
      break
    default:
      totalDays = duration.value * 7 // 默认按周计算
  }

  // 选择运动类型（这里可以根据目标关键词来选择更合适的运动）
  const exerciseType = exerciseOptions[Math.floor(Math.random() * exerciseOptions.length)]
  
  // 生成基础运动建议
  const baseActivity = exerciseType.type
  const specificSuggestions = exerciseType.suggestions.join('、')
  
  return {
    plan: {
      durationDays: totalDays,
      dailyAction: {
        baseMinutes: exerciseType.defaultDuration,
        activity: baseActivity,
        extraAdvice: `建议尝试：${specificSuggestions}，根据个人情况选择合适的运动方式。记得适量补充水分，注意合理饮食。`,
      },
      incrementRate: 0.05,
    },
  }
}

export async function POST(request: Request) {
  try {
    const { goal, duration } = await request.json()
    
    // 生成计划
    const plan = generateAIPlan(goal, duration)
    
    return NextResponse.json(plan)
  } catch (error) {
    console.error('生成计划失败:', error)
    return NextResponse.json(
      { error: '生成计划失败，请重试' },
      { status: 500 }
    )
  }
}

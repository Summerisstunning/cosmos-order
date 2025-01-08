import { NextResponse } from 'next/server'

// 类型定义
interface DailyActionResponse {
  baseMinutes: number
  activity: string
  extraAdvice?: string
}

export async function POST(request: Request) {
  try {
    // 验证环境变量
    const apiUrl = process.env.OPENAI_API_BASE_URL
    const apiKey = process.env.OPENAI_API_KEY
    const modelName = process.env.OPENAI_MODEL_NAME || 'deepseek-chat'

    if (!apiUrl || !apiKey) {
      console.error('Missing environment variables')
      return NextResponse.json(
        {
          baseMinutes: 10,
          activity: '散步',
          extraAdvice: '从简单开始，循序渐进'
        },
        { status: 200 }
      )
    }

    // 获取请求数据
    const { goal, period } = await request.json()

    if (!goal || !period) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 构建 prompt
    const prompt = `作为一个专业的目标规划顾问，请根据用户的具体目标制定一个简短的每日行动计划。用户目标是"${goal}"，计划在${period}内完成。

请以JSON格式返回一个与目标直接相关的具体行动建议（确保建议与目标高度相关），包含以下字段：
{
  "baseMinutes": 每日基础时间（分钟，建议在15-45分钟之间）,
  "activity": "具体的学习或练习方式（限制在8个字以内）",
  "extraAdvice": "与目标相关的额外建议（限制在12个字以内）"
}

注意：
1. 确保建议与用户目标强相关
2. 给出具体可执行的行动方案
3. 严格按照示例格式返回JSON数据
4. 不要返回任何其他文字，只返回JSON格式数据`

    // 调用 API
    const response = await fetch(apiUrl + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150,
        response_format: { type: "json_object" }
      })
    })

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText)
      return NextResponse.json(
        {
          baseMinutes: 10,
          activity: '散步',
          extraAdvice: '从简单开始，循序渐进'
        },
        { status: 200 }
      )
    }

    const data = await response.json()
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid API response:', data)
      return NextResponse.json(
        {
          baseMinutes: 10,
          activity: '散步',
          extraAdvice: '从简单开始，循序渐进'
        },
        { status: 200 }
      )
    }

    try {
      const content = data.choices[0].message.content
      const result: DailyActionResponse = JSON.parse(content)

      // 验证返回数据
      if (!result.baseMinutes || !result.activity) {
        throw new Error('返回数据格式不正确')
      }

      return NextResponse.json(result)
    } catch (error) {
      console.error('Parse error:', error)
      return NextResponse.json(
        {
          baseMinutes: 10,
          activity: '散步',
          extraAdvice: '从简单开始，循序渐进'
        },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      {
        baseMinutes: 10,
        activity: '散步',
        extraAdvice: '从简单开始，循序渐进'
      },
      { status: 200 }
    )
  }
}

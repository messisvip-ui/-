import { useEffect, useState } from 'react'

// 引导步骤定义
export interface GuideStep {
  id: string
  title: string
  description: string
  icon: string
  action?: () => void
  skipable: boolean
}

export const ONBOARDING_STEPS: GuideStep[] = [
  {
    id: 'welcome',
    title: '欢迎来到精灵森境！',
    description: '这里是一个充满魔法的森林，每个学生都是光之守护者，将与专属精灵一起成长。',
    icon: '🌟',
    skipable: false,
  },
  {
    id: 'sprite',
    title: '缔结你的精灵',
    description: '选择你的元素属性，与独一无二的光之精灵缔结契约。它将陪伴你度过整个成长旅程。',
    icon: '🦋',
    skipable: false,
  },
  {
    id: 'tasks',
    title: '完成星光委托',
    description: '每天完成老师发布的任务，获得星光奖励。星光可以用来装饰家园、解锁新区域。',
    icon: '📋',
    skipable: true,
  },
  {
    id: 'praise',
    title: '星光礼赞',
    description: '给同学送上真诚的赞美，每天可以发送 3 次。收到赞美会让精灵很开心哦！',
    icon: '💝',
    skipable: true,
  },
  {
    id: 'explore',
    title: '探索森林',
    description: '和班级一起积累星光，解锁更多神秘的森林区域。每个区域都有独特的景色和互动。',
    icon: '🗺️',
    skipable: true,
  },
  {
    id: 'complete',
    title: '准备好了吗？',
    description: '一切准备就绪！开始你的光之守护者之旅吧！',
    icon: '✨',
    skipable: false,
  },
]

export function useOnboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showGuide, setShowGuide] = useState(false)

  useEffect(() => {
    // 检查是否已完成引导
    const completed = localStorage.getItem('onboardingCompleted')
    if (completed === 'true') {
      setIsComplete(true)
    } else {
      setShowGuide(true)
    }
  }, [])

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      completeOnboarding()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const skipStep = () => {
    const step = ONBOARDING_STEPS[currentStep]
    if (step.skipable) {
      nextStep()
    }
  }

  const completeOnboarding = () => {
    setIsComplete(true)
    setShowGuide(false)
    localStorage.setItem('onboardingCompleted', 'true')
  }

  const resetOnboarding = () => {
    localStorage.removeItem('onboardingCompleted')
    setIsComplete(false)
    setCurrentStep(0)
    setShowGuide(true)
  }

  return {
    currentStep,
    isComplete,
    showGuide,
    nextStep,
    prevStep,
    skipStep,
    completeOnboarding,
    resetOnboarding,
    OnboardingModal: () => (
      <OnboardingModal
        step={ONBOARDING_STEPS[currentStep]}
        current={currentStep}
        total={ONBOARDING_STEPS.length}
        onNext={nextStep}
        onPrev={prevStep}
        onSkip={skipStep}
        onComplete={completeOnboarding}
      />
    ),
  }
}

function OnboardingModal({
  step,
  current,
  total,
  onNext,
  onPrev,
  onSkip,
  onComplete,
}: {
  step: GuideStep
  current: number
  total: number
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
  onComplete: () => void
}) {
  return (
    <div className="fixed inset-0 z-[500] bg-black/70 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* 进度条 */}
        <div className="mb-6">
          <div className="flex justify-between text-white/70 text-sm mb-2">
            <span>引导进度</span>
            <span>{current + 1} / {total}</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-starlight-400 to-forest-400 transition-all duration-500"
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        {/* 内容卡片 */}
        <div className="card text-center">
          <div className="text-8xl mb-6 animate-bounce">
            {step.icon}
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {step.title}
          </h2>

          <p className="text-lg text-gray-600 mb-8">
            {step.description}
          </p>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            {current > 0 ? (
              <button onClick={onPrev} className="btn-secondary flex-1">
                上一步
              </button>
            ) : (
              <div className="flex-1" />
            )}

            {step.skipable ? (
              <button onClick={onSkip} className="text-gray-400 hover:text-gray-600 px-4">
                跳过
              </button>
            ) : null}

            <button
              onClick={current === total - 1 ? onComplete : onNext}
              className="btn-primary flex-1"
            >
              {current === total - 1 ? '开始旅程' : '下一步'}
            </button>
          </div>
        </div>

        {/* 小提示 */}
        <p className="text-center text-white/50 text-sm mt-4">
          按 ESC 可以跳过引导（部分步骤不可跳过）
        </p>
      </div>
    </div>
  )
}

// 快捷键支持
export function useOnboardingShortcuts(handlers: {
  onNext: () => void
  onSkip: () => void
  onComplete: () => void
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handlers.onSkip()
      } else if (e.key === 'Enter' || e.key === ' ') {
        handlers.onNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
}

export default useOnboarding

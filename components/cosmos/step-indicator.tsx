'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export const StepIndicator = ({
  currentStep,
  totalSteps,
}: StepIndicatorProps) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <motion.div
          key={index}
          className={cn(
            'h-2 w-2 rounded-full',
            index < currentStep
              ? 'bg-cosmos-gold'
              : index === currentStep
              ? 'bg-cosmos-blue'
              : 'bg-star-secondary/30'
          )}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{
            scale: index === currentStep ? 1.2 : 1,
            opacity: index <= currentStep ? 1 : 0.5,
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface CosmicInputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string
  multiline?: boolean
}

export const CosmicInput = ({
  className,
  label,
  multiline = false,
  ...props
}: CosmicInputProps) => {
  const [isFocused, setIsFocused] = useState(false)

  const Component = multiline ? 'textarea' : 'input'

  return (
    <div className="relative w-full">
      {label && (
        <label className="mb-2 block text-sm text-star-secondary">{label}</label>
      )}
      <motion.div
        className={cn(
          'relative rounded-lg bg-cosmos-dark/50 backdrop-blur-sm',
          isFocused && 'ring-1 ring-cosmos-gold'
        )}
        animate={{
          boxShadow: isFocused
            ? '0 0 20px rgba(245, 195, 44, 0.2)'
            : '0 0 0px rgba(245, 195, 44, 0)',
        }}
      >
        <Component
          className={cn(
            'w-full rounded-lg border border-star-secondary/20 bg-transparent px-4 py-2 text-star-primary outline-none placeholder:text-star-secondary/50 focus:border-cosmos-gold',
            multiline && 'min-h-[100px] resize-none',
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...(props as any)}
        />
      </motion.div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverProps {
  threshold?: number
  root?: Element | null
  rootMargin?: string
}

// 元素可见性检测 hook
export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = '0px',
}: UseIntersectionObserverProps = {}) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
  const [node, setNode] = useState<Element | null>(null)
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect()
    }

    observer.current = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry)
      },
      {
        threshold,
        root,
        rootMargin,
      }
    )

    const { current: currentObserver } = observer

    if (node) {
      currentObserver.observe(node)
    }

    return () => {
      currentObserver.disconnect()
    }
  }, [node, threshold, root, rootMargin])

  return [setNode, entry] as const
}

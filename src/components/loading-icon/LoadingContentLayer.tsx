import { HtmlHTMLAttributes, useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

import LoadingIcon from '.'

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  label?: string
}

const LoadingContentLayer = ({ label, className }: Props) => {
  const loadingRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (loadingRef.current) {
      loadingRef.current.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      })
    }
  }, [])
  return (
    <div className={cn('z-10 fixed inset-0 flex justify-center items-center bg-primary/20', className)}>
      <div ref={loadingRef}>
        <LoadingIcon label={label} color="primaryBackground" />
      </div>
    </div>
  )
}

export default LoadingContentLayer

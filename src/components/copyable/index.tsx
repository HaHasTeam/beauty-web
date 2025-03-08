'use client'

import { Check, Copy } from 'lucide-react'
import { HtmlHTMLAttributes, useId, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type CopyableProps = HtmlHTMLAttributes<HTMLInputElement> & {
  content: string
  label?: string
}
export default function Copyable({ content, label, className }: CopyableProps) {
  const id = useId()
  const [copied, setCopied] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id}>{label ?? 'Copy to clipboard'}</Label>
      <div className="relative">
        <Input ref={inputRef} id={id} className="pe-9" type="text" defaultValue={content} readOnly />
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleCopy}
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg border border-transparent text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed"
                aria-label={copied ? 'Copied' : 'Copy to clipboard'}
                disabled={copied}
              >
                <div className={cn('transition-all', copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0')}>
                  <Check className="stroke-emerald-500" size={16} strokeWidth={2} aria-hidden="true" />
                </div>
                <div className={cn('absolute transition-all', copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100')}>
                  <Copy size={16} strokeWidth={2} aria-hidden="true" />
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs">Copy to clipboard</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

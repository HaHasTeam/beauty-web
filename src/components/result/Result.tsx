import './index.css'

import { Check, Frown } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { ResultEnum } from '@/types/enum'

import { Button } from '../ui/button'

interface ResultProps {
  status: ResultEnum.SUCCESS | ResultEnum.FAILURE
  title: string
  description: string
  leftButtonText: string
  rightButtonText: string
  leftButtonAction: () => void
  rightButtonAction: () => void
}
export default function Result({
  title,
  description,
  leftButtonAction,
  leftButtonText,
  rightButtonAction,
  rightButtonText,
  status,
}: ResultProps) {
  return (
    <div className="my-10 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl shadow-lg">
        <CardContent className="pt-12 pb-8 text-center relative overflow-hidden">
          {/* Animated dots */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className={`absolute w-3 h-3 ${status === ResultEnum.SUCCESS ? 'bg-emerald-400' : 'bg-red-400'} rounded-full animate-float`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  opacity: 0.3,
                }}
              />
            ))}
          </div>

          {/* Success icon */}
          <div className="relative mb-6">
            {status === ResultEnum.SUCCESS ? (
              <div className={`w-20 h-20 bg-emerald-500 rounded-full mx-auto flex items-center justify-center`}>
                <Check className="w-10 h-10 text-white" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center">
                <Frown className={`w-20 h-20 text-red-500`} />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-4 mb-8">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="text-gray-500">{description}</p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={leftButtonAction}>
              {leftButtonText}
            </Button>
            <Button
              className={`${status === ResultEnum.SUCCESS ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'}`}
              onClick={rightButtonAction}
            >
              {rightButtonText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

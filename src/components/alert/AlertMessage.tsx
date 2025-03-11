import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import Button from '../button'
import { Alert, AlertDescription } from '../ui/alert'

type AlertMessageProps = {
  message: string
  className?: string
  size?: 'small' | 'medium' | 'large'
  textSize?: 'small' | 'medium' | 'large'
  titleSize?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'secondary' | 'accent' | 'warn' | 'black' | 'danger'
  text?: 'primary' | 'secondary' | 'accent' | 'black' | 'danger'
  titleClassName?: string
  title?: string
  isShowIcon?: boolean
  onClick?: () => void
  buttonText?: string
  buttonClassName?: string
}
const AlertMessage = ({
  message,
  className,
  size = 'medium',
  color = 'warn',
  text = 'black',
  textSize = 'medium',
  titleClassName,
  title,
  titleSize = 'large',
  isShowIcon = true,
  buttonText,
  onClick,
  buttonClassName,
}: AlertMessageProps) => {
  const { t } = useTranslation()
  const sizeClasses = {
    small: 'w-2 h-2',
    medium: 'w-4',
    large: 'w-8 h-8',
  }

  const iconColorClasses = {
    danger: 'text-red-500',
    black: 'text-foreground',
    warn: 'text-yellow-500',
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
  }

  const textColorClasses = {
    danger: 'text-red-600',
    black: 'text-foreground',
    primary: 'text-primary-foreground',
    secondary: 'text-secondary-foreground',
    accent: 'text-accent-foreground',
  }
  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-base',
    large: 'text-lg',
  }
  return (
    <Alert variant="default" className={`bg-yellow-50 flex items-center border-yellow-300 ${className}`}>
      <AlertDescription className="border-0">
        {title && (
          <h3
            className={`${isShowIcon && 'ml-5'} font-bold ${iconColorClasses[color]} ${titleClassName} ${textSizeClasses[titleSize]}`}
          >
            {title}
          </h3>
        )}
        <div className="flex items-center gap-2">
          {isShowIcon && (
            <div>
              <Info className={`flex items-center ${sizeClasses[size]} ${iconColorClasses[color]}`} size={24} />
            </div>
          )}
          <span className={`${textColorClasses[text]} ${textSizeClasses[textSize]}`}>{message}</span>
          {buttonText && (
            <Button type="button" onClick={onClick} className={buttonClassName}>
              {t(`button.${buttonText}`)}
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}

export default AlertMessage

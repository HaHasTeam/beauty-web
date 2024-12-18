import { forwardRef } from 'react'

import LoadingIcon from '../loading-icon'
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '../ui/button'

type ButtonProps = ShadcnButtonProps & {
  loading?: boolean
}
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, className, loading, ...props }, ref) => {
  return (
    <ShadcnButton ref={ref} className={className} {...props} disabled={props.disabled || loading}>
      {loading ? <LoadingIcon /> : children}
    </ShadcnButton>
  )
})

Button.displayName = 'Button'
export default Button

import { Loader2 } from 'lucide-react'
import { forwardRef } from 'react'

import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '../ui/button'

type ButtonProps = ShadcnButtonProps & {
  loading?: boolean
}
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, className, ...props }, ref) => {
  return (
    <ShadcnButton ref={ref} className={className} {...props} disabled={props.disabled || props.loading}>
      {props.loading ? <Loader2 className="animate-spin" /> : children}
    </ShadcnButton>
  )
})

Button.displayName = 'Button'
export default Button

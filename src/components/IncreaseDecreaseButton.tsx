import { Minus, Plus } from 'lucide-react'

import { Button } from './ui/button'
import { Input } from './ui/input'

interface IncreaseDecreaseButtonProps {
  onIncrease: () => void
  onDecrease: () => void
  isIncreaseDisabled: boolean
  isDecreaseDisabled: boolean
  inputValue: string
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  size?: 'small' | 'medium' | 'large'
}

const IncreaseDecreaseButton = ({
  inputValue,
  handleInputChange,
  onIncrease,
  onDecrease,
  isIncreaseDisabled,
  isDecreaseDisabled,
  onBlur,
  onKeyDown,
  size = 'medium',
}: IncreaseDecreaseButtonProps) => {
  const buttonSize = {
    small: 'w-7 h-7',
    medium: 'h-10 w-10',
    large: 'w-12 h-12',
  }
  const inputSize = {
    small: 'w-10 h-7',
    medium: 'w-16 h-10',
    large: 'w-20 h-12',
  }
  return (
    <div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          disabled={isDecreaseDisabled}
          size="icon"
          onClick={onDecrease}
          className={`${buttonSize[size]} border-gray-400 ${isDecreaseDisabled ? 'border-gray-300 text-gray-400' : ''}`}
        >
          <Minus />
        </Button>
        <Input
          type="number"
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          value={inputValue}
          onChange={handleInputChange}
          min={1}
          className={`${inputSize[size]} w-14 focus:border-primary/20 text-center border-gray-400 rounded-md`}
        />
        <Button
          variant="outline"
          disabled={isIncreaseDisabled}
          size="icon"
          onClick={onIncrease}
          className={`${buttonSize[size]} border-gray-400 ${isIncreaseDisabled ? 'border-gray-300 text-gray-400' : ''}`}
        >
          <Plus />
        </Button>
      </div>
    </div>
  )
}

export default IncreaseDecreaseButton

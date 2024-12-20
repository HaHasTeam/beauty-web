import { Info } from 'lucide-react'

import { Alert, AlertDescription } from '../ui/alert'

type AlertMessageProps = {
  message: string
}
const AlertMessage = ({ message }: AlertMessageProps) => {
  return (
    <Alert variant="default" className="bg-yellow-50 flex items-center">
      <AlertDescription className="flex items-center gap-2">
        <Info className="w-4 flex items-center" />
        {message}
      </AlertDescription>
    </Alert>
  )
}

export default AlertMessage

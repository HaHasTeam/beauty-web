import { useTranslation } from 'react-i18next'

import { UserRoleEnum } from '@/types/role'

import { getRoleIcon } from './helper'

interface RoleTagProps {
  role: UserRoleEnum
  isBrand?: boolean
  size?: 'small' | 'medium' | 'large'
}

const sizeClasses = {
  small: 'text-xs px-2 py-1',
  medium: 'text-sm px-3 py-1.5',
  large: 'text-base px-4 py-2',
}

export default function RoleTag({ isBrand = false, role, size = 'medium' }: RoleTagProps) {
  const { t } = useTranslation()
  const roleData = getRoleIcon(role)

  return (
    <span
      className={`flex items-center gap-1 rounded-md font-medium ${roleData.bgColor} ${roleData.textColor} ${sizeClasses[size]}`}
    >
      <roleData.icon className={roleData.iconColor} size={16} />
      {isBrand ? t(`role.BRAND`) : t(`role.${role}`)}
    </span>
  )
}

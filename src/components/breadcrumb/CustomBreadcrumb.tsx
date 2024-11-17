import { Fragment } from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import configs from '@/config'

type CustomBreadcrumbProps = {
  customSegments?: Record<string, React.ReactNode>
  dynamicSegments?: { segment: string }[]
}
const CustomBreadcrumb: React.FC<CustomBreadcrumbProps> = ({ customSegments = {}, dynamicSegments = [] }) => {
  const { t } = useTranslation()
  const location = useLocation()

  // Split the current path into segments
  const pathSegments = location.pathname.split('/').filter(Boolean)
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home link is always present */}
        <BreadcrumbItem>
          <BreadcrumbLink href={configs.routes.home}>{t('breadcrumb.home')}</BreadcrumbLink>
        </BreadcrumbItem>

        {/* Dynamic Breadcrumbs */}
        {dynamicSegments && dynamicSegments.length > 0
          ? dynamicSegments.map((seg, index) => {
              const pathToSegment = `/${dynamicSegments.slice(0, index + 1).join('/')}`
              const isLast = index === dynamicSegments.length - 1

              return (
                <Fragment key={pathToSegment}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      // Render page name for the last breadcrumb
                      <BreadcrumbPage className="text-gray-400">{seg.segment}</BreadcrumbPage>
                    ) : (
                      // Render a link for intermediate segments
                      <BreadcrumbLink href={pathToSegment}>{seg.segment}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              )
            })
          : pathSegments.map((segment, index) => {
              const pathToSegment = `/${pathSegments.slice(0, index + 1).join('/')}`
              const isLast = index === pathSegments.length - 1

              return (
                <Fragment key={pathToSegment}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      // Render page name for the last breadcrumb
                      <BreadcrumbPage className="text-gray-400">
                        {customSegments[segment] ?? segment.replace(/-/g, ' ')}
                      </BreadcrumbPage>
                    ) : (
                      // Render a link for intermediate segments
                      <BreadcrumbLink href={pathToSegment}>
                        {customSegments[segment] ?? segment.replace(/-/g, ' ')}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              )
            })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default CustomBreadcrumb

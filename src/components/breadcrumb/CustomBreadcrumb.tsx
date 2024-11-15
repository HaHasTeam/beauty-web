import { Fragment } from 'react/jsx-runtime'
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
}
const CustomBreadcrumb: React.FC<CustomBreadcrumbProps> = ({ customSegments = {} }) => {
  const location = useLocation()

  // Split the current path into segments
  const pathSegments = location.pathname.split('/').filter(Boolean)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home link is always present */}
        <BreadcrumbItem>
          <BreadcrumbLink href={configs.routes.home}>Home</BreadcrumbLink>
        </BreadcrumbItem>

        {/* Dynamic Breadcrumbs */}
        {pathSegments.map((segment, index) => {
          const pathToSegment = `/${pathSegments.slice(0, index + 1).join('/')}`
          const isLast = index === pathSegments.length - 1

          return (
            <Fragment key={pathToSegment}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  // Render page name for the last breadcrumb
                  <BreadcrumbPage className="text-gray-400">
                    {customSegments[segment] || segment.replace(/-/g, ' ')}
                  </BreadcrumbPage>
                ) : (
                  // Render a link for intermediate segments
                  <BreadcrumbLink href={pathToSegment}>
                    {customSegments[segment] || segment.replace(/-/g, ' ')}
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

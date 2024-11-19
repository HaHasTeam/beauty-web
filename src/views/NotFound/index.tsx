import '@/views/Forbidden/index.css'

import { Link } from 'react-router-dom'

import notfound from '@/assets/images/not-found.png'

const NotFound = () => {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="image-container">
        <img src={notfound} alt="NotFound" />
      </div>

      <div className="mx-auto max-w-md text-center">
        <p className="mt-4 text-lg text-muted-foreground">Oops! The page you are looking for does not exist.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound

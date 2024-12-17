import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'

import RouterProvider from '@/router'
// Create a client
const queryClient = new QueryClient()
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider />
        {/* <ReactQueryDevtools initialIsOpen={true} /> */}

        <Toaster closeButton position="top-center" richColors />
      </QueryClientProvider>
    </>
  )
}

export default App

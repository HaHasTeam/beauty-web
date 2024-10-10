import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import RouterProvider from '@/router'
// Create a client
const queryClient = new QueryClient()
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  )
}

export default App

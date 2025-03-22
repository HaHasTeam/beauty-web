import { TooltipProvider } from '@radix-ui/react-tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'

import RouterProvider from '@/router'

import { ChatPopup } from './components/chat/chat-popup'
// Create a client
const queryClient = new QueryClient()
function App() {
  return (
    <>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider />
          {/* <ReactQueryDevtools initialIsOpen={true} /> */}

          <Toaster closeButton position="top-center" richColors />
          <ChatPopup />
        </QueryClientProvider>
      </TooltipProvider>
    </>
  )
}

export default App

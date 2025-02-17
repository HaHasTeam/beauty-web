import { CircleChevronDown, CircleChevronUp } from 'lucide-react'
import { ReactElement, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'

interface CollapsibleProps {
  content: ReactElement
  containerRef?: React.RefObject<HTMLElement>
}

const Collapsible = ({ content, containerRef }: CollapsibleProps) => {
  const [expanded, setExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [containerHeight, setContainerHeight] = useState<number | undefined>()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentElement = containerRef?.current
    const updateHeight = () => {
      if (containerRef?.current) {
        setContainerHeight(containerRef.current.offsetHeight)
      }
    }

    // Initial height update
    updateHeight()

    // Set up resize observer to track container height changes
    const resizeObserver = new ResizeObserver(updateHeight)
    if (currentElement) {
      resizeObserver.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        resizeObserver.unobserve(currentElement)
      }
    }
  }, [containerRef])

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > (containerHeight || contentRef.current.clientHeight))
    }
  }, [content, containerHeight])

  return (
    <div className="relative h-full">
      <div
        ref={contentRef}
        style={{
          maxHeight: expanded ? 'none' : containerHeight ? `${containerHeight - 32}px` : '100%',
        }}
        className={`transition-all duration-300 ${!expanded && 'overflow-hidden'}`}
      >
        {content}
      </div>
      {!expanded && isOverflowing && (
        <>
          {/* Base solid white layer */}
          <div className="absolute bottom-0 left-0 w-full h-12 bg-white/95 rounded-lg" />

          {/* Multiple gradient layers for smoother transition */}
          <div className="absolute bottom-12 left-0 w-full h-24 bg-gradient-to-t from-white/90 to-transparent" />
        </>
      )}
      {isOverflowing && (
        <div
          className={`${expanded ? 'w-full' : 'absolute z-10 w-full'} bg-white rounded-bl-lg rounded-br-lg bottom-0 flex justify-center`}
        >
          <Button
            variant="ghost"
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-primary text-sm font-medium hover:bg-card border-0 shadow-none hover:text-primary/80"
          >
            {expanded ? <CircleChevronUp size={18} /> : <CircleChevronDown size={18} />}
          </Button>
        </div>
      )}
    </div>
  )
}

export default Collapsible

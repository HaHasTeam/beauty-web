import { FileDown, Trash2 as RemoveIcon, View } from 'lucide-react'
import {
  createContext,
  Dispatch,
  forwardRef,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { DropzoneOptions, DropzoneState, FileRejection, useDropzone } from 'react-dropzone'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type DirectionOptions = 'rtl' | 'ltr' | undefined

type FileUploaderContextType = {
  dropzoneState: DropzoneState
  isLOF: boolean
  isFileTooBig: boolean
  removeFileFromSet: (index: number) => void
  activeIndex: number
  setActiveIndex: Dispatch<SetStateAction<number>>
  orientation: 'horizontal' | 'vertical'
  direction: DirectionOptions
  getPreviewUrl: (index: number) => string
}

const FileUploaderContext = createContext<FileUploaderContextType | null>(null)

export const useFileUpload = () => {
  const context = useContext(FileUploaderContext)
  if (!context) {
    throw new Error('useFileUpload must be used within a FileUploaderProvider')
  }
  return context
}

type FileUploaderProps = {
  value: File[] | null
  reSelect?: boolean
  onValueChange: (value: File[] | null) => void
  dropzoneOptions: DropzoneOptions
  orientation?: 'horizontal' | 'vertical'
  customMaxFiles?: number
}

/**
 * File upload Docs: {@link: https://localhost:3000/docs/file-upload}
 */

export const FileUploader = forwardRef<HTMLDivElement, FileUploaderProps & React.HTMLAttributes<HTMLDivElement>>(
  (
    {
      className,
      dropzoneOptions,
      value,
      onValueChange,
      reSelect,
      orientation = 'vertical',
      customMaxFiles = 1,
      children,
      dir,
      ...props
    },
    ref
  ) => {
    const [isFileTooBig, setIsFileTooBig] = useState(false)
    const [isLOF, setIsLOF] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const {
      accept = {
        'image/*': ['.jpg', '.jpeg', '.png', '.gif']
      },
      maxFiles = customMaxFiles,
      maxSize = 4 * 1024 * 1024,
      multiple = true
    } = dropzoneOptions

    const reSelectAll = maxFiles === 1 ? true : reSelect
    const direction: DirectionOptions = dir === 'rtl' ? 'rtl' : 'ltr'

    const removeFileFromSet = useCallback(
      (i: number) => {
        if (!value) return
        const newFiles = value.filter((_, index) => index !== i)
        onValueChange(newFiles)
      },
      [value, onValueChange]
    )

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()

        if (!value) return

        const moveNext = () => {
          const nextIndex = activeIndex + 1
          setActiveIndex(nextIndex > value.length - 1 ? 0 : nextIndex)
        }

        const movePrev = () => {
          const nextIndex = activeIndex - 1
          setActiveIndex(nextIndex < 0 ? value.length - 1 : nextIndex)
        }

        const prevKey = orientation === 'horizontal' ? (direction === 'ltr' ? 'ArrowLeft' : 'ArrowRight') : 'ArrowUp'

        const nextKey = orientation === 'horizontal' ? (direction === 'ltr' ? 'ArrowRight' : 'ArrowLeft') : 'ArrowDown'

        if (e.key === nextKey) {
          moveNext()
        } else if (e.key === prevKey) {
          movePrev()
        } else if (e.key === 'Enter' || e.key === 'Space') {
          if (activeIndex === -1) {
            dropzoneState.inputRef.current?.click()
          }
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
          if (activeIndex !== -1) {
            removeFileFromSet(activeIndex)
            if (value.length - 1 === 0) {
              setActiveIndex(-1)
              return
            }
            movePrev()
          }
        } else if (e.key === 'Escape') {
          setActiveIndex(-1)
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [value, activeIndex, removeFileFromSet]
    )

    const onDrop = useCallback(
      (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        const files = acceptedFiles

        if (!files) {
          toast.error('file error , probably too big')
          return
        }

        const newValues: File[] = value ? [...value] : []

        if (reSelectAll) {
          newValues.splice(0, newValues.length)
        }

        files.forEach((file) => {
          if (newValues.length < maxFiles) {
            newValues.push(file)
          }
        })

        onValueChange(newValues)

        if (rejectedFiles.length > 0) {
          for (let i = 0; i < rejectedFiles.length; i++) {
            if (rejectedFiles[i].errors[0]?.code === 'file-too-large') {
              toast.error(`File is too large. Max size is ${maxSize / 1024 / 1024}MB`)
              break
            }
            if (rejectedFiles[i].errors[0]?.message) {
              toast.error(rejectedFiles[i].errors[0].message)
              break
            }
          }
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [reSelectAll, value]
    )

    useEffect(() => {
      if (!value) return
      if (value.length === maxFiles) {
        setIsLOF(true)
        return
      }
      setIsLOF(false)
    }, [value, maxFiles])

    const opts = dropzoneOptions ? dropzoneOptions : { accept, maxFiles, maxSize, multiple }

    const dropzoneState = useDropzone({
      ...opts,
      onDrop,
      onDropRejected: () => setIsFileTooBig(true),
      onDropAccepted: () => setIsFileTooBig(false)
    })

    const getPreviewUrl = (index: number) => {
      if (!value) return ''
      const file = value[index]
      const url = URL.createObjectURL(file)
      return url
    }

    return (
      <FileUploaderContext.Provider
        value={{
          getPreviewUrl,
          dropzoneState,
          isLOF,
          isFileTooBig,
          removeFileFromSet,
          activeIndex,
          setActiveIndex,
          orientation,
          direction
        }}
      >
        <div
          ref={ref}
          tabIndex={0}
          onKeyDownCapture={handleKeyDown}
          className={cn('grid w-full focus:outline-none  ', className, {
            'gap-2': value && value.length > 0
          })}
          dir={dir}
          {...props}
        >
          {children}
        </div>
      </FileUploaderContext.Provider>
    )
  }
)

FileUploader.displayName = 'FileUploader'

export const FileUploaderContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    const { orientation } = useFileUpload()
    const containerRef = useRef<HTMLDivElement>(null)

    return (
      <div className={cn('w-full')} ref={containerRef} aria-description='content file holder'>
        <div
          {...props}
          ref={ref}
          className={cn(
            'flex rounded-xl gap-1',
            orientation === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col',
            className
          )}
        >
          {children}
        </div>
      </div>
    )
  }
)

FileUploaderContent.displayName = 'FileUploaderContent'

export const FileUploaderItem = forwardRef<HTMLDivElement, { index: number } & React.HTMLAttributes<HTMLDivElement>>(
  ({ className, index, children, ...props }, ref) => {
    const { removeFileFromSet, activeIndex, direction, getPreviewUrl } = useFileUpload()
    const isSelected = index === activeIndex
    const previewUrl = getPreviewUrl(index)
    return (
      <div
        ref={ref}
        className={cn(
          'justify-between cursor-pointer relative h-full p-2 border-2',
          className,
          isSelected ? 'bg-muted' : ''
        )}
        {...props}
      >
        <div className='font-medium leading-none tracking-tight flex items-center gap-1.5 h-full w-full'>
          {children}
        </div>
        <div className={cn('absolute flex items-center gap-2', direction === 'rtl' ? 'top-2 left-2' : 'top-2 right-2')}>
          <a href={previewUrl} target='_blank' rel='noreferrer'>
            <span className='sr-only'>Preview {index}</span>
            <View
              strokeWidth={3}
              className='w-4 h-4 hover:stroke-destructive duration-200 ease-in-out text-green-700'
            />
          </a>
          <a href={previewUrl} download={true}>
            <span className='sr-only'>Download file {index}</span>
            <FileDown
              strokeWidth={3}
              className='w-4 h-4 hover:stroke-destructive duration-200 ease-in-out text-yellow-700'
            />
          </a>
          <button type='button' onClick={() => removeFileFromSet(index)}>
            <span className='sr-only'>remove item {index}</span>
            <RemoveIcon
              strokeWidth={3}
              className='w-4 h-4 hover:stroke-destructive duration-200 ease-in-out text-red-700'
            />
          </button>
        </div>
      </div>
    )
  }
)

FileUploaderItem.displayName = 'FileUploaderItem'

export const FileInput = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    disabled?: boolean
  }
>(({ className, children, disabled, ...props }, ref) => {
  const { dropzoneState, isFileTooBig, isLOF } = useFileUpload()
  const rootProps = isLOF ? {} : dropzoneState.getRootProps()
  const isDisabled = disabled || isLOF
  return (
    <div
      ref={ref}
      {...props}
      className={`relative w-full h-full ${isDisabled ? 'opacity-50 cursor-not-allowed ' : 'cursor-pointer '}`}
    >
      <div
        className={cn(
          `w-full rounded-lg duration-300 ease-in-out
         ${
           dropzoneState.isDragAccept
             ? 'border-green-500'
             : dropzoneState.isDragReject || isFileTooBig
               ? 'border-red-500'
               : 'border-gray-300'
         }`,
          className
        )}
        {...rootProps}
      >
        {children}
      </div>
      <Input
        ref={dropzoneState.inputRef}
        disabled={isDisabled}
        {...dropzoneState.getInputProps()}
        className={`${isDisabled ? 'cursor-not-allowed' : ''}`}
      />
    </div>
  )
})

FileInput.displayName = 'FileInput'

export const ProductFileUploaderItem = forwardRef<
  HTMLDivElement,
  { index: number } & React.HTMLAttributes<HTMLDivElement>
>(({ className, index, children, ...props }, ref) => {
  const { removeFileFromSet, activeIndex, direction } = useFileUpload()
  const isSelected = index === activeIndex
  return (
    <div
      ref={ref}
      className={cn('cursor-pointer relative bg-black/5', className, isSelected ? 'bg-muted' : '')}
      {...props}
    >
      <div className='absolute z-0 leading-none tracking-tight flex justify-center items-center gap-1.5 h-full w-full'>
        {children}
      </div>
      <button
        type='button'
        className={cn(
          'absolute z-20 bg-black/40 hover:bg-black/30 p-1 rounded-sm',
          direction === 'rtl' ? 'top-2 left-2' : 'top-2 right-2'
        )}
        onClick={() => removeFileFromSet(index)}
      >
        <span className='sr-only'>remove item {index}</span>
        <RemoveIcon className='w-4 h-4 text-white hover:text-white/70 duration-200 ease-in-out' />
      </button>
    </div>
  )
})

ProductFileUploaderItem.displayName = 'ProductFileUploaderItem'

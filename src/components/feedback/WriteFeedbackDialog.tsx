import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Check, Star, Upload, X } from 'lucide-react'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import FormLabel from '@/components/form-label'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { createFeedbackApi } from '@/network/apis/feedback'
import { getFeedbackSchema, IFeedbackSchema, MAX_FEEDBACK_LENGTH } from '@/schemas/feedback.schema'

import Button from '../button'
import UploadFeedbackMediaFiles from './UploadFeedbackMediaFiles'

interface WriteFeedbackDialogProps {
  isOpen: boolean
  onClose: () => void
  orderDetailId: string
}

export const WriteFeedbackDialog: React.FC<WriteFeedbackDialogProps> = ({ isOpen, onClose, orderDetailId }) => {
  const { t } = useTranslation()
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const FeedbackSchema = getFeedbackSchema()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const id = useId()

  const defaultValues = {
    rating: 0,
    content: '',
    orderDetailId,
    mediaFiles: [],
  }

  const form = useForm<z.infer<typeof FeedbackSchema>>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues,
  })

  const { mutateAsync: submitFeedbackFn } = useMutation({
    mutationKey: [createFeedbackApi.mutationKey],
    mutationFn: createFeedbackApi.fn,
    onSuccess: () => {
      successToast({
        message: t('feedback.successTitle'),
        description: t('feedback.successDescription'),
      })
      handleReset()
      onClose()
    },
  })

  const handleReset = () => {
    form.reset()
    setFiles([])
    setPreviewUrls([])
  }

  const handleSubmit = async (values: IFeedbackSchema) => {
    // Here you would typically upload the files first and get back URLs
    // For this example, we'll assume it's handled separately or through a form data approach

    // Assuming the API accepts the entire form with files
    try {
      setIsLoading(true)
      await submitFeedbackFn(values)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
        form,
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])

      // Create preview URLs
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls])

      // Update form value
      const currentMediaFiles = form.getValues('mediaFiles')
      form.setValue('mediaFiles', [...currentMediaFiles, ...newPreviewUrls])
    }
  }

  const removeFile = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index])

    const updatedFiles = [...files]
    updatedFiles.splice(index, 1)
    setFiles(updatedFiles)

    const updatedPreviewUrls = [...previewUrls]
    updatedPreviewUrls.splice(index, 1)
    setPreviewUrls(updatedPreviewUrls)

    // Update form value
    form.setValue('mediaFiles', updatedPreviewUrls)
  }

  const renderStarRating = () => {
    const rating = form.getValues('rating')

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-8 h-8 cursor-pointer ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            onClick={() => form.setValue('rating', star)}
          />
        ))}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-primary">{t('feedback.writeReview')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" id={`form-${id}`}>
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="w-full flex gap-2">
                    <div className="w-full">
                      <FormControl>
                        <div {...field} className="flex justify-center">
                          {renderStarRating()}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex items-center">
                      <FormLabel required>{t('feedback.content')}</FormLabel>
                    </div>
                    <div className="w-full space-y-1">
                      <FormControl>
                        <Textarea
                          placeholder={t('feedback.contentPlaceholder')}
                          className="border-primary/40 min-h-32"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground text-right">
                    {field?.value?.length ?? 0}/{MAX_FEEDBACK_LENGTH}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mediaFiles"
              render={() => (
                <FormItem className="w-full">
                  <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex items-center">
                      <FormLabel>{t('feedback.mediaFiles')}</FormLabel>
                      <FormDescription>{t('feedback.mediaFilesHint')}</FormDescription>
                    </div>
                    <div className="w-full space-y-1">
                      <UploadFeedbackMediaFiles
                        field={field}
                        vertical={false}
                        dropZoneConfigOptions={{ maxFiles: MAX_PRODUCT_IMAGES }}
                        renderFileItemUI={(file) => {
                          return (
                            <div
                              key={file?.name}
                              className="hover:border-primary w-32 h-32 rounded-lg border border-gay-300 p-0"
                            >
                              <img
                                src={URL?.createObjectURL(file)}
                                alt={file?.name}
                                className="object-contain w-full h-full rounded-lg"
                                onLoad={() => URL?.revokeObjectURL(URL?.createObjectURL(file))}
                              />
                            </div>
                          )
                        }}
                        renderInputUI={(_isDragActive, files, maxFiles) => {
                          return (
                            <div className="w-32 h-32 hover:bg-primary/15 p-4 rounded-lg border flex flex-col gap-2 items-center justify-center text-center border-dashed border-primary transition-all duration-500">
                              <ImagePlus className="w-12 h-12 text-primary" />

                              <p className="text-sm text-primary">
                                {t('createProduct.inputImage')} ({files?.length ?? 0}/{maxFiles})
                              </p>
                            </div>
                          )
                        }}
                      />
                      <p className="text-xs text-muted-foreground"></p>
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="border border-primary hover:bg-primary/10 text-primary hover:text-primary"
                onClick={onClose}
              >
                {t('button.cancel')}
              </Button>
              <Button type="submit" className="gap-1" loading={isLoading}>
                {t('button.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

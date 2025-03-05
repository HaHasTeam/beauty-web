import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FilesIcon, ImagePlus, Star, Video } from 'lucide-react'
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
import { uploadFilesApi } from '@/network/apis/file'
import { getOrderByIdApi } from '@/network/apis/order'
import { getFeedbackSchema, IFeedbackSchema, MAX_FEEDBACK_LENGTH } from '@/schemas/feedback.schema'

import Button from '../button'
import UploadMediaFiles from '../file-input/UploadMediaFiles'
import { VideoThumbnail } from '../file-input/VideoThumbnail'

interface WriteFeedbackDialogProps {
  isOpen: boolean
  onClose: () => void
  orderDetailId: string
}

export const WriteFeedbackDialog: React.FC<WriteFeedbackDialogProps> = ({ isOpen, onClose, orderDetailId }) => {
  const MAX_IMAGES = 4
  const MAX_VIDEOS = 1
  // const MAX_FILES = MAX_IMAGES + MAX_VIDEOS
  const MAX_SIZE_NUMBER = 10
  const MAX_SIZE = MAX_SIZE_NUMBER * 1024 * 1024

  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const FeedbackSchema = getFeedbackSchema()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const id = useId()
  const queryClient = useQueryClient()

  const defaultValues = {
    rating: 0,
    content: '',
    orderDetailId,
    mediaFiles: [],
    videos: [],
    images: [],
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
      queryClient.invalidateQueries({
        queryKey: [getOrderByIdApi.queryKey],
      })
      handleReset()
      onClose()
    },
  })

  const handleReset = () => {
    form.reset()
  }

  const { mutateAsync: uploadFilesFn } = useMutation({
    mutationKey: [uploadFilesApi.mutationKey],
    mutationFn: uploadFilesApi.fn,
  })

  const convertFileToUrl = async (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const uploadedFilesResponse = await uploadFilesFn(formData)

    return uploadedFilesResponse.data
  }

  const handleSubmit = async (values: IFeedbackSchema) => {
    try {
      setIsLoading(true)
      const imgUrls = values.images ? await convertFileToUrl(values.images) : []
      const videoUrls = values.videos ? await convertFileToUrl(values.videos) : []
      await submitFeedbackFn({
        ...values,
        mediaFiles: [...imgUrls, ...videoUrls],
      })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      handleServerError({
        error,
        form,
      })
    }
  }

  const renderStarRating = () => {
    const rating = form.getValues('rating')

    return (
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled =
            hoveredRating !== null
              ? star <= hoveredRating // During hover
              : star <= rating // Permanent selection

          return (
            <Star
              key={star}
              className={`w-8 h-8 cursor-pointer transition-all duration-150 ${
                isFilled ? 'fill-yellow-400 text-yellow-400 scale-110' : 'text-gray-200 hover:text-slate-300'
              }`}
              onClick={() => {
                form.setValue('rating', star)
                // Optional - trigger validation if needed
                form.trigger('rating')
              }}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(null)}
            />
          )
        })}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-primary">{t('feedback.writeReview')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, (e) => console.log(e))}
            className="space-y-6"
            id={`form-${id}`}
          >
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
                      <FormMessage className="text-center" />
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
                      <FormLabel required className="text-primary">
                        {t('feedback.content')}
                      </FormLabel>
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

            <div className="space-y-1">
              <FormLabel className="text-primary">{t('feedback.mediaFiles')}</FormLabel>
              <FormDescription>
                {t('feedback.mediaFilesHint', {
                  videoCount: MAX_VIDEOS,
                  imageCount: MAX_IMAGES,
                  size: MAX_SIZE_NUMBER,
                  format: 'mp4/wmv/mov/avi/mkv/flv/jpg/jpeg/png'.toLocaleUpperCase(),
                })}
              </FormDescription>
            </div>
            <div className={(form.getValues('images') ?? [])?.length >= 4 ? 'flex flex-col gap-1' : 'flex gap-1'}>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <div>
                      <UploadMediaFiles
                        field={field}
                        vertical={false}
                        isAcceptImage={true}
                        isAcceptVideo={false}
                        maxImages={MAX_IMAGES}
                        maxVideos={MAX_VIDEOS}
                        dropZoneConfigOptions={{
                          maxFiles: MAX_IMAGES,
                          maxSize: MAX_SIZE,
                        }}
                        renderFileItemUI={(file) => {
                          return (
                            <div
                              key={file.name}
                              className="hover:border-primary w-32 h-32 rounded-lg border border-gay-300 p-0 relative"
                            >
                              {file.type.includes('image') ? (
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  className="object-contain w-full h-full rounded-lg"
                                  onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                                />
                              ) : file.type.includes('video') ? (
                                <VideoThumbnail file={file} />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <FilesIcon className="w-12 h-12 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          )
                        }}
                        renderInputUI={(_isDragActive, files, maxFiles) => {
                          return (
                            <div className="w-32 h-32 hover:bg-primary/15 p-4 rounded-lg border flex flex-col gap-2 items-center justify-center text-center border-dashed border-primary transition-all duration-500">
                              <ImagePlus className="w-8 h-8 text-primary" />
                              {/* <p className="text-xs text-primary">{t('validation.inputMedia')}</p> */}
                              <p className="text-xs text-muted-foreground">
                                {files.length}/{maxFiles} {t('media.imagesFile')}
                              </p>
                            </div>
                          )
                        }}
                      />
                      <p className="text-xs text-muted-foreground"></p>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="videos"
                render={({ field }) => (
                  <FormItem className="">
                    <div className="flex flex-col gap-2">
                      <div className="space-y-1">
                        <UploadMediaFiles
                          field={field}
                          vertical={false}
                          isAcceptImage={false}
                          isAcceptVideo={true}
                          maxImages={MAX_IMAGES}
                          maxVideos={MAX_VIDEOS}
                          dropZoneConfigOptions={{
                            maxFiles: MAX_VIDEOS,
                            maxSize: MAX_SIZE,
                          }}
                          renderFileItemUI={(file) => {
                            return (
                              <div
                                key={file.name}
                                className="hover:border-primary w-32 h-32 rounded-lg border border-gay-300 p-0 relative"
                              >
                                {file.type.includes('image') ? (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="object-contain w-full h-full rounded-lg"
                                    onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                                  />
                                ) : file.type.includes('video') ? (
                                  <VideoThumbnail file={file} />
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    <FilesIcon className="w-12 h-12 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                            )
                          }}
                          renderInputUI={(_isDragActive, files, maxFiles) => {
                            return (
                              <div className="w-32 h-32 hover:bg-primary/15 p-4 rounded-lg border flex flex-col gap-2 items-center justify-center text-center border-dashed border-primary transition-all duration-500">
                                <Video className="w-8 h-8 text-primary" />
                                {/* <p className="text-xs text-primary">{t('validation.inputMedia')}</p> */}
                                <p className="text-xs text-muted-foreground">
                                  {files.length}/{maxFiles} {t('media.videosFile')}
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
            </div>
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

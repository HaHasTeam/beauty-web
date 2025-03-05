import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { FilesIcon, ImagePlus, Video } from 'lucide-react'
import { Dispatch, SetStateAction, useId, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import Label from '@/components/form-label'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { uploadFilesApi } from '@/network/apis/file'
import { requestReturnOrderApi } from '@/network/apis/order'
import { getRequestReturnOrderSchema } from '@/schemas/order.schema'

import AlertMessage from '../alert/AlertMessage'
import Button from '../button'
import UploadMediaFiles from '../file-input/UploadMediaFiles'
import { VideoThumbnail } from '../file-input/VideoThumbnail'
import { ScrollArea } from '../ui/scroll-area'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface RequestReturnOrderDialogProps {
  orderId: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  onOpenChange: (open: boolean) => void
  setIsTrigger: Dispatch<SetStateAction<boolean>>
}

export const RequestReturnOrderDialog: React.FC<RequestReturnOrderDialogProps> = ({
  orderId,
  open,
  setOpen,
  onOpenChange,
  setIsTrigger,
}) => {
  const MAX_IMAGES = 4
  const MAX_VIDEOS = 1
  // const MAX_FILES = MAX_IMAGES + MAX_VIDEOS
  const MAX_SIZE_NUMBER = 10
  const MAX_SIZE = MAX_SIZE_NUMBER * 1024 * 1024
  const REQUEST_RETURN_ORDER_PROCESS_DATE = 2

  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const id = useId()
  const ReturnOrderSchema = getRequestReturnOrderSchema()
  const [isOtherReason, setIsOtherReason] = useState<boolean>(false)

  const reasons: { value: string }[] = useMemo(
    () => [
      { value: t('order.returnOrderReason.wrongItem') },
      { value: t('order.returnOrderReason.damage') },
      { value: t('order.returnOrderReason.missingItem') },
      { value: t('order.returnOrderReason.expired') },
      { value: t('order.returnOrderReason.allergy') },
      { value: t('order.returnOrderReason.notAsDescribed') },
      { value: t('order.returnOrderReason.duplicate') },
      { value: t('order.returnOrderReason.other') },
    ],
    [t],
  )

  const defaultValues = {
    reason: '',
    otherReason: '',
    mediaFiles: [],
    videos: [],
    images: [],
  }

  const form = useForm<z.infer<typeof ReturnOrderSchema>>({
    resolver: zodResolver(ReturnOrderSchema),
    defaultValues,
  })

  const { mutateAsync: requestReturnOrderFn } = useMutation({
    mutationKey: [requestReturnOrderApi.mutationKey],
    mutationFn: requestReturnOrderApi.fn,
    onSuccess: () => {
      successToast({
        message: t('order.returnOrderDialog.successTitle'),
        description: t('order.returnOrderDialog.successDescription', { count: REQUEST_RETURN_ORDER_PROCESS_DATE }),
      })
      setIsTrigger((prev) => !prev)
      handleReset()
    },
  })

  const handleReset = () => {
    form.reset()
    setIsOtherReason(false)
    setOpen(false)
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

  const handleSubmit = async (values: z.infer<typeof ReturnOrderSchema>) => {
    try {
      setIsLoading(true)
      const imgUrls = values.images ? await convertFileToUrl(values.images) : []
      const videoUrls = values.videos ? await convertFileToUrl(values.videos) : []
      const payload = isOtherReason ? { reason: values.otherReason } : { reason: values.reason }

      await requestReturnOrderFn({
        orderId,
        ...payload,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-xl sm:max-w-lg">
        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-3 mr-2">
            <DialogHeader>
              <DialogTitle className="text-primary">{t('order.returnOrderDialog.title')}</DialogTitle>
            </DialogHeader>

            <AlertMessage
              className="text-justify"
              message={t('order.returnOrderDialog.description')}
              textSize="medium"
            />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit, (e) => console.log(e))}
                className="space-y-6"
                id={`form-${id}`}
              >
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <div className="w-full flex gap-2">
                        <div className="w-1/5 flex items-center">
                          <Label htmlFor="reason" required className="w-fit text-primary">
                            {t('order.cancelOrderReason.reason')}
                          </Label>
                        </div>
                        <div className="w-full space-y-1">
                          <FormControl>
                            <Select
                              value={field.value ?? ''}
                              onValueChange={(value) => {
                                field.onChange(value)
                                setIsOtherReason(value === t('order.returnOrderReason.other'))
                              }}
                              required
                              name="reason"
                            >
                              <SelectTrigger className="border-primary/40">
                                <SelectValue {...field} placeholder={t('order.cancelOrderReason.selectAReason')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {reasons.map((reason) => (
                                    <SelectItem key={reason.value} value={reason.value}>
                                      {reason.value}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                {isOtherReason && (
                  <FormField
                    control={form.control}
                    name="otherReason"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <div className="w-full flex gap-2">
                          <div className="w-1/5 flex items-center">
                            <Label htmlFor="otherReason" required className="w-fit text-primary">
                              {t('order.cancelOrderReason.otherReason')}
                            </Label>
                          </div>
                          <div className="w-full space-y-1">
                            <FormControl>
                              <Textarea
                                id="otherReason"
                                {...field}
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring border-primary/40"
                                placeholder={t('order.cancelOrderReason.enterReason')}
                                rows={4}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                {/* media */}
                <div className="space-y-1">
                  <Label required className="text-primary">
                    {t('feedback.mediaFiles')}
                  </Label>
                  <FormDescription className="text-justify">
                    {t('order.returnOrderDialog.mediaFilesNotes')}
                  </FormDescription>
                  <FormDescription className="text-justify">
                    {t('feedback.mediaFilesHint', {
                      videoCount: MAX_VIDEOS,
                      imageCount: MAX_IMAGES,
                      size: MAX_SIZE_NUMBER,
                      format: 'mp4/wmv/mov/avi/mkv/flv/jpg/jpeg/png'.toLocaleUpperCase(),
                    })}
                  </FormDescription>
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="videos"
                    render={({ field }) => (
                      <FormItem className="">
                        <div className="flex flex-col gap-2">
                          <div className="space-y-2">
                            <Label required className="text-primary">
                              {t('feedback.uploadVideos')}
                            </Label>
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
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-2">
                          <Label required className="text-primary">
                            {t('feedback.uploadImages')}
                          </Label>
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
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    className="border border-primary hover:bg-primary/10 text-primary hover:text-primary"
                    onClick={() => {
                      onOpenChange(false)
                      handleReset()
                    }}
                  >
                    {t('button.cancel')}
                  </Button>
                  <Button type="submit" className="gap-1" loading={isLoading}>
                    {t('button.submit')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

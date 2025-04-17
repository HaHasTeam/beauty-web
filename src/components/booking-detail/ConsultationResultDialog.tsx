import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ImageIcon } from 'lucide-react'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import Button from '@/components/button'
import FormLabel from '@/components/form-label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { updateBookingStatusApi } from '@/network/apis/booking/details'
import { getConsultationResultSchema } from '@/schemas/booking.schema'
import { IBooking } from '@/types/booking'
import { BookingStatusEnum } from '@/types/enum'

import UploadMediaFiles from '../file-input/UploadMediaFiles'
import ImageWithFallback from '../ImageFallback'
import ProductClassificationCombobox from '../product/ProductClassificationCombobox'
import { ScrollArea } from '../ui/scroll-area'

interface CompleteConsultingCallDialogProps {
  booking: IBooking
  isOpen: boolean
  onClose: () => void
}

const ConsultationResultDialog = ({ booking, isOpen, onClose }: CompleteConsultingCallDialogProps) => {
  const MAX_IMAGES = 3
  const MAX_SIZE_NUMBER = 15
  const MAX_SIZE = MAX_SIZE_NUMBER * 1024 * 1024
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const id = useId()
  const queryClient = useQueryClient()
  const ConsultationResultSchema = getConsultationResultSchema()

  // Get the consultation criteria from the booking
  const consultationCriteria = booking?.consultantService?.systemService.consultationCriteria || {
    id: '',
    consultationCriteriaSections: [],
  }

  // Format criteria sections for form
  const formattedCriteriaSections = consultationCriteria.consultationCriteriaSections || []

  // Prepare default values for the form
  const defaultFormValues = {
    criteriaId: consultationCriteria.id,
    criteria: formattedCriteriaSections.map((section) => ({
      section: section.section,
      orderIndex: section.orderIndex,
    })),
    results: formattedCriteriaSections.map((section) => ({
      section: section.section,
      orderIndex: section.orderIndex,
      answers: '',
      images: [],
    })),
    suggestedProductClassifications: [],
  }

  const form = useForm<z.infer<typeof ConsultationResultSchema>>({
    resolver: zodResolver(ConsultationResultSchema),
    defaultValues: defaultFormValues,
  })

  const handleReset = () => {
    form.reset(defaultFormValues)
  }

  const { mutateAsync: updateBookingStatusFn } = useMutation({
    mutationKey: [updateBookingStatusApi.mutationKey],
    mutationFn: updateBookingStatusApi.fn,
    onSuccess: async () => {
      successToast({
        message: t('booking.submitConsultationResultSuccess'),
      })
      await Promise.all([queryClient.invalidateQueries({ queryKey: ['getBookingById'] })])
      handleReset()
      onClose()
    },
  })

  const handleSubmit = async (values: z.infer<typeof ConsultationResultSchema>) => {
    try {
      setIsLoading(true)
      await updateBookingStatusFn({
        id: booking.id,
        status: BookingStatusEnum.SENDED_RESULT_SHEET,
        consultationResult: values,
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

  // Function to add a product classification
  const handleAddProductClassification = (classification: { id: string; name: string }) => {
    const currentValues = form.getValues().suggestedProductClassifications || []
    const exists = currentValues.some((p) => p.productClassificationId === classification.id)

    if (!exists) {
      const updatedClassifications = [
        ...currentValues,
        {
          productClassificationId: classification.id,
          name: classification.name,
        },
      ]

      form.setValue('suggestedProductClassifications', updatedClassifications)
    }
  }

  // Function to remove a product classification
  const handleRemoveProductClassification = (id: string) => {
    const currentValues = form.getValues().suggestedProductClassifications
    const updatedClassifications = currentValues.filter((p) => p.productClassificationId !== id)
    form.setValue('suggestedProductClassifications', updatedClassifications)
  }

  // Display booking form answers for reference
  const bookingFormAnswer = booking?.bookingFormAnswer || { form: [], answers: [] }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="xl:max-w-7xl lg:max-w-7xl sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">{t('booking.completeConsultation')}</DialogTitle>
          <DialogDescription className="text-justify">{t('booking.completeConsultationDescription')}</DialogDescription>
        </DialogHeader>

        <div className="w-full flex flex-col sm:flex-row gap-3 justify-between relative">
          <ScrollArea className="sm:w-1/2 w-full h-[75vh]">
            <div className="mb-6 p-4 bg-primary/10 rounded-md h-fit">
              <h3 className="font-semibold mb-2 text-primary">{t('booking.customerResponses')}</h3>
              <div className="space-y-3">
                {bookingFormAnswer.answers?.map((answer, index) => (
                  <div key={`answer-${index}`} className="space-y-1">
                    <p className="font-medium">{answer.question}</p>
                    <div className="pl-4">
                      {answer.answers.text ? (
                        <p className="text-sm">{answer.answers.text}</p>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {Object.values(answer.answers).map((value, i) => (
                            <span key={i} className="text-sm bg-primary/10 rounded px-2 py-1 text-primary">
                              {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
          <ScrollArea className="sm:w-1/2 w-full h-[75vh]">
            <Form {...form}>
              <form noValidate onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" id={`form-${id}`}>
                <div className="space-y-6">
                  {formattedCriteriaSections.map((section, index) => (
                    <div key={`section-${index}`} className="p-4 border border-primary rounded-md">
                      <h3 className="font-medium mb-2 text-primary">{section.section}</h3>
                      <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">{section.description}</p>

                      <FormField
                        control={form.control}
                        name={`results.${index}.answers`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary" required={section.mandatory}>
                              {t('booking.yourEvaluation')}
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t('booking.enterYourEvaluation')}
                                className="resize-none"
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="mt-4">
                        <FormField
                          control={form.control}
                          name={`results.${index}.images`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <div className="w-full flex flex-col gap-2">
                                <div className="w-full space-y-1">
                                  <FormLabel className="text-primary">{t('feedback.uploadImages')}</FormLabel>
                                  <FormDescription>{t('booking.imagesHint')}</FormDescription>
                                </div>
                                <div className="w-full space-y-1">
                                  <UploadMediaFiles
                                    field={field}
                                    vertical={false}
                                    isAcceptImage={true}
                                    isAcceptVideo={false}
                                    maxImages={MAX_IMAGES}
                                    maxVideos={0}
                                    dropZoneConfigOptions={{
                                      maxFiles: MAX_IMAGES,
                                      maxSize: MAX_SIZE,
                                    }}
                                    renderFileItemUI={(file) => (
                                      <div
                                        key={file.name}
                                        className="hover:border-primary w-32 h-32 rounded-lg border border-gay-300 p-0 relative"
                                      >
                                        <ImageWithFallback
                                          src={URL.createObjectURL(file)}
                                          alt={file.name}
                                          fallback={fallBackImage}
                                          className="object-contain w-full h-full rounded-lg"
                                          onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                                        />
                                      </div>
                                    )}
                                    renderInputUI={(_isDragActive, files, maxFiles) => (
                                      <div className="w-32 h-32 hover:bg-primary/15 p-4 rounded-lg border flex flex-col gap-2 items-center justify-center text-center border-dashed border-primary transition-all duration-500">
                                        <ImageIcon className="w-8 h-8 text-primary" />
                                        <p className="text-xs text-muted-foreground">
                                          {files.length}/{maxFiles} {t('media.imagesFile')}
                                        </p>
                                      </div>
                                    )}
                                  />
                                  <FormMessage />
                                </div>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border border-primary rounded-md">
                  <h3 className="font-medium mb-4 text-primary">{t('booking.suggestedProducts')}</h3>

                  <ProductClassificationCombobox
                    onSelect={handleAddProductClassification}
                    placeholder={t('booking.searchForProducts')}
                  />

                  <div className="mt-4 space-y-2">
                    {form.watch('suggestedProductClassifications')?.map((product, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-muted p-2 rounded">
                        <span>{product.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProductClassification(product.productClassificationId)}
                        >
                          {t('button.remove')}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" type="button" onClick={onClose}>
                    {t('button.cancel')}
                  </Button>
                  <Button type="submit" loading={isLoading}>
                    {t('button.submit')}
                  </Button>
                </div>
              </form>
            </Form>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConsultationResultDialog

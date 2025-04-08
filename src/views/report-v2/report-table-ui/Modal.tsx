import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Row } from '@tanstack/react-table'
import { Siren } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import Button from '@/components/button'
import UploadFiles, { TriggerUploadRef } from '@/components/file-input/UploadFiles'
import FormLabel from '@/components/form-label'
import SelectBooking from '@/components/select-booking'
import SelectOrder from '@/components/select-order'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Dialog } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { defaultRequiredRegex } from '@/constants/regex'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { createReport, getFilteredReports } from '@/network/apis/report'
import { TCreateReportRequestParams } from '@/network/apis/report/type'
import { FileStatusEnum } from '@/types/file'
import { IReport, ReportStatusEnum, ReportTypeEnum } from '@/types/report'

interface DialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  Report: Row<IReport>['original'][]
  showTrigger?: boolean
  onSuccess?: () => void
  setOpen: (value: boolean) => void
  viewOnly?: boolean
}

const formSchema = z
  .object({
    type: z.string({
      message: defaultRequiredRegex.message,
    }),
    reason: z.string({
      message: defaultRequiredRegex.message,
    }),
    customReason: z.string().optional(),
    files: z
      .array(
        z.object({
          id: z.string().optional(),
          name: z.string(),
          fileUrl: z.string(),
          status: z.nativeEnum(FileStatusEnum).optional(),
        }),
      )
      .min(1, {
        message: defaultRequiredRegex.message,
      }),
    orderId: z.string().optional(),
    bookingId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === ReportTypeEnum.ORDER && !data.orderId) {
      return ctx.addIssue({
        code: 'custom',
        path: ['orderId'],
        message: defaultRequiredRegex.message,
      })
    }
    if (data.type === ReportTypeEnum.BOOKING && !data.bookingId) {
      return ctx.addIssue({
        code: 'custom',
        path: ['bookingId'],
        message: defaultRequiredRegex.message,
      })
    }
    if (data.reason === 'OTHER' && (!data.customReason || data.customReason.trim() === '')) {
      return ctx.addIssue({
        code: 'custom',
        path: ['customReason'],
        message: defaultRequiredRegex.message,
      })
    }
  })

type formType = z.infer<typeof formSchema>

export default function Modal({ setOpen, viewOnly = false, Report }: DialogProps) {
  const { t } = useTranslation()
  const handleServerError = useHandleServerError()
  const { successToast } = useToast()
  const triggerRef = useRef<TriggerUploadRef>(null)
  const queryClient = useQueryClient()
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
      reason: '',
      customReason: '',
    },
  })

  const { mutateAsync: createReportFn } = useMutation({
    mutationKey: [createReport.mutationKey],
    mutationFn: createReport.fn,
    onSuccess: () => {
      successToast({
        message: t('report.createSuccess', 'Report created successfully'),
      })
      setOpen(false)
    },
  })

  // Predefined reason options
  const reasonOptions = [
    { value: 'INCORRECT_ITEM', label: t('report.reasonOptions.incorrectItem', 'Incorrect item received') },
    { value: 'DAMAGED_ITEM', label: t('report.reasonOptions.damagedItem', 'Damaged item received') },
    { value: 'LATE_DELIVERY', label: t('report.reasonOptions.lateDelivery', 'Late delivery') },
    { value: 'QUALITY_ISSUE', label: t('report.reasonOptions.qualityIssue', 'Quality issue with product/service') },
    { value: 'PAYMENT_PROBLEM', label: t('report.reasonOptions.paymentProblem', 'Payment problem') },
    { value: 'APP_ERROR', label: t('report.reasonOptions.appError', 'Application error') },
    { value: 'OTHER', label: t('report.reasonOptions.other', 'Other reason') },
  ]

  const onSubmit: SubmitHandler<formType> = async () => {
    try {
      const triggerFns = triggerRef.current?.triggers
      if (triggerFns) {
        await Promise.all(triggerFns.map((trigger) => trigger()))
      }
      const images = form.getValues().files.map((file) => file.fileUrl)
      
      // Process reason field
      let finalReason = form.getValues().reason
      if (finalReason === 'OTHER' && form.getValues().customReason) {
        finalReason = form.getValues().customReason ?? ''
      } else {
        // Replace underscores with spaces in predefined reasons
        finalReason = finalReason.replace(/_/g, ' ')
      }
      
      // Remove customReason from payload
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {  ...valueWithoutCustomReason } = form.getValues();
      
      const value = { 
        ...valueWithoutCustomReason, 
        files: images,
        reason: finalReason 
      }
      
      await createReportFn(value as TCreateReportRequestParams)
      queryClient.invalidateQueries({
        queryKey: [getFilteredReports.queryKey, {}],
      })
    } catch (error) {
      handleServerError({ error, form })
    }
  }
  const report = Report?.[0]

  useEffect(() => {
    if (report)
      form.reset({
        type: report.type,
        reason: report.reason,
        orderId: report.order?.id,
        bookingId: report.booking?.id,
        files: report.files.map((file) => ({
          id: file.id,
          name: file.name,
          fileUrl: file.fileUrl,
          status: file.status,
        })),
      })
  }, [Report, form, report])

  const getHeader = () => {
    if (!report?.id) return null
    switch (report?.status) {
      case ReportStatusEnum.DONE:
        return (
          <Alert variant={'success'}>
            <div className="flex items-center gap-2">
              <Siren className="size-4" />
              <div className="flex flex-col">
                <AlertTitle className="flex items-center gap-2">
                  <span className="p-0.5 px-2 rounded-lg border border-green-300 bg-green-400 text-white">
                    {t('report.status.done', 'Done')}
                  </span>
                  <span className="font-bold uppercase text-xs">{t('report.status.label', 'status')}</span>
                </AlertTitle>
                <AlertDescription>
                  {t('report.status.note', 'Note')}: {report?.resultNote || t('report.status.noNote', 'No note provided by the admin')}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )
      case ReportStatusEnum.PENDING:
        return (
          <Alert variant={'warning'}>
            <div className="flex items-center gap-2">
              <Siren className="size-4" />
              <div className="flex flex-col">
                <AlertTitle className="flex items-center gap-2">
                  <span className="p-0.5 px-2 rounded-lg border border-yellow-300 bg-yellow-400 text-white">
                    {t('report.status.pending', 'Pending')}
                  </span>
                  <span className="font-bold uppercase text-xs">{t('report.status.label', 'status')}</span>
                </AlertTitle>
                <AlertDescription>
                  {t('report.status.pendingDescription', 'This report will be reviewed soon by the admin. You will be notified once the review is done.')}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )
      case ReportStatusEnum.IN_PROCESSING:
        return (
          <Alert variant={'information'}>
            <div className="flex items-center gap-2">
              <Siren className="size-4" />
              <div className="flex flex-col">
                <AlertTitle className="flex items-center gap-2">
                  <span className="p-0.5 px-2 rounded-lg border border-blue-300 bg-blue-400 text-white">
                    {t('report.status.inProcessing', 'In Processing')}
                  </span>
                  <span className="font-bold uppercase text-xs">{t('report.status.label', 'status')}</span>
                </AlertTitle>
                <AlertDescription>{t('report.status.inProcessingDescription', 'This report is currently in processing')}</AlertDescription>
              </div>
            </div>
          </Alert>
        )
      case ReportStatusEnum.CANCELLED:
        return (
          <Alert variant={'destructive'}>
            <div className="flex items-center gap-2">
              <Siren className="size-4" />
              <div className="flex flex-col">
                <AlertTitle className="flex items-center gap-2">
                  <span className="p-0.5 px-2 rounded-lg border border-red-300 bg-red-400  text-white">
                    {t('report.status.cancelled', 'Canceled')}
                  </span>
                  <span className="font-bold uppercase text-xs">{t('report.status.label', 'status')}</span>
                </AlertTitle>
                <AlertDescription>
                  {t('report.status.note', 'Note')}: {report?.resultNote || t('report.status.noNote', 'No note provided by the admin')}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )
      default:
        return null
    }
  }
  return (
    <>
      {getHeader()}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex-col gap-8 flex">
          <div className="gap-4 flex w-full flex-col">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel required>{t('report.form.typeLabel', 'Type Of Report')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('report.form.typePlaceholder', 'Select type of report')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ReportTypeEnum).map((item) => (
                        <SelectItem key={item} value={ReportTypeEnum[item]}>
                          {t(`report.type.${item.toLowerCase()}`, item.replace(/_/g, ' '))}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch('type') === ReportTypeEnum.ORDER && (
              <FormField
                control={form.control}
                shouldUnregister
                name="orderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>{t('report.form.orderLabel', 'Report For Order')}</FormLabel>
                    <SelectOrder {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {form.watch('type') === ReportTypeEnum.BOOKING && (
              <FormField
                control={form.control}
                shouldUnregister
                name="bookingId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>{t('report.form.bookingLabel', 'Report For Booking')}</FormLabel>
                    <SelectBooking {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel required>{t('report.form.reasonLabel', 'Reason Of Report')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('report.form.reasonPlaceholder', 'Select reason for reporting')}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {reasonOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.watch('reason') === 'OTHER' && (
              <FormField
                control={form.control}
                name="customReason"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel required>{t('report.form.otherReasonLabel', 'Other Reason')}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t('report.form.otherReasonPlaceholder', 'Please explain your reason for reporting in detail...')}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="files"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-col sm:col-span-2 col-span-1">
                    <FormLabel required>{t('report.form.evidenceLabel', 'Evidence For Report')}</FormLabel>
                    <UploadFiles
                      triggerRef={triggerRef}
                      form={form}
                      field={field}
                      dropZoneConfigOptions={{
                        maxFiles: 6,
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>
          {!viewOnly && (
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/70 text-white"
              loading={form.formState.isSubmitting}
            >
              {t('common.submit', 'Submit')}
            </Button>
          )}
        </form>
      </Form>
    </>
  )
}

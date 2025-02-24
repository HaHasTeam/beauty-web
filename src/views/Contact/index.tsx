import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Home, Mail, Phone } from 'lucide-react'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import DottedShape from '@/assets/images/dotted-shape.png'
import QuarterCircle from '@/assets/images/quarter-circle.png'
import Label from '@/components/form-label'
import LoadingLayer from '@/components/loading-icon/LoadingLayer'
import { PhoneInputWithCountries } from '@/components/phone-input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { contactUsApi } from '@/network/apis/contact'
import { getContactUsSchema } from '@/schemas/contact.schema'
import { ProjectInformationEnum } from '@/types/project'

export default function Contact() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const id = useId()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const ContactUsSchema = getContactUsSchema()

  const defaultValues = {
    fullName: '',
    phoneNumber: '',
    message: '',
    email: '',
  }
  const form = useForm<z.infer<typeof ContactUsSchema>>({
    resolver: zodResolver(ContactUsSchema),
    defaultValues,
  })
  const handleReset = () => {
    form.reset()
  }
  const { mutateAsync: contactUsFn } = useMutation({
    mutationKey: [contactUsApi.mutationKey],
    mutationFn: contactUsApi.fn,
    onSuccess: () => {
      successToast({
        message: `${t('contact.sendSuccess')}`,
      })
      handleReset()
    },
  })
  async function onSubmit(values: z.infer<typeof ContactUsSchema>) {
    try {
      setIsLoading(true)
      await contactUsFn(values)
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
    <>
      {isLoading && <LoadingLayer />}
      <div className=" min-h-[100dvh] flex items-center rounded-xl">
        <div className="rounded-lg flex bg-white flex-col items-center justify-center md:flex-row max-w-6xl mx-auto my-auto p-6 ">
          <div className=" md:w-1/2 pr-8 mb-10 md:mb-0">
            <h3 className="text-primary mb-2 font-bold">{t('contact.contactUs')}</h3>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">{t('contact.getInTouch')}</h2>
            <p className="text-gray-600 mb-8">{t('contact.description')}</p>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Home className="text-primary " />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{t('contact.location')}</h4>
                  <p className="text-gray-600">{ProjectInformationEnum.address}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 ">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Phone className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{t('contact.phone')}</h4>
                  <p className="text-gray-600">{ProjectInformationEnum.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Mail className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{t('contact.email')}</h4>
                  <p className="text-gray-600">{ProjectInformationEnum.email}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-5/6 md:w-1/2 mt-8 mb-10 md:mb-10 mr-2 md:mr-0">
            <div className="relative">
              <img
                src={QuarterCircle}
                className="absolute -top-12 -right-16 z-10 md:-top-12 md:-right-4 mr-6 md:mr-0"
                alt="QuarterCircle"
              />
              <img
                src={DottedShape}
                className="mt-2 absolute top-16 -right-10 md:-right-4 md:top-14 z-10 mr-2 md:mr-0"
                alt="DottedShape"
              />
              <div className="z-20 md:mt-10 md:mr-10 relative bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-6 text-primary text-center">{t('contact.yourInformation')}</h3>
                <Form {...form}>
                  <form
                    noValidate
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-4"
                    id={`form-${id}`}
                  >
                    <div>
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <div className="w-full flex gap-2">
                              <div className="w-1/5 flex items-center">
                                <Label required className="block text-sm font-medium text-gray-700 mb-1">
                                  {t('contact.fullName')}
                                </Label>
                              </div>
                              <div className="w-full space-y-1">
                                <FormControl>
                                  <Input
                                    id="fullName"
                                    placeholder={t('contact.fullNamePlaceholder')}
                                    className="focus:border-primary"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <div className="w-full flex gap-2">
                              <div className="w-1/5 flex items-center">
                                <Label required className="block text-sm font-medium text-gray-700 mb-1">
                                  {t('contact.email')}
                                </Label>
                              </div>
                              <div className="w-full space-y-1">
                                <FormControl>
                                  <Input
                                    id="email"
                                    type="email"
                                    placeholder={t('contact.emailPlaceholder')}
                                    className="focus:border-primary"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <div className="w-full flex gap-2">
                              <div className="w-1/5 flex items-center">
                                <Label required className="block text-sm font-medium text-gray-700 mb-1">
                                  {t('contact.phone')}
                                </Label>
                              </div>
                              <div className="w-full space-y-1">
                                <FormControl>
                                  <PhoneInputWithCountries {...field} isShowCountry={false} />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <div className="w-full flex gap-2">
                              <div className="w-1/5 flex items-start">
                                <Label required className="block text-sm font-medium text-gray-700 mb-1">
                                  {t('contact.message')}
                                </Label>
                              </div>
                              <div className="w-full space-y-1">
                                <FormControl>
                                  <Textarea
                                    id="message"
                                    placeholder={t('contact.messagePlaceholder')}
                                    rows={4}
                                    className="focus:border-primary"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      form={`form-${id}`}
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                    >
                      {t('contact.sendMessage')}
                    </Button>
                  </form>
                </Form>
              </div>
              <img src={DottedShape} className="absolute -bottom-10 -left-10 z-10 ml-2 md:ml-0" alt="DottedShape" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

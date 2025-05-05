'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  BuildingIcon,
  CalendarIcon,
  CheckCircle2,
  MailIcon,
  Pen,
  PhoneIcon,
  SaveIcon,
  User2,
  UserIcon,
} from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as z from 'zod'

import Button from '@/components/button'
import { FlexDatePicker } from '@/components/flexible-date-picker/FlexDatePicker'
import FormLabel from '@/components/form-label'
import LoadingContentLayer from '@/components/loading-icon/LoadingContentLayer'
import { PhoneInputWithCountries } from '@/components/phone-input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { defaultRequiredRegex, emailRegex, longRequiredRegex, phoneRegex } from '@/constants/regex'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { uploadFilesApi } from '@/network/apis/file'
import { getUserProfileApi, updateProfileApi } from '@/network/apis/user'
import { FileStatusEnum } from '@/types/file'
import { type TUser, UserGenderEnum } from '@/types/user'

import { convertFormIntoProfile, convertProfileIntoForm } from './helper'

const getFormSchema = () => {
  return z.object({
    firstName: z.string().regex(longRequiredRegex.pattern, longRequiredRegex.message()),
    lastName: z.string().regex(longRequiredRegex.pattern, longRequiredRegex.message()),
    username: z.string().regex(longRequiredRegex.pattern, longRequiredRegex.message()),
    email: z
      .string()
      .regex(longRequiredRegex.pattern, longRequiredRegex.message())
      .regex(emailRegex.pattern, emailRegex.message()),
    gender: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message()),
    phone: z
      .string()
      .regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message())
      .refine(phoneRegex.pattern, phoneRegex.message()),
    dob: z.string().regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message()),
    avatar: z
      .array(
        z.object({
          fileUrl: z.string().optional(),
          name: z.string().optional(),
          id: z.string().optional(),
          status: z.nativeEnum(FileStatusEnum).optional(),
          file: z.instanceof(File).optional(),
        }),
      )
      .optional()
      .default([]),
  })
}
const ProfileDetails = () => {
  const id = useId()
  const formSchema = getFormSchema()
  const { t } = useTranslation()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      dob: '',
      gender: '',
      avatar: [],
    },
  })
  const handleServerError = useHandleServerError()
  const queryClient = useQueryClient()
  const { successToast } = useToast()
  const { isFetching: isGettingUserProfile, data: userProfileData } = useQuery({
    queryKey: [getUserProfileApi.queryKey],
    queryFn: getUserProfileApi.fn,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationKey: [updateProfileApi.mutationKey],
    mutationFn: updateProfileApi.fn,
    onSuccess: () => {
      successToast({
        message: t('profile.updateSuccess'),
      })
    },
  })

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

  useEffect(() => {
    if (userProfileData?.data) {
      const userData = userProfileData.data as unknown as TUser
      const formData = convertProfileIntoForm(userData)
      console.log('formData', formData)

      form.reset({
        ...formData,
        avatar: userData.avatar
          ? [
              {
                fileUrl: userData.avatar,
                name: 'avatar',
                id: userData.avatar,
                status: FileStatusEnum.ACTIVE,
              },
            ]
          : [],
      })
    }
  }, [userProfileData?.data, form])

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files
      if (!files || files.length === 0) return

      // Store the file in the form without uploading it yet
      // Just create a temporary URL for preview
      const tempUrl = URL.createObjectURL(files[0])

      form.setValue('avatar', [
        {
          name: files[0].name,
          fileUrl: tempUrl,
          status: FileStatusEnum.ACTIVE,
          // Store the actual file for later upload
          file: files[0],
        },
      ])
    } catch (error) {
      handleServerError({
        error,
        form,
      })
    } finally {
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Get the current values from the form
      values = form.getValues()

      // Check if there's a new file to upload
      const avatarData = values.avatar[0]
      if (avatarData && avatarData.file) {
        // Upload the file using convertFileToUrl
        const uploadedUrls = await convertFileToUrl([avatarData.file as File])

        // Update the avatar with the real URL from the server
        if (uploadedUrls && uploadedUrls.length > 0) {
          form.setValue('avatar', [
            {
              name: avatarData.name,
              fileUrl: uploadedUrls[0],
              status: FileStatusEnum.ACTIVE,
            },
          ])

          // Get the updated values after setting the new URL
          values = form.getValues()
        }
      }

      // Continue with the existing profile update logic
      const updateData = convertFormIntoProfile({
        ...values,
        avatar: values.avatar[0]?.fileUrl,
      })
      await updateProfileFn(updateData)

      queryClient.invalidateQueries({
        queryKey: [getUserProfileApi.queryKey],
      })
    } catch (error) {
      handleServerError({
        error,
        form,
      })
    }
  }

  const getFullName = () => {
    const firstName = form.watch('firstName') || ''
    const lastName = form.watch('lastName') || ''
    return `${firstName} ${lastName}`.trim() || 'Your Profile'
  }

  const getAvatarUrl = () => {
    const avatar = form.watch('avatar')

    return avatar && avatar[0]?.fileUrl ? avatar[0].fileUrl : '/placeholder.svg'
  }
  const imageUrl = getAvatarUrl()
  console.log('imageUrl', imageUrl)

  return (
    <div className="container px-4 mx-auto max-w-6xl py-4">
      {isGettingUserProfile && <LoadingContentLayer />}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <User2 className="h-5 w-5" />
                {t('profile.personalInformation')}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{t('profile.updateInfo')}</p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="w-full" id={`form-${id}`}>
                  <div className="space-y-6">
                    {/* <FormField
                      control={form.control}
                      name="avatar"
                      render={({ field }) => (
                        <FormItem className="bg-muted/30 p-6 rounded-lg border border-dashed">
                          <div>
                            <FormLabel required className="mb-1 block">
                              {t('profile.profilePicture')}
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              {t('fileUpload.acceptedFormats')} ({t('fileUpload.maxSize')})
                            </p>
                          </div>

                          <FormControl>
                            <UploadFiles
                              triggerRef={triggerRef}
                              dropZoneConfigOptions={{
                                maxFiles: 1,
                                accept: {
                                  'image/*': ['.png', '.jpg', '.jpeg'],
                                },
                              }}
                              field={{
                                value: field.value as TFile[],
                                onChange: field.onChange,
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>{t('profile.firstName')}</FormLabel>
                            <FormControl>
                              <Input placeholder={t('profile.firstNamePlaceholder')} {...field} className="bg-muted" />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>{t('profile.lastName')}</FormLabel>
                            <FormControl>
                              <Input placeholder={t('profile.lastNamePlaceholder')} {...field} className="bg-muted" />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>{t('profile.username')}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('profile.usernamePlaceholder')}
                              {...field}
                              className="bg-muted"
                              disabled
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground mt-1">{t('profile.usernameDesc')}</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>{t('profile.email')}</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                placeholder={t('profile.emailPlaceholder')}
                                {...field}
                                disabled
                                className="bg-muted pr-10"
                              />
                            </FormControl>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{t('profile.emailVerified')}</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>{t('profile.gender')}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background">
                                  <SelectValue placeholder={t('profile.selectGender')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={UserGenderEnum.MALE}>{t('profile.male')}</SelectItem>
                                <SelectItem value={UserGenderEnum.FEMALE}>{t('profile.female')}</SelectItem>
                                <SelectItem value={UserGenderEnum.OTHER}>{t('profile.other')}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel required>{t('profile.phone')}</FormLabel>
                            <FormControl>
                              <PhoneInputWithCountries
                                {...field}
                                className="bg-background"
                                placeholder={t('profile.phonePlaceholder')}
                                isShowCountry={false}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>{t('profile.dob')}</FormLabel>
                          <FormControl>
                            <FlexDatePicker
                              field={field}
                              onlyPastDates
                              label={t('profile.selectDob')}
                              className="bg-background"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              className="flex gap-2 items-center"
              form={`form-${id}`}
              loading={form.formState.isSubmitting ? true : undefined}
              size="lg"
            >
              <SaveIcon className="h-4 w-4" />
              {t('profile.saveProfile')}
            </Button>
          </div>
        </div>
        <div className="lg:w-1/3">
          <Card className="sticky top-20">
            <CardHeader className="pb-4 flex flex-col items-center">
              <div className="relative">
                <div className=" h-32 w-32 rounded-full overflow-hidden mb-4 border-4 border-primary/10 shadow-lg">
                  <Avatar className="w-full h-full border-2 border-white">
                    <AvatarImage src={imageUrl || undefined} alt={getFullName() || 'User'} />
                    <AvatarFallback className="bg-white text-primary font-bold">
                      {getFullName().charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    title="Upload your profile picture"
                  />
                </div>
                <div
                  className="absolute right-2 bottom-5 border bg-white rounded-full p-1 shadow-md cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Pen className="w-5 h-5" />
                </div>
              </div>
              <CardTitle className="text-center text-2xl font-bold">{getFullName()}</CardTitle>
              <p className="text-muted-foreground text-center">{form.watch('username') || 'username'}</p>

              {form.watch('email') && (
                <div className="flex items-center gap-2 mt-4">
                  <MailIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{form.watch('email')}</span>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
              )}
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <UserIcon className="text-primary h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium">{t('profile.gender')}</p>
                    <p className="text-sm text-muted-foreground">
                      {form.watch('gender') === UserGenderEnum.MALE
                        ? t('profile.male')
                        : form.watch('gender') === UserGenderEnum.FEMALE
                          ? t('profile.female')
                          : form.watch('gender') === UserGenderEnum.OTHER
                            ? t('profile.other')
                            : t('profile.notSpecified')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <PhoneIcon className="text-primary h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium">{t('profile.phone')}</p>
                    <p className="text-sm text-muted-foreground">{form.watch('phone') || t('profile.notProvided')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarIcon className="text-primary h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium">{t('profile.dob')}</p>
                    <p className="text-sm text-muted-foreground">{form.watch('dob') || t('profile.notProvided')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <BuildingIcon className="text-primary h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium">{t('profile.accountStatus')}</p>
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 mt-1">
                      {t('profile.active')}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProfileDetails

import {} from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import Label from '@/components/form-label'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import CreateAddressSchema from '@/schemas/address.schema'
import { AddressEnum } from '@/types/enum'

import { PhoneInputWithCountries } from '../phone-input'
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Textarea } from '../ui/textarea'

interface FormAddressContentProps {
  form: UseFormReturn<z.infer<typeof CreateAddressSchema>>
}
export default function FormAddressContent({ form }: FormAddressContentProps) {
  const { t } = useTranslation()

  return (
    <div className="w-full py-2">
      <div className="space-y-6">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="w-full flex gap-2">
                  <div className="w-1/5 flex items-center">
                    <Label htmlFor="fullName" required className="w-fit">
                      {t('address.fullName')}
                    </Label>
                  </div>
                  <div className="w-full space-y-1">
                    <FormControl>
                      <Input
                        id="fullName"
                        placeholder={t('address.enterFullName')}
                        className="border-primary/40"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="w-full flex items-center gap-2">
                  <div className="w-1/5 flex items-center">
                    <Label htmlFor="phoneNumber" required>
                      {t('address.phone')}
                    </Label>
                  </div>
                  <div className="w-full space-y-1">
                    <FormControl>
                      <PhoneInputWithCountries {...field} isShowCountry={false} />
                      {/* <Input
                        id="phoneNumber"
                        placeholder={t('address.enterPhone')}
                        className="border-primary/40"
                        {...field}
                        value={field.value ?? ''}
                      /> */}
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="w-full flex gap-2">
                  <div className="w-1/5 flex items-center">
                    <Label htmlFor="province" required>
                      {t('address.provinceOrCity')}
                    </Label>
                  </div>
                  <div className="w-full space-y-1">
                    <FormControl>
                      <Select>
                        <SelectTrigger>
                          <SelectValue {...field} placeholder={t('address.chooseProvinceOrCity')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hcm">Hồ Chí Minh</SelectItem>
                          <SelectItem value="hn">HN</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="w-full flex gap-2">
                  <div className="w-[15%] flex items-center">
                    <Label htmlFor="district" required>
                      {t('address.district')}
                    </Label>
                  </div>
                  <div className="w-full space-y-1">
                    <FormControl>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={t('address.chooseDistrict')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem {...field} value={field.value ?? ''}>
                            {field?.value}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ward"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="w-full flex gap-2">
                  <div className="w-[15%] flex items-center">
                    <Label htmlFor="ward" required>
                      {t('address.ward')}
                    </Label>
                  </div>
                  <div className="w-full space-y-1">
                    <FormControl>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={t('address.chooseWard')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem {...field} value={field.value ?? ''}>
                            {field?.value}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="detailAddress"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="w-full flex items-start gap-2">
                  <div className="w-1/5 flex items-center">
                    <Label htmlFor="detailAddress" required>
                      {t('address.detailAddress')}
                    </Label>
                  </div>
                  <div className="w-full space-y-1">
                    <FormControl>
                      <Textarea
                        id="detailAddress"
                        placeholder={t('address.enterDetailAddress')}
                        className="border-primary/40"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="detailAddress"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="w-full flex gap-2">
                  <div className="w-1/5 flex items-center">
                    <Label required>{t('address.addressType')}</Label>
                  </div>
                  <div className="w-full space-y-1">
                    <FormControl className="flex gap-3">
                      <RadioGroup>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={AddressEnum.HOME} id={AddressEnum.HOME} />
                          <Label
                            htmlFor={AddressEnum.HOME}
                            className={`px-4 py-2 rounded border cursor-pointer ${
                              field.value === AddressEnum.HOME ? 'border-red-500 text-red-500' : 'border-gray-200'
                            }`}
                          >
                            {t('address.addressTypeValueHome', { type: AddressEnum.HOME })}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={AddressEnum.OFFICE} id={AddressEnum.OFFICE} />
                          <Label
                            htmlFor={AddressEnum.OFFICE}
                            className={`px-4 py-2 rounded border cursor-pointer ${
                              field.value === AddressEnum.OFFICE ? 'border-red-500 text-red-500' : 'border-gray-200'
                            }`}
                          >
                            {t('address.addressTypeValueOffice', { type: AddressEnum.OFFICE })}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={AddressEnum.OTHER} id={AddressEnum.OTHER} />
                          <Label
                            htmlFor={AddressEnum.OTHER}
                            className={`px-4 py-2 rounded border cursor-pointer ${
                              field.value === AddressEnum.OTHER ? 'border-red-500 text-red-500' : 'border-gray-200'
                            }`}
                          >
                            {t('address.addressTypeValueOther', { type: AddressEnum.OTHER })}
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="w-full">
              <div className="w-full flex gap-2">
                <div className="w-full space-y-1">
                  <FormControl className="flex gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="default" {...field} value={field?.value ?? ''} />
                      <Label
                        htmlFor="default"
                        className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t('address.setAsDefault')}
                      </Label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

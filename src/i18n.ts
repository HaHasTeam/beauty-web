import i18n from 'i18next'
import detector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'
import intervalPlural from 'i18next-intervalplural-postprocessor'
import moment from 'moment'
import { initReactI18next } from 'react-i18next'

export const supportedLngs = ['en', 'vi']

i18n
  .use(HttpApi)
  .use(detector)
  .use(initReactI18next)
  .use(intervalPlural)
  .init({
    supportedLngs,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    ns: ['layout', 'common'],
    defaultNS: 'layout',
    fallbackLng: ['vi'],
    lng: 'vi',
    interpolation: {
      escapeValue: false,
      format: (value, format, lng) => {
        if (value instanceof Date) {
          const dateValue = value instanceof Date ? value : new Date(value)
          // eslint-disable-next-line import/no-named-as-default-member
          return moment(dateValue).format(format || 'DD/MM/YYYY HH:mm:ss')
        }

        if (format === 'currency') {
          const currency = lng === 'vi' ? 'VND' : 'VND' // Don't change currency per language

          if (currency === 'VND') {
            // Vietnamese currency format: 10.000.000 đ (no decimals, dot as thousands separator, đ as suffix)
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0,
              currencyDisplay: 'symbol',
            }).format(value)
          }

          return Intl.NumberFormat('vi', { style: 'currency', currency }).format(value)
        }
        return value
      },
    },
  })

export default i18n

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
    ns: ['layout'],
    defaultNS: 'layout',
    fallbackLng: ['vi'],
    lng: 'vi',
    interpolation: {
      escapeValue: false,
      format: (value, format, lng) => {
        if (value instanceof Date) {
          const dateValue = value instanceof Date ? value : new Date(value)
          return moment(dateValue).format(format || 'DD/MM/YYYY')
        }

        if (format === 'currency') {
          const currency = lng === 'vi' ? 'VND' : 'VND' // Don't change currency per language
          return Intl.NumberFormat('vi', { style: 'currency', currency }).format(value)
        }
        return value
      },
    },
  })

export default i18n

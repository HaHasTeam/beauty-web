import { useTranslation } from 'react-i18next'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const supportedLngs = i18n.options.supportedLngs || []

  return (
    <div className="flex space-x-2">
      {supportedLngs.map((lng) => (
        <button
          key={lng}
          className={`px-4 py-2 rounded ${
            i18n.resolvedLanguage === lng ? 'font-bold bg-blue-500 text-white' : 'font-normal bg-gray-200 text-gray-800'
          }`}
          type="button"
          onClick={() => i18n.changeLanguage(lng)}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher

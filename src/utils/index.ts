export function formatDate(date: Date | string | number, region?: string, opts: Intl.DateTimeFormatOptions = {}) {
  const intl = region ? region : 'en-US'
  return new Intl.DateTimeFormat(intl, {
    day: opts.day ?? 'numeric',
    month: opts.month ?? 'long',
    year: opts.year ?? 'numeric',
    ...opts,
  }).format(new Date(date))
}

export default function getBrowserAndOS() {
  const userAgent = navigator.userAgent
  let browser, os

  // Detect browser
  if (userAgent.includes('Edg')) {
    browser = 'Microsoft Edge'
  } else if (userAgent.includes('Chrome')) {
    browser = 'Google Chrome'
  } else if (userAgent.includes('Firefox')) {
    browser = 'Mozilla Firefox'
  } else if (userAgent.includes('Safari')) {
    browser = 'Apple Safari'
  } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
    browser = 'Internet Explorer'
  } else {
    browser = 'Unknown Browser'
  }

  // Detect OS
  if (userAgent.indexOf('Win') > -1) {
    os = 'Windows'
  } else if (userAgent.indexOf('Mac') > -1) {
    os = 'MacOS'
  } else if (userAgent.indexOf('X11') > -1 || userAgent.indexOf('Linux') > -1) {
    os = 'Linux'
  } else if (userAgent.indexOf('Android') > -1) {
    os = 'Android'
  } else if (userAgent.indexOf('like Mac') > -1) {
    os = 'iOS'
  } else {
    os = 'Unknown OS'
  }

  return {
    browser: browser,
    os: os,
  }
}

export function formatDate(date: Date | string | number, region?: string, opts: Intl.DateTimeFormatOptions = {}) {
  const intl = region ? region : 'en-US'
  return new Intl.DateTimeFormat(intl, {
    day: opts.day ?? 'numeric',
    month: opts.month ?? 'long',
    year: opts.year ?? 'numeric',
    ...opts,
  }).format(new Date(date))
}

export function formatDate(date: Date | string | number, opts: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat('en-US', {
    day: opts.day ?? 'numeric',
    month: opts.month ?? 'long',
    year: opts.year ?? 'numeric',
    ...opts,
  }).format(new Date(date))
}

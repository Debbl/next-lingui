import { cache } from 'react'
import type { LinguiConfig } from '../../shared/types'

function getFormatterCachedImpl(config: LinguiConfig) {
  const locale = config.locale

  return {
    dateTime: (date: Date | number, options?: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(locale, options).format(date),
    number: (value: number, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, options).format(value),
    relativeTime: (
      value: number,
      unit: Intl.RelativeTimeFormatUnit,
      options?: Intl.RelativeTimeFormatOptions,
    ) => new Intl.RelativeTimeFormat(locale, options).format(value, unit),
    dateTimeRange: (
      startDate: Date | number,
      endDate: Date | number,
      options?: Intl.DateTimeFormatOptions,
    ) =>
      new Intl.DateTimeFormat(locale, options).formatRange(startDate, endDate),
    list: (list: Array<string>, options?: Intl.ListFormatOptions) =>
      new Intl.ListFormat(locale, options).format(list),
  }
}
const getFormatterCached = cache(getFormatterCachedImpl)

export default getFormatterCached

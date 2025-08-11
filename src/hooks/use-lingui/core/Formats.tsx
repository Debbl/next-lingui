import type DateTimeFormatOptions from './DateTimeFormatOptions.js'
import type NumberFormatOptions from './NumberFormatOptions.js'

interface Formats {
  number?: Record<string, NumberFormatOptions>
  dateTime?: Record<string, DateTimeFormatOptions>
  list?: Record<string, Intl.ListFormatOptions>
}

export default Formats

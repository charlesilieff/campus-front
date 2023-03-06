import dayjs from 'dayjs'
import * as React from 'react'

export interface IDurationFormat {
  value: string
  blankOnInvalid?: boolean
  locale?: string
}

export const DurationFormat = ({ value, blankOnInvalid, locale }: IDurationFormat) => {
  if (blankOnInvalid && !value) {
    return null
  }

  if (!locale) {
    locale = 'fr'
  }

  return (
    <span title={value}>
      {dayjs
        .duration(value)
        .locale(locale || 'en')
        .humanize()}
    </span>
  )
}

import 'numeral/locales'

import dayjs from 'dayjs'
import numeral from 'numeral'
import React from 'react'

export type ITextFormatTypes = 'date' | 'number'

export interface ITextFormatProps {
  value: string | number | Date
  type: ITextFormatTypes
  format?: string
  blankOnInvalid?: boolean
}

/**
 * Formats the given value to specified type like date or number.
 * @param value value to be formatted
 * @param type type of formatting to use ${ITextFormatTypes}
 * @param format optional format to use.
 *    For date type dayjs(https://day.js.org/docs/en/display/format) format is used
 *    For number type NumeralJS (http://numeraljs.com/#format) format is used
 * @param blankOnInvalid optional to output error or blank on null/invalid values
 */
export const TextFormat = ({ value, type, format, blankOnInvalid }: ITextFormatProps) => {
  if (blankOnInvalid) {
    if (!value || !type) return null
  }

  if (type === 'date') {
    return (
      <span>
        {dayjs(value).format(format)}
      </span>
    )
  } else if (type === 'number') {
    return <span>{numeral(value).format(format)}</span>
  }
  return <span>{value.toString()}</span>
}
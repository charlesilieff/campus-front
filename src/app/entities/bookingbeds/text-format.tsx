import 'numeral/locales'

import dayjs from 'dayjs'
import { Option as O } from 'effect'
import { pipe } from 'effect'
import numeral from 'numeral'
import React from 'react'

export type ITextFormatTypes = 'date' | 'number'

export interface ITextFormatProps {
  value: O.Option<string | number | Date>
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
export const TextFormat = ({ value, type, format, blankOnInvalid }: ITextFormatProps) =>
  pipe(
    value,
    O.map(value => {
      if (blankOnInvalid) {
        if (!value || !type) return null
      }

      if (type === 'date') {
        return (
          <span key="0">
            {dayjs(value).format(format)}
          </span>
        )
      } else if (type === 'number') {
        return <span key="0">{numeral(value).format(format)}</span>
      }
      return <span key="0">{value.toString()}</span>
    }),
    O.getOrNull
  )

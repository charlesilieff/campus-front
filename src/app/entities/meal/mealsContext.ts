import type { IMeal } from 'app/shared/model/meal.model'
import { createContext } from 'react'

import type { IMealsNumber } from './IMealsNumber'

const defaultValue: IMeal[] = []

// Mise en place du contexte.
export const MealsContext = createContext<
  [IMeal[], (mealsNumber: IMealsNumber, index: number) => void]
>([
  defaultValue,
  () => {
    // This is intentional
  }
])

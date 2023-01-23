import { IMeal } from 'app/shared/model/meal.model'
import { createContext } from 'react'

import { IMealsNumber } from './IMealsNumber'

const defaultValue: IMeal[] = []

// Mise en place du contexte.
const MealsContext = createContext<[IMeal[], (mealsNumber: IMealsNumber, index: number) => void]>([
  defaultValue,
  () => {
    // This is intentional
  }
])

export default MealsContext

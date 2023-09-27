import type { IMeal } from 'app/shared/model/meal.model'
import dayjs from 'dayjs'

export type MealType =
  | 'specialLunch'
  | 'regularDinner'
  | 'specialDinner'
  | 'breakfast'
  | 'regularLunch'

export const periodCheckChecked = (
  mealType: 'breakfast' | 'dinner' | 'lunch',
  mealsData: IMeal[]
): boolean => {
  const isTooLate = (date: string | undefined) => dayjs(date).isBefore(dayjs().add(1, 'day'))
  if (mealsData.every(m => m.id === undefined)) {
    return false
  } else if (mealType === 'breakfast') {
    return mealsData.every(meal =>
      isTooLate(meal.date)
      || meal.id === undefined
      || (meal.breakfast !== null && meal.breakfast !== undefined && meal.breakfast > 0)
    )
  } else if (mealType === 'lunch') {
    return mealsData.every(meal =>
      isTooLate(meal.date)
      || meal.id === undefined
      || (meal.regularLunch !== null && meal.regularLunch !== undefined && meal.regularLunch > 0)
      || (meal.specialDinner !== null && meal.specialDinner !== undefined && meal.specialDinner > 0)
    )
  } else if (mealType === 'dinner') {
    return mealsData.every(meal =>
      isTooLate(meal.date)
      || meal.id === undefined
      || (meal.regularDinner !== null && meal.regularDinner !== undefined && meal.regularDinner > 0)
      || (meal.specialDinner !== null && meal.specialDinner !== undefined && meal.specialDinner > 0)
    )
  }
  return true
}

export interface IMealsNumber {
  id: number
  breakfast: number
  lunchtime: { specialDiet: number; classicDiet: number }
  dinner: { specialDiet: number; classicDiet: number }
  // lunchtime: number
  // dinner: number
  comment: string
}

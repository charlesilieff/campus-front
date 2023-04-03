export interface IMealsNumber {
  breakfast: number
  lunchtime: { specialDiet: number; classicDiet: number }
  dinner: { specialDiet: number; classicDiet: number }
  // lunchtime: number
  // dinner: number
  comment: string
}

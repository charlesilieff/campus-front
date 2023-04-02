export interface IMealsNumber {
  breakfast: number
  lunchtime: { specialDiet: number; classicDiet: number }
  dinner: { specialDiet: number; classicDiet: number }
  comment: string
}

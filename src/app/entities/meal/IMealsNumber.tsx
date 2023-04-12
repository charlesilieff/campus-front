export interface IMealsNumber {
  id: number
  breakfast: number
  lunchtime: { specialDiet: number; regularDiet: number }
  dinner: { specialDiet: number; regularDiet: number }
  comment: string
}

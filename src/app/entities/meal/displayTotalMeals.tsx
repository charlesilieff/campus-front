import React from 'react'
/**
 * Display total during 31 days of :
 *  - breakfast
 * - classic lunch meals
 * - classic dinner meals
 * - special lunch meals
 * - special dinner meals
 * - classic meals
 * - special meals
 * - all meals
 * @param resultTotalMeals
 */
export const DisplayTotalMeals = ({ resultTotalMeals }: { resultTotalMeals: number[] }) => (
  <div className="row">
    <div className="col-5">
      <div id="total" className="col">
        {`Total de mes petits-déjeuner: ${resultTotalMeals[7]}`}
      </div>
      <div id="total" className="col">
        {`Total repas classiques de midi: ${resultTotalMeals[0]}`}
      </div>
      <div id="total" className="col">
        {`Total repas classiques du soir: ${resultTotalMeals[1]}`}
      </div>
      <div id="total" className="col">
        {`Total repas spéciaux de midi: ${resultTotalMeals[2]}`}
      </div>
      <div id="total" className="col">
        {`Total repas spéciaux du soir: ${resultTotalMeals[3]}`}
      </div>
    </div>
    <div className="col-4">
      <div id="total" className="col">
        <br />
      </div>
      <div id="total" className="col">
        {`Total repas classiques: ${resultTotalMeals[4]}`}
      </div>
      <div id="total" className="col">
        <br />
      </div>
      <div id="total" className="col">
        {`Total repas spéciaux: ${resultTotalMeals[5]}`}
      </div>
    </div>
    <div className="col-4">
      <div id="total" className="col">
        <br />
      </div>
      <div id="total" className="col">
        <br />
      </div>
      <div id="total" className="col">
        <br />
        {' '}
      </div>
      <div id="total" className="col">
        {`Total repas: ${resultTotalMeals[6]}`}
      </div>
    </div>
  </div>
)

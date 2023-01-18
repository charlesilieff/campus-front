import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IMeal } from 'app/shared/model/meal.model'
import dayjs, { Dayjs } from 'dayjs'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { IMealsNumber } from './IMealsNumber'
import MealContext from './mealsContext'

interface IProps {
  positionX: number
  date: Dayjs
  index: number
  isButtonPressed: () => void
}

export const Day = ({ positionX, date, index, isButtonPressed: isButtonPressed }: IProps) => {
  const dayWeek = date.day()
  const dayMonth = date.date()

  const defaultValue: IMealsNumber = {
    lunchtime: { specialDiet: 0, classicDiet: 0 },
    dinner: { specialDiet: 0, classicDiet: 0 },
    comment: ''
  }

  const [mealsContext, setMealsContext] = useContext(MealContext)

  const [commentPopup, setCommentPopup] = useState('')

  const [mealsNumber, setMealsNumber] = useState(defaultValue)

  const [mealsNumberReferential, setMealsNumberReferential] = useState(defaultValue)

  let style: React.CSSProperties
  style = commentStyle(positionX, date, mealsContext, index)
  useEffect(() => {
    style = commentStyle(positionX, date, mealsContext, index)
  }, [mealsContext])

  useEffect(() => {
    const mealsToCookFromDb: IMealsNumber = {
      lunchtime: {
        specialDiet: mealsContext[index]?.specialLunchToCook,
        classicDiet: mealsContext[index]?.regularLunchToCook
      },
      dinner: {
        specialDiet: mealsContext[index]?.specialDinnerToCook,
        classicDiet: mealsContext[index]?.regularDinnerToCook
      },
      comment: mealsContext[index]?.comment
    }

    setCommentPopup(mealsContext[index]?.comment)

    const mealsReferentialFromDb: IMealsNumber = {
      lunchtime: {
        specialDiet: mealsContext[index]?.specialLunch,
        classicDiet: mealsContext[index]?.regularLunch
      },
      dinner: {
        specialDiet: mealsContext[index]?.specialDinner,
        classicDiet: mealsContext[index]?.regularDinner
      },
      comment: mealsContext[index]?.comment
    }
    setMealsNumberReferential(mealsReferentialFromDb)

    const theNewMealsNumber = {
      lunchtime: {
        specialDiet:
          mealsToCookFromDb.lunchtime.specialDiet - mealsReferentialFromDb.lunchtime.specialDiet
              === 0 ?
            mealsReferentialFromDb.lunchtime.specialDiet :
            mealsToCookFromDb.lunchtime.specialDiet,

        classicDiet:
          mealsToCookFromDb.lunchtime.classicDiet - mealsReferentialFromDb.lunchtime.classicDiet
              === 0 ?
            mealsReferentialFromDb.lunchtime.classicDiet :
            mealsToCookFromDb.lunchtime.classicDiet
      },
      dinner: {
        specialDiet:
          mealsToCookFromDb.dinner.specialDiet - mealsReferentialFromDb.dinner.specialDiet === 0 ?
            mealsReferentialFromDb.dinner.specialDiet :
            mealsToCookFromDb.dinner.specialDiet,

        classicDiet:
          mealsToCookFromDb.dinner.classicDiet - mealsReferentialFromDb.dinner.classicDiet === 0 ?
            mealsReferentialFromDb.dinner.classicDiet :
            mealsToCookFromDb.dinner.classicDiet
      },
      comment: mealsContext[index]?.comment
    }

    setMealsNumber(theNewMealsNumber)
  }, [mealsContext])

  /**
   * Increment and decrement counter.
   * @param plusMinus : 'plus' or 'minus'
   * @param time : 'lunchtime' or 'dinner'
   * @param diet : 'specialDiet' or 'classicDiet'
   */
  const counterNumber = (
    plusMinus: 'plus' | 'minus',
    time: 'lunchtime' | 'dinner',
    diet: 'specialDiet' | 'classicDiet'
  ) => {
    const newMealsNumber: IMealsNumber = {
      lunchtime: {
        specialDiet: mealsNumber.lunchtime.specialDiet,
        classicDiet: mealsNumber.lunchtime.classicDiet
      },
      dinner: {
        specialDiet: mealsNumber.dinner.specialDiet,
        classicDiet: mealsNumber.dinner.classicDiet
      },
      comment: mealsNumber?.comment
    }

    isButtonPressed()

    if (diet === 'specialDiet') {
      if (time === 'lunchtime') {
        if (plusMinus === 'minus' && newMealsNumber.lunchtime.specialDiet > 0) {
          newMealsNumber.lunchtime.specialDiet = newMealsNumber.lunchtime.specialDiet - 1
        } else if (plusMinus === 'plus') {
          newMealsNumber.lunchtime.specialDiet = newMealsNumber.lunchtime.specialDiet + 1
        }
      } else {
        if (plusMinus === 'minus' && newMealsNumber.dinner.specialDiet > 0) {
          newMealsNumber.dinner.specialDiet = newMealsNumber.dinner.specialDiet - 1
        } else if (plusMinus === 'plus') {
          newMealsNumber.dinner.specialDiet = newMealsNumber.dinner.specialDiet + 1
        }
      }
    } else {
      if (time === 'lunchtime') {
        if (plusMinus === 'minus' && newMealsNumber.lunchtime.classicDiet > 0) {
          newMealsNumber.lunchtime.classicDiet = newMealsNumber.lunchtime.classicDiet - 1
        }
        if (plusMinus === 'plus') {
          newMealsNumber.lunchtime.classicDiet = newMealsNumber.lunchtime.classicDiet + 1
        }
      } else {
        if (plusMinus === 'minus' && newMealsNumber.dinner.classicDiet > 0) {
          newMealsNumber.dinner.classicDiet = newMealsNumber.dinner.classicDiet - 1
        }
        if (plusMinus === 'plus') {
          newMealsNumber.dinner.classicDiet = newMealsNumber.dinner.classicDiet + 1
        }
      }
    }

    setMealsNumber(newMealsNumber)
    setMealsContext(newMealsNumber, index)
  }

  const colorNumber = (time: 'lunchtime' | 'dinner', diet: 'specialDiet' | 'classicDiet') => {
    let color: string
    let referentialColor: number
    let numberToColor: number

    if (time === 'lunchtime') {
      if (diet === 'specialDiet') {
        referentialColor = mealsNumberReferential?.lunchtime.specialDiet
        numberToColor = mealsNumber?.lunchtime.specialDiet
      }
      if (diet === 'classicDiet') {
        referentialColor = mealsNumberReferential?.lunchtime.classicDiet
        numberToColor = mealsNumber?.lunchtime.classicDiet
      }
    }
    if (time === 'dinner') {
      if (diet === 'specialDiet') {
        referentialColor = mealsNumberReferential?.dinner.specialDiet
        numberToColor = mealsNumber?.dinner.specialDiet
      }
      if (diet === 'classicDiet') {
        referentialColor = mealsNumberReferential?.dinner.classicDiet
        numberToColor = mealsNumber?.dinner.classicDiet
      }
    }

    if (numberToColor > referentialColor) {
      color = 'green'
    }
    if (numberToColor < referentialColor) {
      color = 'red'
    }
    if (numberToColor === referentialColor) {
      color = 'black'
    }
    return color
  }

  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }

  const submitModalPopup = e => {
    e.preventDefault()
    const modifiedComment: IMealsNumber = {
      ...mealsNumber,
      comment: commentPopup
    }
    setMealsContext(modifiedComment, index)
    setModal(!modal)
  }

  const changeCommentPopup = (value: string) => {
    setCommentPopup(value)
    isButtonPressed()
  }

  return (
    <>
      <div className="day popup-comment" style={style} onClick={() => toggle()}>
        {date.format('ddd DD ')}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gridColumnStart: positionX,
          gridColumnEnd: positionX + 1,
          gridRowStart: 4,
          gridRowEnd: 5,
          borderLeftWidth: dayMonth === 1 ? '0.3em' : dayWeek === 1 ? '0.15em' : '0.01em',
          borderLeftStyle: dayMonth === 1 ? 'double' : dayWeek === 1 ? 'solid' : 'dashed',
          borderTopStyle: 'solid'
        } as React.CSSProperties}
      >
        <Button
          onClick={() => counterNumber('plus', 'lunchtime', 'classicDiet')}
          color="none"
          className="kitchenBtn"
        >
          <FontAwesomeIcon icon="plus-circle" size="1x" color="green" />
        </Button>
        <div
          style={{
            color: colorNumber('lunchtime', 'classicDiet')
          } as React.CSSProperties}
        >
          {mealsNumber?.lunchtime.classicDiet}
        </div>
        <Button
          onClick={() => counterNumber('minus', 'lunchtime', 'classicDiet')}
          color="none"
          className="kitchenBtn"
        >
          <FontAwesomeIcon icon="minus-circle" size="1x" color="red" />
        </Button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gridColumnStart: positionX,
          gridColumnEnd: positionX + 1,
          gridRowStart: 5,
          gridRowEnd: 6,
          borderLeftWidth: dayMonth === 1 ? '0.3em' : dayWeek === 1 ? '0.15em' : '0.01em',
          borderLeftStyle: dayMonth === 1 ? 'double' : dayWeek === 1 ? 'solid' : 'dashed',
          borderTopStyle: 'solid'
        } as React.CSSProperties}
      >
        <Button
          onClick={() => counterNumber('plus', 'lunchtime', 'specialDiet')}
          className="bouton"
          color="none"
        >
          <FontAwesomeIcon icon="plus-circle" size="1x" color="green" />
        </Button>
        <div
          style={{
            color: colorNumber('lunchtime', 'specialDiet')
          } as React.CSSProperties}
        >
          {mealsNumber?.lunchtime.specialDiet}
        </div>
        <Button
          onClick={() => counterNumber('minus', 'lunchtime', 'specialDiet')}
          color="none"
          className="kitchenBtn"
        >
          <FontAwesomeIcon icon="minus-circle" size="1x" color="red" />
        </Button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gridColumnStart: positionX,
          gridColumnEnd: positionX + 1,
          gridRowStart: 6,
          gridRowEnd: 7,
          borderLeftWidth: dayMonth === 1 ? '0.3em' : dayWeek === 1 ? '0.15em' : '0.01em',
          borderLeftStyle: dayMonth === 1 ? 'double' : dayWeek === 1 ? 'solid' : 'dashed',
          borderTopStyle: 'solid'
        } as React.CSSProperties}
      >
        <Button
          onClick={() => counterNumber('plus', 'dinner', 'classicDiet')}
          color="none"
          className="kitchenBtn"
        >
          <FontAwesomeIcon icon="plus-circle" size="1x" color="green" />
        </Button>
        <div
          style={{
            color: colorNumber('dinner', 'classicDiet')
          } as React.CSSProperties}
        >
          {mealsNumber?.dinner.classicDiet}
        </div>
        <Button
          onClick={() => counterNumber('minus', 'dinner', 'classicDiet')}
          color="none"
          className="kitchenBtn"
        >
          <FontAwesomeIcon icon="minus-circle" size="1x" color="red" />
        </Button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gridColumnStart: positionX,
          gridColumnEnd: positionX + 1,
          gridRowStart: 7,
          gridRowEnd: 8,
          borderLeftWidth: dayMonth === 1 ? '0.3em' : dayWeek === 1 ? '0.15em' : '0.01em',
          borderLeftStyle: dayMonth === 1 ? 'double' : dayWeek === 1 ? 'solid' : 'dashed',
          borderTopStyle: 'solid'
        } as React.CSSProperties}
      >
        <Button
          onClick={() => counterNumber('plus', 'dinner', 'specialDiet')}
          color="none"
          className="kitchenBtn"
        >
          <FontAwesomeIcon icon="plus-circle" size="1x" color="green" />
        </Button>
        <div
          style={{
            color: colorNumber('dinner', 'specialDiet')
          } as React.CSSProperties}
        >
          {mealsNumber?.dinner.specialDiet}
        </div>
        <Button
          onClick={() => counterNumber('minus', 'dinner', 'specialDiet')}
          color="none"
          className="kitchenBtn"
        >
          <FontAwesomeIcon icon="minus-circle" size="1x" color="red" />
        </Button>
      </div>

      {commentPopupFunction(
        modal,
        toggle,
        date,
        submitModalPopup,
        commentPopup,
        changeCommentPopup
      )}
    </>
  )
}

/**
 * Comment modal box.
 * @param modal
 * @param toggle
 * @param date
 * @param submitModalPopup
 * @param commentPopup
 * @param changeCommentPopup
 * @returns
 */
function commentPopupFunction(
  modal: boolean,
  toggle: () => void,
  date: dayjs.Dayjs,
  submitModalPopup: (e: any) => void,
  commentPopup: string,
  changeCommentPopup: (value: any) => void
) {
  return (
    <Modal isOpen={modal} toggle={toggle} className="modal-l">
      <ModalHeader toggle={toggle}>Commentaire du {dayjs(date).format('DD/MM/YYYY')} :</ModalHeader>
      <ModalBody>
        <div>
          <form onSubmit={submitModalPopup}>
            <textarea
              cols={35}
              rows={8}
              maxLength={400}
              value={commentPopup}
              onChange={e => changeCommentPopup(e.target.value)}
            />
            <br />
            <Button type="submit">Enregistrer</Button>
          </form>
        </div>
      </ModalBody>
    </Modal>
  )
}

/**
 * If comment, the background dolor is green ('#B8D8BA')
 * @param positionX
 * @param date
 * @param mealsContext
 * @param index
 * @returns
 */
function commentStyle(positionX: number, date: dayjs.Dayjs, mealsContext: IMeal[], index: number) {
  const style = {
    gridColumnStart: positionX,
    gridColumnEnd: positionX + 1,
    borderLeftWidth: '0.01em',
    backgroundColor: 'white'
  } as React.CSSProperties
  if (positionX === 8 || date.date() === 1 || date.day() === 1) {
    style.borderLeftWidth = '0.2em'
  }
  if (mealsContext[index]?.comment?.length > 0) {
    style.backgroundColor = '#B8D8BA'
  }
  return style
}

import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Td,
  Th,
  Tr,
  useDisclosure
} from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import type { IMeal } from 'app/shared/model/meal.model'
import type { IMealWithCustomer } from 'app/shared/model/mealWithCustomer.model'
import axios from 'axios'
import type { Dayjs } from 'dayjs'
import type dayjs from 'dayjs'
import React, { useContext, useEffect, useState } from 'react'

import type { IMealsNumber } from './IMealsNumber'
import { MealsContext } from './mealsContext'

interface IProps {
  positionX: number
  date: Dayjs
  index: number
}
const apiUrlMealForOneDay = 'api/meals/forOneDay'

export const Day = ({ positionX, date, index }: IProps) => {
  // const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenSpecialLunch, onOpen: onOpenSpecialLunch, onClose: onCloseSpecialLunch } =
    useDisclosure()
  const { isOpen: isOpenRegularLunch, onOpen: onOpenRegularLunch, onClose: onCloseRegularLunch } =
    useDisclosure()
  const { isOpen: isOpenRegularDiner, onOpen: onOpenRegularDiner, onClose: onCloseRegularDiner } =
    useDisclosure()
  const { isOpen: isOpenSpecialDiner, onOpen: onOpenSpecialDiner, onClose: onCloseSpecialDiner } =
    useDisclosure()
  const [mealsWithCustomerData, setMealsWithCustomerData] = useState([] as IMealWithCustomer[])

  const dayWeek = date.day()
  const dayMonth = date.date()

  const defaultValue: IMealsNumber = {
    breakfast: 0,
    lunchtime: { specialDiet: 0, classicDiet: 0 },
    dinner: { specialDiet: 0, classicDiet: 0 },
    comment: ''
  }

  const [mealsContext] = useContext(MealsContext)

  const [mealsNumber, setMealsNumber] = useState(defaultValue)

  const [mealsNumberReferential, setMealsNumberReferential] = useState(defaultValue)

  let style: React.CSSProperties
  style = commentStyle(positionX, date, mealsContext, index)
  useEffect(() => {
    style = commentStyle(positionX, date, mealsContext, index)
  }, [mealsContext])

  useEffect(() => {
    const mealsToCookFromDb: IMealsNumber = {
      breakfast: mealsContext[index]?.breakfast,
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

    const mealsReferentialFromDb: IMealsNumber = {
      breakfast: mealsContext[index]?.breakfast,
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
      breakfast: mealsToCookFromDb.breakfast - mealsReferentialFromDb.breakfast === 0 ?
        mealsReferentialFromDb.breakfast :
        mealsToCookFromDb.breakfast,
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

  const colorNumber = (
    time: 'lunchtime' | 'dinner' | 'breakfast',
    diet: 'specialDiet' | 'classicDiet'
  ) => {
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
    if (time === 'breakfast') {
      referentialColor = mealsNumberReferential?.breakfast
      numberToColor = mealsNumber?.breakfast
      color = 'green'
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

  // const dispatch = useAppDispatch()
  // const handleSyncList = (date: string) => {
  // }
  const getMeals = async (date: Dayjs) => {
    const requestUrl = `${apiUrlMealForOneDay}/${date.format('YYYY-MM-DD')}?cacheBuster=${
      new Date().getTime()
    }`

    const { data } = await axios.get<IMealWithCustomer[]>(requestUrl)

    // todo : gurun : why mealsWithCustomerData is empty????
    setMealsWithCustomerData(data)

    pipe(
      data,
      setMealsWithCustomerData
    )
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
        <div
          style={{
            color: colorNumber('dinner', 'specialDiet')
          } as React.CSSProperties}
        >
          {mealsNumber?.breakfast}
        </div>
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
          borderTopStyle: 'solid',
          borderBottomWidth: '0.01em',
          borderBottomStyle: 'solid'
        } as React.CSSProperties}
      >
        <div
          style={{
            color: colorNumber('lunchtime', 'classicDiet')
          } as React.CSSProperties}
        >
          {/* {mealsNumber?.lunchtime.classicDiet} */}
          <Button
            onClick={() => {
              getMeals(date)
              onOpenRegularLunch()
            }}
            size={'sm'}
          >
            {mealsNumber?.lunchtime.classicDiet}
          </Button>
          <Box p={1}>
            <Modal
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              size={'xxl'}
              scrollBehavior={'inside'}
              isOpen={isOpenRegularLunch}
              onClose={onCloseRegularLunch}
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader borderBottom={'solid'}>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {
                    <Table>
                      <Tr borderBottom={'solid'}>
                        <Th>Prénom</Th>
                        <Th>Nom</Th>
                        <Th>Repas normaux midi</Th>

                        <Th>Comentaire</Th>
                      </Tr>

                      {mealsWithCustomerData.map((meals, index) => (
                        <Tr key={index}>
                          <Td>
                            {meals.firstname && meals.regularLunch ? meals.firstname : null}
                          </Td>
                          <Td>
                            {meals.lastname && meals.regularLunch ? meals.lastname : null}
                          </Td>
                          <Td>
                            {meals.regularLunch ? meals.regularLunch : null}
                          </Td>

                          <Td>
                            {meals.comment?.length > 0 && meals.regularLunch ? meals.comment : null}
                          </Td>
                        </Tr>
                      ))}
                    </Table>
                  }
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onCloseRegularLunch}>
                    Close
                  </Button>
                  <Button variant="ghost" onClick={print}>Imprimer</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        </div>
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
          borderTopStyle: 'solid',
          borderBottomWidth: '0.1em',
          borderBottomStyle: 'solid',
          borderBottomColor: 'black'
        } as React.CSSProperties}
      >
        <div
          style={{
            color: colorNumber('lunchtime', 'specialDiet')
          } as React.CSSProperties}
        >
          <Button
            onClick={() => {
              getMeals(date)
              onOpenSpecialLunch()
            }}
            size={'sm'}
          >
            {mealsNumber?.lunchtime.specialDiet}
          </Button>
          <Box p={1}>
            <Modal
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              size={'xxl'}
              scrollBehavior={'inside'}
              isOpen={isOpenSpecialLunch}
              onClose={onCloseSpecialLunch}
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader borderBottom={'solid'}>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {
                    <Table>
                      <Tr borderBottom={'solid'}>
                        <Th>Prénom</Th>
                        <Th>Nom</Th>

                        <Th>Repas speciaux midi</Th>
                        <Th>Comentaire</Th>
                      </Tr>

                      {mealsWithCustomerData.map((meals, index) => (
                        <Tr key={index}>
                          <Td>
                            {meals.firstname && meals.specialLunch ? meals.firstname : null}
                          </Td>
                          <Td>
                            {meals.lastname && meals.specialLunch ? meals.lastname : null}
                          </Td>
                          <Td>
                            {meals.specialLunch ? meals.specialLunch : null}
                          </Td>
                          <Td>
                            {meals.comment?.length > 0 && meals.specialLunch ? meals.comment : null}
                          </Td>
                        </Tr>
                      ))}
                    </Table>
                  }
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onCloseSpecialLunch}>
                    Close
                  </Button>
                  <Button variant="ghost" onClick={print}>Imprimer</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        </div>
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
          borderTopStyle: 'solid',
          borderBottomWidth: '0.01em',
          borderBottomStyle: 'solid'
        } as React.CSSProperties}
      >
        <div
          style={{
            color: colorNumber('dinner', 'classicDiet')
          } as React.CSSProperties}
        >
          <Button
            onClick={() => {
              getMeals(date)
              onOpenRegularDiner()
            }}
            size={'sm'}
          >
            {mealsNumber?.dinner.classicDiet}
          </Button>
          <Box p={1}>
            <Modal
              size={'xxl'}
              scrollBehavior={'inside'}
              isOpen={isOpenRegularDiner}
              onClose={onCloseRegularDiner}
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader borderBottom={'solid'}>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {
                    <Table>
                      {/* <Caption>Détail du midi : {date}</Caption> */}
                      <Tr borderBottom={'solid'}>
                        <Th>Prénom</Th>
                        <Th>Nom</Th>
                        <Th>Repas normaux soir</Th>

                        <Th>Comentaire</Th>
                      </Tr>

                      {mealsWithCustomerData.map((meals, index) => (
                        <Tr key={index}>
                          <Td>
                            {meals.firstname && meals.regularDinner ? meals.firstname : null}
                          </Td>
                          <Td>
                            {meals.lastname && meals.regularDinner ? meals.lastname : null}
                          </Td>
                          <Td>
                            {meals.regularDinner ? meals.regularDinner : null}
                          </Td>

                          <Td>
                            {meals.comment?.length > 0 && meals.regularDinner ?
                              meals.comment :
                              null}
                          </Td>
                        </Tr>
                      ))}
                    </Table>
                  }
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onCloseRegularDiner}>
                    Close
                  </Button>
                  <Button variant="ghost" onClick={print}>Imprimer</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gridColumnStart: positionX,
          gridColumnEnd: positionX + 1,
          gridRowStart: 8,
          gridRowEnd: 9,
          borderLeftWidth: dayMonth === 1 ? '0.3em' : dayWeek === 1 ? '0.15em' : '0.01em',
          borderLeftStyle: dayMonth === 1 ? 'double' : dayWeek === 1 ? 'solid' : 'dashed',
          borderTopStyle: 'solid'
        } as React.CSSProperties}
      >
        <div
          style={{
            color: colorNumber('dinner', 'specialDiet')
          } as React.CSSProperties}
        >
          <Button
            onClick={() => {
              getMeals(date)
              onOpenSpecialDiner()
            }}
            size={'sm'}
          >
            {mealsNumber?.dinner.specialDiet}
          </Button>
          {
            <Box p={1}>
              <Modal
                size={'xxl'}
                scrollBehavior={'inside'}
                isOpen={isOpenSpecialDiner}
                onClose={onCloseSpecialDiner}
                isCentered
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader borderBottom={'solid'}>
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    {
                      <Table>
                        {/* <Caption>Détail du midi : {date}</Caption> */}
                        <Tr borderBottom={'solid'}>
                          <Th>Prénom</Th>
                          <Th>Nom</Th>
                          <Th>Repas speciaux soir</Th>
                          <Th>Comentaire</Th>
                        </Tr>

                        {mealsWithCustomerData.map((meals, index) => (
                          <Tr key={index}>
                            <Td>
                              {meals.firstname && meals.specialDinner ? meals.firstname : null}
                            </Td>
                            <Td>
                              {meals.lastname && meals.specialDinner ? meals.lastname : null}
                            </Td>
                            <Td>
                              {meals.specialDinner ? meals.specialDinner : null}
                            </Td>
                            <Td>
                              {meals.comment?.length > 0 && meals.specialDinner ?
                                meals.comment :
                                null}
                            </Td>
                          </Tr>
                        ))}
                      </Table>
                    }
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onCloseSpecialDiner}>
                      Close
                    </Button>
                    <Button variant="ghost" onClick={print}>Imprimer</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Box>
          }
        </div>
      </div>
    </>
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

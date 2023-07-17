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
  Text,
  Th,
  Tr,
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import type { IMeal } from 'app/shared/model/meal.model'
import type { IMealWithCustomer } from 'app/shared/model/mealWithCustomer.model'
import axios from 'axios'
import type { Dayjs } from 'dayjs'
import type dayjs from 'dayjs'
import { pipe } from 'effect'
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
  const { isOpen: isOpenBreakfast, onOpen: onOpenBreakfast, onClose: onCloseBreakfast } =
    useDisclosure()
  const { isOpen: isOpenSpecialLunch, onOpen: onOpenSpecialLunch, onClose: onCloseSpecialLunch } =
    useDisclosure()
  const { isOpen: isOpenRegularLunch, onOpen: onOpenRegularLunch, onClose: onCloseRegularLunch } =
    useDisclosure()
  const {
    isOpen: isOpenRegularDinner,
    onOpen: onOpenRegularDinner,
    onClose: onCloseRegularDinner
  } = useDisclosure()
  const {
    isOpen: isOpenSpecialDinner,
    onOpen: onOpenSpecialDinner,
    onClose: onCloseSpecialDinner
  } = useDisclosure()
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

  let style: React.CSSProperties
  style = commentStyle(positionX, date, mealsContext, index)
  useEffect(() => {
    style = commentStyle(positionX, date, mealsContext, index)
  }, [mealsContext])

  useEffect(() => {
    const mealsToCookFromDb: IMealsNumber = {
      // @ts-expect-error TODO: fix this
      breakfast: mealsContext[index]?.breakfast,
      lunchtime: {
        // @ts-expect-error TODO: fix this
        specialDiet: mealsContext[index]?.specialLunch,
        // @ts-expect-error TODO: fix this
        classicDiet: mealsContext[index]?.regularLunch
      },
      dinner: {
        // @ts-expect-error TODO: fix this
        specialDiet: mealsContext[index]?.specialDinner,
        // @ts-expect-error TODO: fix this
        classicDiet: mealsContext[index]?.regularDinner
      },
      // @ts-expect-error TODO: fix this
      comment: mealsContext[index]?.comment
    }

    const mealsReferentialFromDb: IMealsNumber = {
      // @ts-expect-error TODO: fix this
      breakfast: mealsContext[index]?.breakfast,
      lunchtime: {
        // @ts-expect-error TODO: fix this
        specialDiet: mealsContext[index]?.specialLunch,
        // @ts-expect-error TODO: fix this
        classicDiet: mealsContext[index]?.regularLunch
      },
      dinner: {
        // @ts-expect-error TODO: fix this
        specialDiet: mealsContext[index]?.specialDinner,
        // @ts-expect-error TODO: fix this
        classicDiet: mealsContext[index]?.regularDinner
      },
      // @ts-expect-error TODO: fix this
      comment: mealsContext[index]?.comment
    }
    // setMealsNumberReferential(mealsReferentialFromDb)

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
    // @ts-expect-error TODO: fix this
    setMealsNumber(theNewMealsNumber)
  }, [mealsContext])

  // const colorNumber = (
  //   time: 'lunchtime' | 'dinner' | 'breakfast',
  //   diet: 'specialDiet' | 'classicDiet'
  // ) => {
  //   let color: string
  //   let referentialColor: number
  //   let numberToColor: number

  //   if (time === 'lunchtime') {
  //     if (diet === 'specialDiet') {
  //       referentialColor = mealsNumberReferential?.lunchtime.specialDiet
  //       numberToColor = mealsNumber?.lunchtime.specialDiet
  //     }
  //     if (diet === 'classicDiet') {
  //       referentialColor = mealsNumberReferential?.lunchtime.classicDiet
  //       numberToColor = mealsNumber?.lunchtime.classicDiet
  //     }
  //   }
  //   if (time === 'dinner') {
  //     if (diet === 'specialDiet') {
  //       referentialColor = mealsNumberReferential?.dinner.specialDiet
  //       numberToColor = mealsNumber?.dinner.specialDiet
  //     }
  //     if (diet === 'classicDiet') {
  //       referentialColor = mealsNumberReferential?.dinner.classicDiet
  //       numberToColor = mealsNumber?.dinner.classicDiet
  //     }
  //   }
  //   if (time === 'breakfast') {
  //     referentialColor = mealsNumberReferential?.breakfast
  //     numberToColor = mealsNumber?.breakfast
  //     color = 'green'
  //   }

  //   if (numberToColor > referentialColor) {
  //     color = 'green'
  //   }
  //   if (numberToColor < referentialColor) {
  //     color = 'red'
  //   }
  //   if (numberToColor === referentialColor) {
  //     color = 'black'
  //   }
  //   return color
  // }

  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }

  // const dispatch = useAppDispatch()
  // const handleSyncList = (date: string) => {
  // }
  const getMeals = async (date: Dayjs) => {
    const requestUrl = `${apiUrlMealForOneDay}/${date.format('YYYY-MM-DD')}`

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
      <VStack className="day" style={style} px={1} borderColor={'#D9D9D9'}>
        <Text>{date.format('ddd')}</Text>
        <Text>{date.format('DD')}</Text>
      </VStack>
      <div className="day popup-comment" style={style} onClick={() => toggle()}>
        {date.format('ddd DD ')}
      </div>
      <Box
        display={'flex'}
        flexDirection={'column'}
        backgroundColor={'yellow.50'}
        gridColumnStart={positionX}
        gridColumnEnd={positionX + 1}
        gridRowStart={'4'}
        gridRowEnd={'5'}
        borderLeftWidth={dayMonth === 1 ? '0.3em' : dayWeek === 1 ? '0.15em' : '0.01em'}
        borderLeftStyle={dayMonth === 1 ? 'double' : dayWeek === 1 ? 'solid' : 'dashed'}
        // borderTopStyle={'solid'}
        // borderTopWidth={'0.1em'}
        borderBottomWidth={'0.01em'}
        borderBottomStyle={'solid'}
        py={2}
      >
        <Button
          onClick={() => {
            getMeals(date)
            onOpenBreakfast()
          }}
          size={'sm'}
          colorScheme="orange"
        >
          {mealsNumber?.breakfast}
        </Button>
        {
          <Box p={1}>
            <Modal
              size={'xxl'}
              scrollBehavior={'inside'}
              isOpen={isOpenBreakfast}
              onClose={onCloseBreakfast}
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
                        <Th>Petit-déjeuner</Th>
                        <Th>Commentaire</Th>
                      </Tr>

                      {mealsWithCustomerData.filter(x => x.breakfast !== 0).map((
                        meals,
                        index
                      ) => (
                        <Tr key={index}>
                          <Td>
                            {meals.firstname && meals.breakfast ? meals.firstname : null}
                          </Td>
                          <Td>
                            {meals.lastname && meals.breakfast ? meals.lastname : null}
                          </Td>
                          <Td>
                            {meals.breakfast ? meals.breakfast : null}
                          </Td>
                          <Td>
                            {
                              // @ts-expect-error TODO: fix this
                              meals.commentMeals?.length > 0 && meals.breakfast ?
                                meals.commentMeals :
                                null
                            }
                          </Td>
                        </Tr>
                      ))}
                    </Table>
                  }
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onCloseBreakfast}>
                    Fermer
                  </Button>
                  <Button variant="ghost" onClick={print}>Imprimer</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        }
      </Box>

      <Box
        display={'flex'}
        flexDirection={'column'}
        backgroundColor={'orange.100'}
        gridColumnStart={positionX}
        gridColumnEnd={positionX + 1}
        gridRowStart={'5'}
        gridRowEnd={'6'}
        borderLeftWidth={dayMonth === 1 ? '0.3em' : dayWeek === 1 ? '0.15em' : '0.01em'}
        borderLeftStyle={dayMonth === 1 ? 'double' : dayWeek === 1 ? 'solid' : 'dashed'}
        borderTopStyle={'solid'}
        // borderTopWidth={'0.1em'}
        borderBottomWidth={'0.01em'}
        borderBottomStyle={'solid'}
        py={2}
        // alignItems={'center'}
        // justifyContent={'center'}
        // verticalAlign={'middle'}
      >
        <Button
          onClick={() => {
            getMeals(date)
            onOpenRegularLunch()
          }}
          size={'sm'}
          colorScheme="orange"
        >
          {mealsNumber?.lunchtime.classicDiet}
        </Button>
        <Box p={1}>
          <Modal
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
                    {/* <Caption>Détail du midi : {date}</Caption> */}
                    <Tr borderBottom={'solid'}>
                      <Th>Prénom</Th>
                      <Th>Nom</Th>
                      <Th>Repas normaux midi</Th>

                      <Th>Commentaire</Th>
                    </Tr>

                    {mealsWithCustomerData.filter(x => x.regularLunch !== 0).map((meals, index) => (
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
                          {
                            // @ts-expect-error TODO: fix this
                            meals.commentMeals?.length > 0 && meals.regularLunch ?
                              meals.commentMeals :
                              null
                          }
                        </Td>
                      </Tr>
                    ))}
                  </Table>
                }
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onCloseRegularLunch}>
                  Fermer
                </Button>
                <Button variant="ghost" onClick={print}>Imprimer</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Box>

      <Box
        display={'flex'}
        flexDirection={'column'}
        backgroundColor={'orange.100'}
        gridColumnStart={positionX}
        gridColumnEnd={positionX + 1}
        gridRowStart={'6'}
        gridRowEnd={'7'}
        borderLeftWidth={dayMonth === 1 ? '0.3em' : dayWeek === 1 ? '0.15em' : '0.01em'}
        borderLeftStyle={dayMonth === 1 ? 'double' : dayWeek === 1 ? 'solid' : 'dashed'}
        borderTopStyle={'solid'}
        // borderTopWidth={'0.1em'}
        borderBottomWidth={'0.01em'}
        borderBottomStyle={'solid'}
        py={2}
      >
        <Button
          onClick={() => {
            getMeals(date)
            onOpenSpecialLunch()
          }}
          size={'sm'}
          colorScheme="orange"
        >
          {mealsNumber?.lunchtime.specialDiet}
        </Button>
        {
          <Box p={1}>
            <Modal
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
                      {/* <Caption>Détail du midi : {date}</Caption> */}
                      <Tr borderBottom={'solid'}>
                        <Th>Prénom</Th>
                        <Th>Nom</Th>
                        <Th>Repas speciaux midi</Th>
                        <Th>Commentaire</Th>
                      </Tr>

                      {mealsWithCustomerData.filter(x => x.specialLunch !== 0).map((
                        meals,
                        index
                      ) => (
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
                            {
                              // @ts-expect-error TODO: fix this
                              meals.commentMeals?.length > 0 && meals.specialLunch ?
                                meals.commentMeals :
                                null
                            }
                          </Td>
                        </Tr>
                      ))}
                    </Table>
                  }
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onCloseSpecialLunch}>
                    Fermer
                  </Button>
                  <Button variant="ghost" onClick={print}>Imprimer</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        }
      </Box>

      <Box
        display={'flex'}
        flexDirection={'column'}
        backgroundColor={'#F7F7F7'}
        gridColumnStart={positionX}
        gridColumnEnd={positionX + 1}
        gridRowStart={'7'}
        gridRowEnd={'8'}
        borderLeftWidth={dayMonth === 1 ? '0.3em' : dayWeek === 1 ? '0.15em' : '0.01em'}
        borderLeftStyle={dayMonth === 1 ? 'double' : dayWeek === 1 ? 'solid' : 'dashed'}
        borderTopStyle={'solid'}
        // borderTopWidth={'0.1em'}
        borderBottomWidth={'0.01em'}
        borderBottomStyle={'solid'}
        py={2}
        // alignItems={'center'}
        // justifyContent={'center'}
        // verticalAlign={'middle'}
      >
        <Button
          onClick={() => {
            getMeals(date)
            onOpenRegularDinner()
          }}
          size={'sm'}
          colorScheme="orange"
        >
          {mealsNumber?.dinner.classicDiet}
        </Button>
        <Box p={1}>
          <Modal
            size={'xxl'}
            scrollBehavior={'inside'}
            isOpen={isOpenRegularDinner}
            onClose={onCloseRegularDinner}
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

                      <Th>Commentaire</Th>
                    </Tr>

                    {mealsWithCustomerData.filter(x => x.regularDinner !== 0).map((
                      meals,
                      index
                    ) => (
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
                          {
                            // @ts-expect-error TODO: fix this
                            meals.commentMeals?.length > 0 && meals.regularDinner ?
                              meals.commentMeals :
                              null
                          }
                        </Td>
                      </Tr>
                    ))}
                  </Table>
                }
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onCloseRegularDinner}>
                  Fermer
                </Button>
                <Button variant="ghost" onClick={print}>Imprimer</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Box>

      <Box
        display={'flex'}
        flexDirection={'column'}
        backgroundColor={'#F7F7F7'}
        gridColumnStart={positionX}
        gridColumnEnd={positionX + 1}
        gridRowStart={'8'}
        gridRowEnd={'9'}
        borderLeftWidth={dayMonth === 1 ? '0.3em' : dayWeek === 1 ? '0.15em' : '0.01em'}
        borderLeftStyle={dayMonth === 1 ? 'double' : dayWeek === 1 ? 'solid' : 'dashed'}
        borderTopStyle={'solid'}
        // borderTopWidth={'0.1em'}
        borderBottomWidth={'0.01em'}
        borderBottomStyle={'solid'}
        py={2}
      >
        <Button
          onClick={() => {
            getMeals(date)
            onOpenSpecialDinner()
          }}
          size={'sm'}
          colorScheme="orange"
        >
          {mealsNumber?.dinner.specialDiet}
        </Button>
        {
          <Box p={1}>
            <Modal
              size={'xxl'}
              scrollBehavior={'inside'}
              isOpen={isOpenSpecialDinner}
              onClose={onCloseSpecialDinner}
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
                        <Th>Commentaire</Th>
                      </Tr>

                      {mealsWithCustomerData.filter(x => x.specialDinner !== 0).map((
                        meals,
                        index
                      ) => (
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
                            {
                              // @ts-expect-error TODO: fix this
                              meals.commentMeals?.length > 0 && meals.specialDinner ?
                                meals.commentMeals :
                                null
                            }
                          </Td>
                        </Tr>
                      ))}
                    </Table>
                  }
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onCloseSpecialDinner}>
                    Fermer
                  </Button>
                  <Button variant="ghost" onClick={print}>Imprimer</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        }
      </Box>
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
    borderBottomWidth: '0.15em',
    backgroundColor: 'white',
    borderColor: '#D9D9D9',
    Border: 'none'
  } as React.CSSProperties
  if (date.day() === 1) {
    style.borderLeftWidth = '0.2em'
  }
  // @ts-expect-error TODO: fix this
  if (mealsContext[index]?.comment?.length > 0) {
    style.backgroundColor = '#B8D8BA'
  }
  if (date.date() === 1) {
    style.borderLeftWidth = '0.4em'
    style.borderStyle = 'double'
  }
  // bug depuis modif largeur calendrier special à 7 jours
  // if (positionX === 8) {
  //   style.borderLeftWidth = '0em'
  // }
  return style
}

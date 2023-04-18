import {
  Button,
  Checkbox,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure
} from '@chakra-ui/react'
import type { IMeal } from 'app/shared/model/meal.model'
import axios from 'axios'
import type { Dayjs } from 'dayjs'
// import type dayjs from 'dayjs'
import type { FunctionComponent } from 'react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaBan, FaSave, FaTrash } from 'react-icons/fa'

interface MealSpecial {
  isSpecialMeal3: boolean
  // setUpdateBeds: (updateBeds: boolean) => void
  entity: IMeal[]
  date: Dayjs
  numberOfDays: number
}

export const ConfirmationAddMealsScreenModal: FunctionComponent<
  { mealsData: IMeal[]; date: Dayjs; numberOfDays: number; setDate: (date: Dayjs) => void }
> = (
  { mealsData, date, numberOfDays, setDate }
): JSX.Element => {
  const {
    handleSubmit,
    register
    // watch,
    // formState: { errors },
    // reset: resetForm
  } = useForm<MealSpecial>()

  const [isLoading, setIsLoading] = useState(false)
  // const [isSpecialMeal, setIsSpecialMeal] = useState<boolean>(false)
  // const isSpecialMeal2 = useState<boolean>(false)

  const apiUrlUpdateMeal = 'api/meals/update'

  /**
   * select and update meals of planning on screen
   */
  const updateMealsOnPeriode = async (
    entity: IMeal[],
    date: Dayjs,
    numberOfDays: number,
    isSpecialMeal3: boolean
  ) => {
    console.log('entity', entity)
    console.log('date', date)
    console.log('isSpecialMeal', isSpecialMeal3)

    entity = entity.filter((value, index) => {
      if (index < (numberOfDays)) {
        return value
      }
    }).map((value, index) => {
      console.log('isSpecialMeal', isSpecialMeal3)
      if (index < numberOfDays && value.id !== undefined && isSpecialMeal3) {
        value = {
          ...value,
          specialLunch: 1,
          specialDinner: 1,
          regularLunch: 0,
          regularDinner: 0,
          comment: mealsData[index].comment,
          breakfast: 1
        }
      }
      if (index < numberOfDays && value.id !== undefined && !isSpecialMeal3) {
        value = {
          ...value,
          specialLunch: 0,
          specialDinner: 0,
          regularLunch: 1,
          regularDinner: 1,
          comment: mealsData[index].comment,
          breakfast: 1
        }
      }
      return value
    })

    await axios.put<IMeal>(
      apiUrlUpdateMeal,
      entity.filter(x => x.id !== undefined)
    )

    setIsLoading(false)
    // setDate(date.add(1, 'day'))
    setDate(date)
    onClose()
  }

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button
        onClick={onOpen}
        isLoading={isLoading}
        leftIcon={<FaSave />}
        colorScheme={'green'}
        _hover={{
          textDecoration: 'none',
          color: 'green.200',
          backgroundColor: '#38A169'
        }}
        // variant={'update'}
      >
        Se résinscrire sur la période affichée
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Confirmer la mise à jour
          </ModalHeader>
          <ModalBody>
            Êtes-vous sûr de vouloir vous réinscrire aux repas sur la période affichée sur
            l&apos;écran ? <br />
            {
              /* <Checkbox
              colorScheme={'green'}
              defaultChecked={true}
              size={'lg'}
              id={'specialMeal'}
              // isSpecialMeal={true}
            >
              Repas spéciaux
            </Checkbox> */
            }
            {/* <Checkbox {...setIsSpecialMeal}>Repas spéciaux</Checkbox> */}
            <Checkbox colorScheme={'green'} defaultChecked={true} {...register('isSpecialMeal3')}>
              Repas spéciaux
            </Checkbox>
          </ModalBody>
          <ModalFooter justifyContent={'space-between'}>
            <Button onClick={onClose} leftIcon={<FaBan />} variant="back" isLoading={isLoading}>
              Retour
            </Button>
            <Stack>
              <Button
                // onSubmit={handleSubmit(handleValidDateAndMealSubmit)}
                onClick={() => updateMealsOnPeriode(mealsData, date, numberOfDays, true)}
                // onClick={handleSubmit(updateMealsOnPeriode)}
                leftIcon={<FaTrash />}
                variant="danger"
                isLoading={isLoading}
              >
                Confirmer (repas spéciaux)
              </Button>
              <Button
                onClick={() => updateMealsOnPeriode(mealsData, date, numberOfDays, false)}
                leftIcon={<FaTrash />}
                variant="danger"
                isLoading={isLoading}
              >
                Confirmer
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

import { CheckIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Text,
  Textarea,
  VStack
} from '@chakra-ui/react'
import * as O from '@effect/data/Option'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { BsPencil } from 'react-icons/bs'

import type { OneBedReservationDatesAndMeals } from '../models'
import {
  isArrivalDateEqualDepartureDate,
  isArrivalDateIsBeforeDepartureDate,
  isDateBeforeNow
} from '../utils'

interface DatesAndMealsChoicesProps {
  setDatesAndMeal: (datesAndMeal: O.Option<OneBedReservationDatesAndMeals>) => void
  setUpdateDatesAndMeals: (updateDatesAndMeals: boolean) => void
  datesAndMeals: O.Option<OneBedReservationDatesAndMeals>
  setBedId: (bedId: O.Option<number>) => void
}

export const DatesAndMealsChoices = (
  props: DatesAndMealsChoicesProps
): JSX.Element => {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
    reset: resetForm
  } = useForm<OneBedReservationDatesAndMeals>()

  useEffect(() => {
    resetForm(
      O.isSome(props.datesAndMeals) ? props.datesAndMeals.value : {}
    )
  }, [props.datesAndMeals])

  const departureDate = useRef({})
  departureDate.current = watch('departureDate', '')
  const arrivalDate = useRef({})
  arrivalDate.current = watch('arrivalDate', '')
  const handleValidDateAndMealSubmit = (
    datesAndMeal: OneBedReservationDatesAndMeals
  ): void => {
    props.setBedId(O.none())
    props.setUpdateDatesAndMeals(false)
    if (
      isArrivalDateEqualDepartureDate(
        arrivalDate.current.toString(),
        departureDate.current.toString()
      )
    ) {
      props.setDatesAndMeal(
        O.some({
          ...datesAndMeal,
          isDepartureBreakfast: false,
          isDepartureDinner: false,
          isDepartureLunch: false
        })
      )
    } else {
      props.setDatesAndMeal(O.some(datesAndMeal))
    }
  }

  return (
    <VStack alignItems={'flex-start'}>
      <VStack
        minW={'100%'}
        alignItems={'flex-start'}
        border={'solid'}
        p={4}
        borderRadius={8}
        borderColor={'#D9D9D9'}
      >
        <HStack>
          <Heading size={'md'}>
            Date et repas
          </Heading>
          <BsPencil size={'30px'} color={'black'}></BsPencil>
        </HStack>
        <Box minW={'500px'}>
          <form
            onSubmit={handleSubmit(handleValidDateAndMealSubmit)}
          >
            <VStack spacing={10}>
              <HStack spacing={12} minW={600} my={4}>
                <FormControl isRequired isInvalid={errors.arrivalDate !== undefined}>
                  <FormLabel htmlFor="arrivalDate" fontWeight={'bold'}>
                    {"Date d'arrivée"}
                  </FormLabel>
                  <Input
                    id="username"
                    type="date"
                    placeholder="Date d'arrivée'"
                    {...register('arrivalDate', {
                      required: "la date d'arrivée' est obligatoire",
                      validate(v) {
                        if (
                          !isArrivalDateIsBeforeDepartureDate(v, departureDate.current.toString())
                          && !isArrivalDateEqualDepartureDate(v, departureDate.current.toString())
                        ) {
                          return "La date d'arrivée doit être avant la date de départ"
                        }
                        if (isDateBeforeNow(v)) {
                          return "La date d'arrivée doit être après aujourd’hui"
                        } else {
                          return true
                        }
                      }
                    })}
                  />

                  <FormErrorMessage>
                    {errors.arrivalDate && errors.arrivalDate.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={errors.departureDate !== undefined}>
                  <FormLabel htmlFor="departureDate" fontWeight={'bold'}>
                    {'Date de départ'}
                  </FormLabel>
                  <Input
                    id="username"
                    type="date"
                    placeholder="Date de départ"
                    {...register('departureDate', {
                      required: 'La date de départ est obligatoire'
                    })}
                  />

                  <FormErrorMessage>
                    {errors.departureDate && errors.departureDate.message}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
              <FormControl isInvalid={errors.comment !== undefined}>
                <FormLabel htmlFor="comment" fontWeight={'bold'}>
                  {'Commentaire :'}
                </FormLabel>
                <Textarea
                  id="comment"
                  placeholder="Votre commentaire"
                  {...register('comment')}
                  minH={100}
                />

                <FormErrorMessage>
                  {errors.comment && errors.comment.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="selectionRepas" fontWeight={'bold'}>
                  {'Sélection des repas :'}
                </FormLabel>
                <HStack>
                  <Text fontWeight={'bold'}>{"Jour d'arrivée :"}</Text>
                  <Checkbox {...register('isArrivalBreakfast')}>petit déjeuner</Checkbox>
                  <Checkbox {...register('isArrivalLunch')}>déjeuner</Checkbox>
                  <Checkbox {...register('isArrivalDinner')}>dîner</Checkbox>
                </HStack>
                {!isArrivalDateEqualDepartureDate(
                    arrivalDate.current.toString(),
                    departureDate.current.toString()
                  ) ?
                  (
                    <HStack>
                      <Text fontWeight={'bold'}>{'Jour de départ :'}</Text>
                      <Checkbox {...register('isDepartureBreakfast')}>petit déjeuner</Checkbox>
                      <Checkbox {...register('isDepartureLunch')}>déjeuner</Checkbox>
                      <Checkbox {...register('isDepartureDinner')}>dîner</Checkbox>
                    </HStack>
                  ) :
                  null}
              </FormControl>
              <FormControl isRequired isInvalid={errors.isSpecialDiet !== undefined}>
                <FormLabel htmlFor="selectionRepas" fontWeight={'bold'}>
                  {'Régime sans lactose OU sans gluten ?'}
                </FormLabel>

                <RadioGroup
                  defaultValue={O.isSome(props.datesAndMeals) ?
                    props.datesAndMeals.value.isSpecialDiet :
                    ''}
                >
                  <HStack spacing="24px">
                    <Radio {...register('isSpecialDiet')} value={'true'} mb={0}>Oui</Radio>
                    <Radio {...register('isSpecialDiet')} value={'false'}>Non</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
              <FormControl isInvalid={errors.commentMeals !== undefined}>
                <FormLabel htmlFor="comment" fontWeight={'bold'}>
                  {'Commentaire à propos des repas :'}
                </FormLabel>
                <Textarea
                  id="commentMeals"
                  placeholder="Votre commentaire à propos des repas (ex : allergie, régime, vegan...)"
                  {...register('commentMeals')}
                  minH={100}
                />

                <FormErrorMessage>
                  {errors.commentMeals && errors.commentMeals.message}
                </FormErrorMessage>
              </FormControl>
              <Button
                rightIcon={<CheckIcon />}
                colorScheme={'green'}
                alignSelf={'flex-start'}
                type="submit"
              >
                Confirmer
              </Button>
            </VStack>
          </form>
        </Box>
      </VStack>
    </VStack>
  )
}

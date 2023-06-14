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
  Text,
  Textarea,
  VStack
} from '@chakra-ui/react'
import * as O from '@effect/data/Option'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { BsPencil } from 'react-icons/bs'

import { isArrivalDateEqualDepartureDate, isArrivalDateIsBeforeDepartureDate } from '../utils'
import type { DatesAndMeals } from './reservation-update'

interface DatesAndMealsChoicesProps {
  setDatesAndMeal: (datesAndMeal: O.Option<DatesAndMeals>) => void
  setUpdateDatesAndMeals: (updateDatesAndMeals: boolean) => void
  datesAndMeals: O.Option<DatesAndMeals>
  setSelectedBeds: (bedId: readonly number[]) => void
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
  } = useForm<DatesAndMeals>()

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
    datesAndMeal: DatesAndMeals
  ): void => {
    props.setSelectedBeds([])
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
  console.log(props.datesAndMeals)
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
                      required: 'la date de départ est obligatoire'
                    })}
                  />

                  <FormErrorMessage>
                    {errors.departureDate && errors.departureDate.message}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
              <FormControl>
                <FormLabel htmlFor="selectionRepas" fontWeight={'bold'}>
                  {'Sélection des repas :'}
                </FormLabel>
                <HStack>
                  <Text fontWeight={'bold'}>{"Jour d'arrivée :"}</Text>
                  <Checkbox {...register('isArrivalBreakfast')}>petit déjeuner</Checkbox>
                  <Checkbox {...register('isArrivalLunch')} defaultChecked>déjeuner</Checkbox>
                  <Checkbox {...register('isArrivalDinner')} defaultChecked>dîner</Checkbox>
                </HStack>
                {!isArrivalDateEqualDepartureDate(
                    arrivalDate.current.toString(),
                    departureDate.current.toString()
                  ) ?
                  (
                    <HStack>
                      <Text fontWeight={'bold'}>{'Jour de départ :'}</Text>
                      <Checkbox {...register('isDepartureBreakfast')} defaultChecked>
                        petit déjeuner
                      </Checkbox>
                      <Checkbox {...register('isDepartureLunch')}>déjeuner</Checkbox>
                      <Checkbox {...register('isDepartureDinner')}>dîner</Checkbox>
                    </HStack>
                  ) :
                  null}
              </FormControl>

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
              <FormControl
                isInvalid={errors.commentMeals !== undefined}
                width={'auto'}
                alignItems={'flex-start'}
              >
                <FormLabel
                  htmlFor="commentMeals"
                  fontWeight={'bold'}
                  alignItems={'flex-start'}
                  // width={'auto'}
                >
                  {'Commentaire repas:'}
                </FormLabel>
                <Textarea
                  id="commentMeals"
                  width={{ base: '300px', lg: '1000px' }}
                  placeholder="Votre commentaire à propos des repas (ex : allergie, régime, vegan...)"
                  {...register('commentMeals')}
                  minH={{ base: '100', lg: '50' }}
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

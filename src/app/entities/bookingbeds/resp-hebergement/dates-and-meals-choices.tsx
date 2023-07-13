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
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'
import { schemaResolver } from 'app/entities/bed/resolver'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { BsPencil } from 'react-icons/bs'

import {
  isArrivalDateEqualDepartureDate,
  isArrivalDateIsBeforeDepartureDate
} from '../utils'
import { DatesAndMeals } from './reservation-update'

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
  } = useForm({
    resolver: schemaResolver(DatesAndMeals)
  })

  useEffect(() => {
    resetForm(
      // @ts-expect-error format date is mandatory for react-hook-form
      pipe(
        props.datesAndMeals,
        O.map(S.encode(DatesAndMeals)),
        O.map(d => ({
          ...d,
          arrivalDate: d.arrivalDate.toISOString().slice(0, 10),
          departureDate: d.departureDate.toISOString().slice(0, 10)
        })),
        O.getOrElse(() => ({}))
      )
    )
  }, [props.datesAndMeals])

  const departureDate = useRef(O.none<Date>())
  departureDate.current = pipe(watch('departureDate'), O.fromNullable, O.map(d => new Date(d)))
  const arrivalDate = useRef(O.none<Date>())
  arrivalDate.current = pipe(watch('arrivalDate'), O.fromNullable, O.map(d => new Date(d)))

  const handleValidDateAndMealSubmit = (
    datesAndMeal: DatesAndMeals
  ): void => {
    props.setSelectedBeds([])
    props.setUpdateDatesAndMeals(false)
    if (
      O.isSome(departureDate.current) && O.isSome(arrivalDate.current)
      && isArrivalDateEqualDepartureDate(
        arrivalDate.current.value,
        departureDate.current.value
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
            onSubmit={handleSubmit(v =>
              handleValidDateAndMealSubmit(v as unknown as DatesAndMeals)
            )}
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
                      valueAsDate: true,
                      required: "la date d'arrivée' est obligatoire",
                      validate(v) {
                        if (
                          O.isSome(departureDate.current)
                          && !isArrivalDateIsBeforeDepartureDate(v, departureDate.current.value)
                          && !isArrivalDateEqualDepartureDate(v, departureDate.current.value)
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
                      valueAsDate: true,
                      required: 'La date de départ est obligatoire'
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
                {O.isSome(departureDate.current) && O.isSome(arrivalDate.current)
                    && !isArrivalDateEqualDepartureDate(
                      arrivalDate.current.value,
                      departureDate.current.value
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

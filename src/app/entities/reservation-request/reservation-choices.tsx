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
import { identity, pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'
import type { Reservation } from 'app/shared/model/reservation.model'
import dayjs from 'dayjs'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { BsPencil } from 'react-icons/bs'

import { schemaResolver } from '../bed/resolver'
import {
  isArrivalDateEqualDepartureDate,
  isArrivalDateIsBeforeDepartureDate,
  isDateBeforeNow
} from '../bookingbeds/utils'
import type { DatesAndMealsDecoded, DatesAndMealsEncoded } from './model'
import { DatesAndMeals } from './model'

interface ReservationChoicesProps {
  setReservation: (reservation: O.Option<Reservation>) => void
  setUpdateReservation: (updateReservation: boolean) => void
  reservation: O.Option<Reservation>
  setIsReservationSaved: (isSaved: boolean) => void
}

export const ReservationChoices = (
  props: ReservationChoicesProps
): JSX.Element => {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
    reset: resetForm
  } = useForm<DatesAndMealsEncoded>({
    resolver: schemaResolver(DatesAndMeals)
  })

  const personNumber = useRef({})
  personNumber.current = watch('personNumber', 0)
  useEffect(() =>
    resetForm(
      // @ts-expect-error format date is mandatory for react-hook-form
      pipe(
        props.reservation,
        O.map(S.encode(DatesAndMeals)),
        O.map(d => ({
          ...d,
          arrivalDate: d.arrivalDate.toISOString().slice(0, 10),
          departureDate: d.departureDate.toISOString().slice(0, 10)
        })),
        O.getOrElse(() => ({}))
      )
    ), [props.reservation])

  const departureDate = useRef(O.none<Date>())
  departureDate.current = pipe(watch('departureDate'), O.fromNullable, O.map(d => new Date(d)))
  const arrivalDate = useRef(O.none<Date>())
  arrivalDate.current = pipe(watch('arrivalDate'), O.fromNullable, O.map(d => new Date(d)))

  const handleValidDateAndMealSubmit = (
    reservation: DatesAndMealsDecoded
  ): void => {
    props.setUpdateReservation(false)
    if (
      pipe(
        O.struct({ arrival: arrivalDate.current, departureDate: departureDate.current }),
        O.map(({ arrival, departureDate }) =>
          isArrivalDateEqualDepartureDate(
            arrival,
            departureDate
          )
        ),
        O.exists(identity)
      )
    ) {
      props.setReservation(
        O.some({
          ...reservation,
          id: pipe(props.reservation, O.flatMap(r => r.id)),
          isDepartureBreakfast: false,
          isDepartureDinner: false,
          isDepartureLunch: false,
          isPaid: pipe(props.reservation, O.map(r => r.isPaid), O.getOrElse(() => false)),
          beds: pipe(props.reservation, O.map(r => r.beds), O.getOrElse(() => [])),
          isConfirmed: pipe(props.reservation, O.map(r => r.isConfirmed), O.getOrElse(() => false)),
          departureDate: pipe(
            reservation.departureDate,
            dayjs,
            d => d.add(1, 'day').toDate()
          )
        })
      )
    } else {
      props.setReservation(O.some({
        ...reservation,
        id: pipe(props.reservation, O.flatMap(r => r.id)),
        isPaid: pipe(props.reservation, O.map(r => r.isPaid), O.getOrElse(() => false)),
        beds: pipe(props.reservation, O.map(r => r.beds), O.getOrElse(() => [])),
        isConfirmed: pipe(props.reservation, O.map(r => r.isConfirmed), O.getOrElse(() => false))
      }))
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
            Votre demande de réservation
          </Heading>
          <BsPencil size={'30px'} color={'black'}></BsPencil>
        </HStack>
        <Box minW={'500px'}>
          <form
            onSubmit={handleSubmit(v =>
              handleValidDateAndMealSubmit(v as unknown as DatesAndMealsDecoded)
            )}
          >
            <VStack spacing={5}>
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
                          && !isArrivalDateIsBeforeDepartureDate(
                            new Date(v),
                            departureDate.current.value
                          )
                          && !isArrivalDateEqualDepartureDate(
                            new Date(v),
                            departureDate.current.value
                          )
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
                      required: 'la date de départ est obligatoire',
                      valueAsDate: true
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
                      <Checkbox {...register('isDepartureBreakfast')}>petit déjeuner</Checkbox>
                      <Checkbox {...register('isDepartureLunch')}>déjeuner</Checkbox>
                      <Checkbox {...register('isDepartureDinner')}>dîner</Checkbox>
                    </HStack>
                  ) :
                  null}
              </FormControl>
              <FormControl isRequired isInvalid={errors.personNumber !== undefined}>
                <FormLabel htmlFor="personNumber" fontWeight={'bold'}>
                  {'Nombre de personnes à héberger'}
                </FormLabel>
                <Input
                  type="number"
                  {...register('personNumber', { valueAsNumber: true })}
                />

                <FormErrorMessage>
                  {errors.personNumber && errors.personNumber.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={errors.specialDietNumber !== undefined}>
                <FormLabel htmlFor="selectionRepas" fontWeight={'bold'}>
                  {'Régime sans lactose OU sans gluten ?'}
                </FormLabel>

                <Input
                  type="number"
                  {...register('specialDietNumber', {
                    valueAsNumber: true,
                    required: 'Le nombre de régimes spéciaux est obligatoire',
                    validate(v) {
                      if (v > +personNumber.current) {
                        return 'Le nombre de régimes spéciaux ne peut pas être supérieur au nombre de personnes'
                      }
                      if (v < 0) {
                        return 'Le nombre de régimes spéciaux ne peut pas être négatif'
                      }
                    }
                  })}
                />
                <FormErrorMessage>
                  {errors.specialDietNumber && errors.specialDietNumber.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.commentMeals !== undefined}>
                <FormLabel htmlFor="commentMeals" fontWeight={'bold'}>
                  {'Commentaire des repas :'}
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
                onClick={() => props.setIsReservationSaved(false)}
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

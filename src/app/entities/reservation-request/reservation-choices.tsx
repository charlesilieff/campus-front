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

import { isArrivalDateIsBeforeDepartureDate, isDateBeforeNow } from '../bookingbeds/utils'
import type { Reservation } from './reservation-update'

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
  } = useForm<Reservation>()
  const personNumber = useRef({})
  personNumber.current = watch('personNumber', 0)
  useEffect(() => {
    resetForm(
      O.isSome(props.reservation) ? props.reservation.value : {}
    )
  }, [props.reservation])

  const departureDate = useRef({})
  departureDate.current = watch('departureDate', '')

  const handleValidDateAndMealSubmit = (
    reservation: Reservation
  ): void => {
    props.setUpdateReservation(false)
    props.setReservation(O.some(reservation))
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
                  <Checkbox {...register('isArrivalLunch')}>déjeuner</Checkbox>
                  <Checkbox {...register('isArrivalDinner')}>dîner</Checkbox>
                </HStack>
                <HStack>
                  <Text fontWeight={'bold'}>{'Jour de départ :'}</Text>
                  <Checkbox {...register('isDepartureBreakfast')}>petit déjeuner</Checkbox>
                  <Checkbox {...register('isDepartureLunch')}>déjeuner</Checkbox>
                  <Checkbox {...register('isDepartureDinner')}>dîner</Checkbox>
                </HStack>
              </FormControl>
              <FormControl isRequired isInvalid={errors.personNumber !== undefined}>
                <FormLabel htmlFor="personNumber" fontWeight={'bold'}>
                  {'Nombre de personnes à héberger'}
                </FormLabel>
                <Input
                  type="number"
                  {...register('personNumber', {})}
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
                    required: 'Le nombre de régimes spéciaux est obligatoire',
                    validate(v) {
                      if (v > personNumber.current) {
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

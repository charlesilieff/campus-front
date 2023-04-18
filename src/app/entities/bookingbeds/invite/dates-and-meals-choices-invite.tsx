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
  Stack,
  Text,
  Textarea,
  VStack
} from '@chakra-ui/react'
import * as O from '@effect/data/Option'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { BsPencil } from 'react-icons/bs'

import { isArrivalDateIsBeforeDepartureDate, isDateBeforeNow } from '../utils'
import type { DatesAndMeals } from './reservation-invite-update'

interface DatesAndMealsChoicesProps {
  setDatesAndMeal: (datesAndMeal: O.Option<DatesAndMeals>) => void
  setUpdateDatesAndMeals: (updateDatesAndMeals: boolean) => void
  setUpdateBeds: (updateBeds: boolean) => void
  datesAndMeals: O.Option<DatesAndMeals>
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
  const personNumber = useRef({})
  personNumber.current = watch('personNumber', 0)
  const departureDate = useRef({})
  departureDate.current = watch('departureDate', '')

  const handleValidDateAndMealSubmit = (
    datesAndMeal: DatesAndMeals
  ): void => {
    if (datesAndMeal.withBeds === true) {
      props.setUpdateBeds(true)
    } else {
      props.setUpdateBeds(false)
    }
    props.setUpdateDatesAndMeals(false)
    props.setDatesAndMeal(O.some(datesAndMeal))
  }

  return (
    <VStack
      alignItems={'flex-start'}
      border={'solid'}
      p={4}
      borderRadius={8}
      borderColor={'#D9D9D9'}
      my={4}
    >
      {
        /* <VStack
        alignItems={'flex-start'}
        border={'solid'}
        p={4}
        borderRadius={8}
        borderColor={'#D9D9D9'}
        my={4}
      > */
      }
      <HStack py={2}>
        <Heading size={'md'}>
          Invités : nombre, date et repas
        </Heading>
        <BsPencil size={'30px'} color={'black'}></BsPencil>
      </HStack>
      <Box py={2}>
        <form
          onSubmit={handleSubmit(handleValidDateAndMealSubmit)}
        >
          <VStack spacing={10} py={2} alignItems={'flex-start'}>
            <Stack spacing={12} my={2} direction={['column', 'row']}>
              <FormControl
                isRequired
                isInvalid={errors.personNumber !== undefined}
                size={'sm'}
              >
                <FormLabel htmlFor="personnes" fontWeight={'bold'}>
                  {'Nombre de personnes'}
                </FormLabel>
                <Input
                  type="number"
                  placeholder="Nombre de personnes"
                  width="auto"
                  {...register('personNumber', {
                    required: 'Le nombre de régimes spéciaux est obligatoire',
                    validate(v) {
                      if (v < 0) {
                        return 'Le nombre de régimes spéciaux ne peut pas être négatif'
                      }
                    }
                  })}
                />

                <FormErrorMessage>
                  {errors.personNumber && errors.personNumber.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={errors.specialDietNumber !== undefined}
                // width={'max-content'}
              >
                <FormLabel
                  htmlFor="specialDietNumber"
                  fontWeight={'bold'}
                  width={screen.availWidth > 400 ? '400px' : '200px'}
                  // alignItems={'flex-start'}
                >
                  {'Nombre de régimes sans gluten OU lactose'}
                </FormLabel>
                <Input
                  width="auto"
                  type="number"
                  placeholder="Nombre de régimes spéciaux"
                  {...register('specialDietNumber', {
                    required: 'Le nombre de régimes spéciaux est obligatoire',
                    validate(v) {
                      console.log(personNumber.current)
                      console.log(v)
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
            </Stack>
            <Stack spacing={12} minW={600} my={4} direction={['column', 'row']}>
              <FormControl isRequired isInvalid={errors.arrivalDate !== undefined}>
                <FormLabel htmlFor="arrivalDate" fontWeight={'bold'}>
                  {"Date d'arrivée"}
                </FormLabel>
                <Input
                  id="username"
                  width={'auto'}
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
                  width={'auto'}
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
            </Stack>
            <FormControl>
              <FormLabel htmlFor="selectionRepas" fontWeight={'bold'}>
                {'Sélection des repas :'}
              </FormLabel>
              <Stack direction={['column', 'row']}>
                <Text fontWeight={'bold'}>{"Jour d'arrivée :"}</Text>
                <Checkbox {...register('isArrivalBreakfast')}>petit déjeuner</Checkbox>
                <Checkbox {...register('isArrivalLunch')}>déjeuner</Checkbox>
                <Checkbox defaultChecked {...register('isArrivalDinner')}>dîner</Checkbox>
              </Stack>
              <Stack direction={['column', 'row']}>
                <Text fontWeight={'bold'}>{'Jour de départ :'}</Text>
                <Checkbox defaultChecked {...register('isDepartureBreakfast')}>
                  petit déjeuner
                </Checkbox>
                <Checkbox {...register('isDepartureLunch')}>déjeuner</Checkbox>
                <Checkbox {...register('isDepartureDinner')}>dîner</Checkbox>
              </Stack>
            </FormControl>
            {
              /* <FormControl isRequired isInvalid={errors.specialDietNumber !== undefined}>
                <FormLabel htmlFor="selectionRepas" fontWeight={'bold'}>
                  {'Régime sans lactose OU sans gluten ?'}
                </FormLabel>

                <RadioGroup
                  defaultValue={O.isSome(props.datesAndMeals) ?
                    props.datesAndMeals.value.specialDietNumber :
                    undefined}
                >
                  <HStack spacing="24px">
                    <Radio {...register('specialDiet')} value={'true'} mb={0}>Oui</Radio>
                    <Radio {...register('specialDiet')} value={'false'}>Non</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl> */
            }
            <FormControl
              isInvalid={errors.comment !== undefined}
              width={'auto'}
              alignItems={'flex-start'}
            >
              <FormLabel
                htmlFor="comment"
                fontWeight={'bold'}
                alignItems={'flex-start'}
                // width={'auto'}
              >
                {'Commentaire:'}
              </FormLabel>
              <Textarea
                id="comment"
                // width={'500px'}
                width={screen.availWidth > 800 ?
                  '700px' :
                  screen.availWidth > 500 ?
                  '400px' :
                  '280px'}
                placeholder="Votre commentaire"
                {...register('comment')}
                minH={100}
              />

              <FormErrorMessage>
                {errors.comment && errors.comment.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.comment !== undefined}>
              <FormLabel htmlFor="comment" fontWeight={'bold'}>
                {'Nuitée :'}
              </FormLabel>

              <Checkbox
                id="withBeds"
                {
                  // onChange={updateBeds(true)}
                  ...register('withBeds')
                }
              >
                Je souhaite des lits pour mes invités
              </Checkbox>

              <FormErrorMessage>
                {errors.comment && errors.comment.message}
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
      {/* </VStack> */}
    </VStack>
  )
}

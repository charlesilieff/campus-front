import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  Select,
  Text,
  VStack
} from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as A from '@effect/data/ReadonlyArray'
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { IBedroomKind } from 'app/shared/model/bedroom-kind.model'
import type { IBookingBeds } from 'app/shared/model/bookingBeds.model'
import type { IPlace } from 'app/shared/model/place.model'
import type { IRoom } from 'app/shared/model/room.model'
import axios from 'axios'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { useParams } from 'react-router-dom'

import { PlaceModal } from '../place/placeModal'
import { Beds } from './beds'
import { backToOne, createEntity, updateEntity } from './booking-beds.reducer'
import { TextFormat } from './text-format'
import { getOnePlace, getPlaces } from './utils'

export const ReservationBedsUpdate = (): JSX.Element => {
  const [bedsToBook, setBedsToBook] = useState([] as number[])
  const reservationEntity = useAppSelector(state => state.bookingBeds.entity)
  const defaultValues = (): IBookingBeds => {
    const idBeds = reservationEntity.bedIds?.reduce(
      (acc, bedId) => ({ ...acc, [bedId?.toString()]: true }),
      {}
    )

    return { ...idBeds, ...reservationEntity }
  }
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    reset: resetForm
  } = useForm<IBookingBeds>({})

  useEffect(() => {
    resetForm(defaultValues())
  }, [reservationEntity.id])

  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const { id } = useParams<{ id: string }>()

  const loading = useAppSelector(state => state.bookingBeds.loading)

  const arrivalDate = dayjs(reservationEntity.arrivalDate).format('YYYY-MM-DD')
  const departureDate = dayjs(reservationEntity.departureDate).format('YYYY-MM-DD')

  const apiUrlPlaces = `api/bookingbeds/${arrivalDate}/${departureDate}`

  const isNew = id === undefined
  const [places, setPlaces] = useState([] as IPlace[])
  const [roomKinds, setRoomKinds] = useState([] as IBedroomKind[])
  const [rooms, setRooms] = useState([] as IRoom[])

  const [placeImage, setPlace] = useState(null as IPlace)

  useEffect(() => {
    const setPlacesAsync = async () => {
      const data = await getPlaces()
      setPlaces([...data])
    }
    setPlacesAsync()
    getBookingBeds()

    // Pour la modif d'une réservation déjà existante
    // @ts-expect-error : should be re written

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const updatedBedsToBook: number[] = reservationEntity.beds?.map((b: { id: number }) => b.id)
      .reduce(
        (acc: number[], bedId: number) => acc.concat(bedId),
        [] as number[]
      )

    pipe(
      updatedBedsToBook,
      O.fromNullable,
      O.getOrElse(() => [] as number[]),
      bedIds =>
        bedIds.concat(
          pipe(O.fromNullable(reservationEntity.bedIds), O.getOrElse(() => [] as number[]))
        ),
      setBedsToBook
    )
  }, [])

  const getBookingBeds = async (): Promise<void> => {
    const reservationId = isNew ? '' : `/${reservationEntity.id}`
    const requestUrl = `${apiUrlPlaces}${reservationId}`
    const { data } = await axios.get<IPlace[]>(requestUrl)

    data.forEach(place => place.rooms.sort((room1, room2) => room1.name.localeCompare(room2.name)))

    setPlaces(data)

    const roomsData: IRoom[] = data?.flatMap(place => place.rooms)

    setRooms(roomsData)

    setRoomKinds(
      roomsData
        .map(room => room?.bedroomKind)
        // Permet de n'afficher que les bedroomKind non null et unique
        .filter((bedroomKind, index, arr) =>
          arr?.findIndex(e => bedroomKind?.name === e?.name) === index
        )
    )
  }

  const filterBedPlace = (idPlace: number): void => {
    if (isNaN(idPlace) || idPlace === 0) {
      setRooms(
        places?.flatMap(place => place.rooms)
      )
    } else {
      setRooms(
        places
          ?.filter(place => place.id === idPlace)
          ?.flatMap(place => place.rooms)
      )
    }
  }

  const filterBedRoomKind = (idRoomKind: number): void => {
    if (isNaN(idRoomKind)) {
      setRooms(
        places?.flatMap(place => place.rooms)
      )
    } else {
      setRooms(
        places
          ?.flatMap(place => place.rooms)
          .filter(room => room.bedroomKind?.id === idRoomKind)
      )
    }
  }

  const back = (formValues: IBookingBeds): void => {
    formValues.bedIds = bedsToBook
    console.log(formValues)
    dispatch(backToOne(formValues))
  }

  const checkBedsToBook = (bedId: number) => {
    const updatedbedsToBook = bedsToBook ? [...bedsToBook] : []

    if (updatedbedsToBook.includes(bedId)) {
      updatedbedsToBook.splice(bedsToBook.indexOf(bedId), 1)
    } else {
      updatedbedsToBook.push(bedId)
    }

    setBedsToBook(updatedbedsToBook)
    console.log('bedsToBook', updatedbedsToBook)
  }

  const saveEntity = (values: IBookingBeds): void => {
    setIsLoading(true)
    console.log('values', values)
    // On sélectionne et on créer une liste d'object bed (id seulement comme attribut)
    const bedIds = pipe(Object.values(bedsToBook), A.map(O.fromNullable), A.compact)
    console.log('bedIds', bedIds)
    const customerReservation = Object.fromEntries(
      Object.entries(values).filter(entry => !Number(entry[0]))
    )

    const reservationLast = Object.fromEntries(
      Object.entries(reservationEntity).filter(entry => !Number(entry[0]))
    )

    const reservation: IBookingBeds = {
      ...reservationLast,
      ...{
        ...customerReservation,
        age: customerReservation.age === '' ? null : customerReservation.age
      },
      bedIds: [...bedIds]
    }

    if (reservation.paymentMode === '') {
      reservation.paymentMode = null
    }

    // HCau Vérue: imposer une valeur specialDiet ne pouvant pas dépasser le nombre de visiteurs.
    if (reservation?.specialDietNumber > reservation?.personNumber) {
      reservation.specialDietNumber = reservation.personNumber
    }

    if (isNew) {
      dispatch(createEntity({ entity: reservation, sendMail: true })).then(() => {
        setIsLoading(false)
      })
    } else {
      dispatch(updateEntity(reservation)).then(() => {
        setIsLoading(false)
      })
    }
  }

  // Calcul du nombre de places réservés (coché)
  const placesBooked = places?.reduce((accP, place) => (accP
    + place.rooms?.reduce((accR, room) => (accR
      + room.beds?.reduce(
        (acc, bed) => acc + (bedsToBook?.includes(bed.id) ? bed.numberOfPlaces : 0),
        0
      )), 0)), 0)

  return (
    <VStack>
      <VStack alignItems={'flex-start'}>
        <Heading
          size={'lg'}
        >
          Choisissez les lits :
        </Heading>

        <HStack>
          <Text fontWeight={'bold'}>Nom: {reservationEntity?.customer.firstname}</Text>
          <Text fontWeight={'bold'}>Prénom: {reservationEntity?.customer.lastname}</Text>
        </HStack>
        <p>
          Date d&apos;arrivée :{' '}
          <TextFormat
            value={reservationEntity?.arrivalDate}
            type="date"
            format={APP_LOCAL_DATE_FORMAT}
          />{' '}
          Date de départ :{' '}
          <TextFormat
            value={reservationEntity?.departureDate}
            type="date"
            format={APP_LOCAL_DATE_FORMAT}
          />
        </p>
        <p>Nombre de personnes à héberger : {reservationEntity.personNumber}</p>

        <Heading size={'md'}>Filtrer par lieu</Heading>
        <Select
          className="block"
          id="place"
          name="placeId"
          data-cy="place"
          style={{ padding: '0.4rem', borderRadius: '0.3rem' }}
          onChange={e => {
            getOnePlace(e.target.value).then(res => setPlace(res))
            filterBedPlace(Number(e.target.value))
          }}
        >
          <option value={0}>Aucun</option>
          {places ?
            (places?.map(p => (
              <option value={p.id} key={p.id}>
                {p.name}
              </option>
            ))) :
            <option value="" key="0" />}
        </Select>
        <PlaceModal {...placeImage} />

        <Heading size={'md'}>Filtre par type de chambre</Heading>
        <Select
          className="block"
          id="roomKind"
          name="roomKindId"
          data-cy="roomKind"
          style={{ padding: '0.4rem', borderRadius: '0.3rem' }}
          onChange={e => {
            filterBedRoomKind(Number(e.target.value))
          }}
        >
          <option value={null}>Aucune</option>
          {roomKinds ?
            (roomKinds.map((p, index) => (
              <option value={p?.id} key={index}>
                {p?.name}
              </option>
            ))) :
            <option value="" key="0" />}
        </Select>

        <p>
          {'Numéros des lit réservés : '
            + places
              ?.flatMap(place =>
                place.rooms?.flatMap(room =>
                  room.beds.map(bed => bedsToBook?.includes(bed.id) ? `${bed.number}, ` : '')
                )
              )
              .join('')}
        </p>
        <p style={{ color: reservationEntity.personNumber > placesBooked ? 'red' : 'green' }}>
          {`Nombre de personnes hébergées : ${placesBooked}`}
        </p>

        {loading ? <p>Chargement...</p> : (
          <form onSubmit={handleSubmit(saveEntity)}>
            <VStack minW={'300px'}>
              <FormControl>
                <Beds rooms={rooms} bedsToBook={bedsToBook} checkBedsToBook={checkBedsToBook} />
                <HStack>
                  <Text fontWeight={'bold'} fontSize="1.3em" color="red">
                    {`Réservation confirmée si cochée ? ${
                      reservationEntity.isConfirmed ?
                        '' :
                        "(envoi d'un email en cas de confirmation)"
                    }`}
                  </Text>
                  <Checkbox
                    id="isConfirmed"
                    placeholder="Type"
                    {...register('isConfirmed')}
                  />
                </HStack>

                <FormErrorMessage>
                  {errors.isConfirmed && errors.isConfirmed.message}
                </FormErrorMessage>
              </FormControl>
              <HStack>
                <Button
                  backgroundColor={'#17A2B8'}
                  color={'white'}
                  leftIcon={<FaArrowLeft />}
                  onClick={() => back(getValues())}
                >
                  Retour
                </Button>
                &nbsp;
                <Button
                  backgroundColor={'#E95420'}
                  color={'white'}
                  type="submit"
                  leftIcon={<FaSave />}
                  isLoading={isLoading}
                >
                  Enregistrer
                </Button>
              </HStack>
            </VStack>
          </form>
        )}
      </VStack>
    </VStack>
  )
}

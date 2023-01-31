import { Heading, HStack, Select, Text } from '@chakra-ui/react'
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { IBed } from 'app/shared/model/bed.model'
import type { IBedroomKind } from 'app/shared/model/bedroom-kind.model'
import type { IBookingBeds } from 'app/shared/model/bookingBeds.model'
import type { IPlace } from 'app/shared/model/place.model'
import type { IReservation } from 'app/shared/model/reservation.model'
import type { IRoom } from 'app/shared/model/room.model'
import { CustomValidatedField } from 'app/shared/util/cross-validation-form'
import { mapIdList } from 'app/shared/util/entity-utils'
import axios from 'axios'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { TextFormat } from 'react-jhipster'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'

import PlaceModal from '../place/placeModal'
import Beds from './beds'
import { backToOne, createEntity, updateEntity } from './booking-beds.reducer'
import { getOnePlace, getPlaces } from './utils'

export const ReservationBedsUpdate = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const reservationEntity = useAppSelector(state => state.bookingBeds.entity)
  const loading = useAppSelector(state => state.bookingBeds.loading)
  const updateSuccess = useAppSelector(state => state.bookingBeds.updateSuccess)

  const arrivalDate = dayjs(reservationEntity.arrivalDate).format('YYYY-MM-DD')
  const departureDate = dayjs(reservationEntity.departureDate).format('YYYY-MM-DD')

  const apiUrlPlaces = `api/bookingbeds/${arrivalDate}/${departureDate}`

  const isNew = id === undefined
  const [places, setPlaces] = useState([] as IPlace[])
  const [roomKinds, setRoomKinds] = useState([] as IBedroomKind[])
  const [rooms, setRooms] = useState([] as IRoom[])
  const [bedsToBook, setBedsToBook] = useState([] as number[])
  const [placeImage, setPlace] = useState(null as IPlace)

  useEffect(() => {
    getPlaces().then(data => setPlaces([...data]))
    getBookingBeds()
    let updatedbedsToBook: number[]

    // Pour la modif d'une réservation déjà existante
    updatedbedsToBook = reservationEntity.beds?.reduce(
      (acc: number[], bed: IBed) => acc.concat(bed.id),
      [] as number[]
    )

    // Pour créer l'object quand on fait des aller-retour avec le premier formulaire.
    updatedbedsToBook = updatedbedsToBook?.concat(
      Object.keys(reservationEntity).map(key =>
        Number(key) && reservationEntity[key] ? Number(key) : null
      )
    )

    setBedsToBook(updatedbedsToBook)
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const handleClose = (): void => {
    navigate('/planning')
  }

  const getBookingBeds = async (): Promise<void> => {
    const reservationId = isNew ? '' : `/${reservationEntity.id}`
    const requestUrl = `${apiUrlPlaces}${reservationId}?cacheBuster=${new Date().getTime()}`
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
    formValues.beds = mapIdList(bedsToBook)

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
  }

  const saveEntity = (values: IBookingBeds): void => {
    // On selectionne et on créer une liste d'object bed (id seulement comme atribut)
    const bedsId = Object.keys(values).map(key => Number(key) && values[key] ? Number(key) : '')

    const beds: IBed[] = mapIdList(bedsId)

    const customerReservation = Object.fromEntries(
      Object.entries(values).filter(entry => !Number(entry[0]))
    )

    const reservationLast = Object.fromEntries(
      Object.entries(reservationEntity).filter(entry => !Number(entry[0]))
    )

    const reservation: IReservation = {
      ...reservationLast,
      ...{
        ...customerReservation,
        age: customerReservation.age === '' ? null : customerReservation.age
      },
      beds
    }

    if (reservation.paymentMode === '') {
      reservation.paymentMode = null
    }

    // HCau Vérue: imposer une valeur specialDiet ne pouvant pas dépasser le nombre de visiteurs.
    if (reservation?.specialDietNumber > reservation?.personNumber) {
      reservation.specialDietNumber = reservation.personNumber
    }

    if (reservation.isLunchOnly) {
      reservation.isDepartureDiner = false
      reservation.isArrivalDiner = false
    }

    if (isNew) {
      dispatch(createEntity(reservation))
    } else {
      dispatch(updateEntity(reservation))
    }
  }

  // Calcul du nombre de places réservés (coché)
  const placesBooked = places?.reduce((accP, place) => (accP
    + place.rooms?.reduce((accR, room) => (accR
      + room.beds?.reduce(
        (acc, bed) => acc + (bedsToBook?.includes(bed.id) ? bed.numberOfPlaces : 0),
        0
      )), 0)), 0)

  const defaultValues = (): IBookingBeds => {
    const idBeds = reservationEntity.beds?.reduce(
      (acc, bed) => ({ ...acc, [bed.id?.toString()]: true }),
      new Object()
    )
    return { ...idBeds, ...reservationEntity }
  }

  const form = useForm({
    mode: 'onBlur',
    defaultValues: defaultValues()
  })

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="6">
          <Heading
            size={'lg'}
            id="gestionhebergementApp.reservation.home.createOrEditLabel"
            data-cy="ReservationCreateUpdateHeading"
          >
            Choisissez les lits :
          </Heading>
        </Col>
      </Row>
      <Row>
        <Col sm={{ size: 6, order: 2, offset: 2 }}>
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
        </Col>
      </Row>
      <Row className="justify-content-center" style={{ marginBottom: '2rem' }}>
        <Col md={{ size: 2, order: 0, offset: 2 }}>
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
        </Col>
        <Col md={{ size: 4, order: 1 }}>
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
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
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
            {'Nombre de personnes hébergées : ' + placesBooked}
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md="8">
          {loading ? <p>Chargement...</p> : (
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(saveEntity)}>
                <Beds rooms={rooms} bedsToBook={bedsToBook} checkBedsToBook={checkBedsToBook} />
                <CustomValidatedField
                  label="Moyen de paiement"
                  id="reservation-paymentMode"
                  name="paymentMode"
                  data-cy="paymentMode"
                  type="text"
                  registerOptions={{
                    minLength: { value: 2, message: 'Minimum 2.' },
                    maxLength: { value: 40, message: 'Maximum 40.' }
                  }}
                />
                <CustomValidatedField
                  label="Réservation payée ?"
                  id="reservation-isPaid"
                  name="isPaid"
                  data-cy="isPaid"
                  type="checkbox"
                />
                <br />
                <CustomValidatedField
                  label={`Réservation confirmée si cochée ? ${
                    reservationEntity.isConfirmed ? '' : "(envoi d'un email en cas de confirmation)"
                  }`}
                  id="reservation-isConfirmed"
                  name="isConfirmed"
                  data-cy="isConfirmed"
                  type="checkbox"
                  style={{ fontWeight: 'bold', fontSize: '1.3em', color: 'red' }}
                />
                <br />
                <Button
                  onClick={() => back(form.getValues())}
                  id="cancel-save"
                  data-cy="entityCreateCancelButton"
                  color="info"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  &nbsp;
                  <span className="d-none d-md-inline">Retour</span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" data-cy="stepTwo" type="submit">
                  <FontAwesomeIcon icon={faSave} />
                  &nbsp; Enregistrer
                </Button>
              </form>
            </FormProvider>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default ReservationBedsUpdate

import { Button, Checkbox, CheckboxGroup, Heading, useToast, VStack } from '@chakra-ui/react'
import * as O from '@effect/data/Option'
import * as A from '@effect/data/ReadonlyArray'
import { Place } from 'app/shared/model/place.model'
import { getHttpEntities } from 'app/shared/util/httpUtils'
import axios from 'axios'
import { identity } from 'fp-ts/lib/function'
import React, { useEffect, useState } from 'react'
import { FaSave } from 'react-icons/fa'

export const PlaceIntermittent = () => {
  const [places, setPlaces] = useState<ReadonlyArray<Place>>(A.empty)
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<ReadonlyArray<number>>(A.empty)
  const apiUrl = 'api/places/noimage'
  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast()

  const saveIntermittentPlaces = async (selectedPlaceIds: ReadonlyArray<number>) => {
    const requestUrl = `api/places/intermittent`
    setIsLoading(true)
    await axios.post(requestUrl, selectedPlaceIds)
    const placesUpdatedNames = places.filter(place => selectedPlaceIds.includes(place.id)).map(
      place => place.name
    ).join(', ')
    const message = placesUpdatedNames.length > 0 ?
      `Les intermittents peuvent réserver ces lieux : ${placesUpdatedNames}` :
      "Aucun lieu n'est disponible pour les intermittents"
    toast({
      position: 'top',
      title: 'Lieux modifiés',
      description: message,
      status: placesUpdatedNames.length > 0 ? 'success' : 'warning',
      duration: 9000,
      isClosable: true
    })

    setIsLoading(false)
  }

  useEffect(() => {
    const getPlacesAync = async () => {
      const data = await getHttpEntities(apiUrl, Place)
      setPlaces(data)
    }
    getPlacesAync()
  }, [])

  useEffect(() => {
    const intermittentPlacesIds = places.filter(place =>
      O.exists(place.intermittentAllowed, identity)
    ).map(place => place.id)

    setSelectedPlaceIds(intermittentPlacesIds)
  }, [places])

  return (
    <VStack alignContent={'flex-start'} w={'100%'} spacing={8}>
      <Heading size={'lg'}>
        Choisissez les lieux pour les intermittents
      </Heading>
      <CheckboxGroup
        onChange={e => setSelectedPlaceIds(e.map(e => Number(e)))}
        value={[...selectedPlaceIds]}
      >
        <VStack>
          {places.map(place => (
            <Checkbox
              key={place.id}
              value={place.id}
              alignSelf={'flex-start'}
              pl={12}
            >
              {`${place.name} `}
            </Checkbox>
          ))}
        </VStack>
      </CheckboxGroup>
      <Button
        variant={'save'}
        onClick={() =>
          saveIntermittentPlaces(selectedPlaceIds).catch(() => {
            alert('Une erreur est survenue')
            setIsLoading(false)
          })}
        isLoading={isLoading}
        leftIcon={<FaSave />}
      >
        Enregistrer
      </Button>
    </VStack>
  )
}

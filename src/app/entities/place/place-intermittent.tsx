import { Button, Checkbox, CheckboxGroup, Heading, VStack } from '@chakra-ui/react'
import * as A from '@effect-ts/core/Collections/Immutable/Array'
import { IPlace } from 'app/shared/model/place.model'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export const PlaceIntermittent = () => {
  const [places, setPlaces] = useState<A.Array<IPlace>>(A.empty)
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<A.Array<string>>(A.empty)
  const apiUrl = 'api/places/noimage'
  const [isLoading, setIsLoading] = useState(false)
  const getPlaces = async () => {
    const requestUrl = `${apiUrl}`
    return axios.get<A.Array<IPlace>>(requestUrl)
  }

  const saveIntermittentPlaces = async (selectedPlaceIds: A.Array<string>) => {
    const requestUrl = `api/places/intermittent`
    setIsLoading(true)
    return axios.post(requestUrl, selectedPlaceIds).then(() => setIsLoading(false)).catch(() => {
      alert('Une erreur est survenue')
      setIsLoading(false)
    })
  }

  useEffect(() => {
    getPlaces().then(res => {
      setPlaces(res.data)
    })
  }, [])

  useEffect(() => {
    const places2 = places.filter(place => place.intermittentAllowed).map(place =>
      place.id.toString()
    )

    setSelectedPlaceIds(places2)
  }, [places])
  console.log(selectedPlaceIds)

  return (
    <VStack alignContent={'flex-start'} w={'100%'}>
      <Heading size={'lg'}>
        Choisissez les lieux pour les intermittents
      </Heading>
      <CheckboxGroup
        onChange={e => setSelectedPlaceIds(e.map(e => e.toString()))}
        value={A.toMutable(selectedPlaceIds)}
      >
        <VStack alignContent={'flex-start'} w={'100%'}>
          {places.map(place => {
            return (
              <Checkbox
                key={place.id}
                value={place.id.toString()}
                alignSelf={'flex-start'}
                pl={12}
              >
                {`${place.name} `}
              </Checkbox>
            )
          })}
        </VStack>
      </CheckboxGroup>
      <Button
        colorScheme={'green'}
        onClick={() => saveIntermittentPlaces(selectedPlaceIds)}
        isLoading={isLoading}
      >
        Enregistrer
      </Button>
    </VStack>
  )
}

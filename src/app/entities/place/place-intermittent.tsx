import { Button, Checkbox, CheckboxGroup, Heading, useToast, VStack } from '@chakra-ui/react'
import { IPlace } from 'app/shared/model/place.model'
import axios from 'axios'
import * as A from 'fp-ts/lib/ReadonlyArray'
import React, { useEffect, useState } from 'react'

export const PlaceIntermittent = () => {
  const [places, setPlaces] = useState<ReadonlyArray<IPlace>>(A.empty)
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<ReadonlyArray<string>>(A.empty)
  const apiUrl = 'api/places/noimage'
  const [isLoading, setIsLoading] = useState(false)
  const getPlaces = async () => {
    const requestUrl = `${apiUrl}`
    return axios.get<ReadonlyArray<IPlace>>(requestUrl)
  }
  const toast = useToast()
  const saveIntermittentPlaces = async (selectedPlaceIds: ReadonlyArray<string>) => {
    const requestUrl = `api/places/intermittent`
    setIsLoading(true)
    return axios.post(requestUrl, selectedPlaceIds).then(() => {
      const placesUpdatedNames = places.filter(place =>
        selectedPlaceIds.includes(place.id.toString())
      ).map(place => place.name).join(', ')
      toast({
        position: 'top',
        title: 'Lieux modifiés',
        description: `Les intermittents peuvent réserver ces lieux : ${placesUpdatedNames}`,
        status: 'success',
        duration: 9000,
        isClosable: true
      })

      setIsLoading(false)
    }).catch(() => {
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
      <Heading size={'lg'} mb={4}>
        Choisissez les lieux pour les intermittents
      </Heading>
      <CheckboxGroup
        onChange={e => setSelectedPlaceIds(e.map(e => e.toString()))}
        value={A.toArray(selectedPlaceIds)}
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

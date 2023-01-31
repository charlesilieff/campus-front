import { HStack, Select } from '@chakra-ui/react'
import PlaceModal from 'app/entities/place/placeModal'
import type { IPlace } from 'app/shared/model/place.model'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export const PlaceMenu = () => {
  const apiUrlPlacesWithoutImage = 'api/places/noimage'
  const apiUrlPlaces = 'api/planning/places'
  const [places, setPlaces] = useState([] as IPlace[])
  const [place, setPlace] = useState(null as IPlace)

  const getPlaces = async () => {
    const requestUrl = `${apiUrlPlacesWithoutImage}?cacheBuster=${new Date().getTime()}`
    const { data } = await axios.get<IPlace[]>(requestUrl)

    setPlaces(data)

    getOnePlace(data[0].id.toString())
  }

  const getOnePlace = async (id: string) => {
    const requestUrl = `${apiUrlPlaces}/${id}?cacheBuster=${new Date().getTime()}`
    const { data } = await axios.get<IPlace>(requestUrl)
    setPlace(data)
  }

  useEffect(() => {
    getPlaces()
  }, [])

  return (
    <HStack my={4}>
      <Select
        width={'200px'}
        className="block"
        id="place"
        name="placeId"
        data-cy="place"
        onChange={e => {
          getOnePlace(e.target.value)
        }}
      >
        {places ?
          (places.map(p => (
            <option value={p.id} key={p.id}>
              {p.name}
            </option>
          ))) :
          <option value="" key="0" />}
      </Select>

      <PlaceModal {...place} />
    </HStack>
  )
}

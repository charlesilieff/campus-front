import { HStack, Select } from '@chakra-ui/react'
import { PlaceModal } from 'app/entities/place/placeModal'
import type { Place } from 'app/shared/model/place.model'
import axios from 'axios'
import { Option as O } from 'effect'
import { pipe } from 'effect'
import React, { useEffect, useState } from 'react'

export const PlaceMenu = () => {
  const apiUrlPlacesWithoutImage = 'api/places/noimage'
  const apiUrlPlaces = 'api/planning/places'
  const [places, setPlaces] = useState([] as Place[])

  const [place, setPlace] = useState(O.none<Place>())

  const getPlaces = async () => {
    const requestUrl = `${apiUrlPlacesWithoutImage}`
    const { data } = await axios.get<Place[]>(requestUrl)

    setPlaces(data)

    getOnePlace(data[0].id.toString())
  }

  const getOnePlace = async (id: string) => {
    const requestUrl = `${apiUrlPlaces}/${id}`
    const { data } = await axios.get<Place>(requestUrl)
    setPlace(O.some(data))
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

      {pipe(place, O.map(place => <PlaceModal key={0} {...place} />), O.getOrNull)}
    </HStack>
  )
}

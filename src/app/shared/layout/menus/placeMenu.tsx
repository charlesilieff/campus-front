import PlaceModal from 'app/entities/place/placeModal';
import { IPlace } from 'app/shared/model/place.model';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export const PlaceMenu = () => {
  const apiUrlPlacesWithoutImage = 'api/places/noimage';
  const apiUrlPlaces = 'api/planning/places';
  const [places, setPlaces] = useState([] as IPlace[]);
  const [place, setPlace] = useState(null as IPlace);

  const getPlaces = async () => {
    const requestUrl = `${apiUrlPlacesWithoutImage}?cacheBuster=${new Date().getTime()}`;
    const { data } = await axios.get<IPlace[]>(requestUrl);

    setPlaces(data);

    getOnePlace(data[0].id.toString());
  };

  const getOnePlace = async (id: string) => {
    const requestUrl = `${apiUrlPlaces}/${id}?cacheBuster=${new Date().getTime()}`;
    const { data } = await axios.get<IPlace>(requestUrl);
    setPlace(data);
  };

  useEffect(() => {
    getPlaces();
  }, []);

  return (
    <p style={{ textAlign: 'left' }}>
      <div style={{ display: 'contents' }}>
        <select
          className="block"
          id="place"
          name="placeId"
          data-cy="place"
          style={{ padding: '0.4rem', borderRadius: '0.3rem', marginLeft: '2rem' }}
          onChange={e => {
            getOnePlace(e.target.value);
          }}
        >
          {places ? (
            places.map(p => (
              <option value={p.id} key={p.id}>
                {p.name}
              </option>
            ))
          ) : (
            <option value="" key="0" />
          )}
        </select>

        <PlaceModal {...place} />
      </div>
    </p>
  );
};

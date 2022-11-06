import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getPricings } from 'app/entities/pricing/pricing.reducer';
import { ICustomer } from 'app/shared/model/customer.model';
import { IReservation } from 'app/shared/model/reservation.model';
import React, { useEffect, useState } from 'react';
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { IBookingBeds } from '../../shared/model/bookingBeds.model';
import { getEntity, reset, setData } from './reservation.reducer';

export const ReservationCustomerUpdate = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const creating = useAppSelector(state => state.bookingBeds.creating);
  const pricing = useAppSelector(state => state.pricing.entities);
  const reservationEntity = useAppSelector(state => state.bookingBeds.entity);
  const loading = useAppSelector(state => state.bookingBeds.loading);
  const updateSuccess = useAppSelector(state => state.bookingBeds.updateSuccess);

  const handleClose = () => {
    props.history.push('/planning');
  };

  useEffect(() => {
    if (!creating) {
      if (isNew) {
        dispatch(reset());
      } else {
        dispatch(getEntity(props.match.params.id));
      }
    }

    dispatch(getPricings({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = (values: IBookingBeds) => {
    const customer: ICustomer = {
      id: reservationEntity?.customer?.id,
      firstname: values.firstname,
      lastname: values.lastname,
      age: values.age,
      isFemal: true,
      comment: values.customerComment,
      email: values.email,
      phoneNumber: values.phoneNumber,
    };

    // HCau Vérue: imposer une valeur specialDiet ne pouvant pas dépasser le nombre de visiteurs.
    if (values.specialDietNumber > values.personNumber) {
      values.specialDietNumber = values.personNumber;
    }

    const reservation: IReservation = {
      ...reservationEntity,
      arrivalDate: values.arrivalDate,
      departureDate: values.departureDate,
      isArrivalDiner: values.isArrivalDiner,
      isArrivalLunch: values.isArrivalDiner,
      isDepartureDiner: values.isDepartureDiner,
      isDepartureLunch: values.isDepartureLunch,
      comment: values.reservationComment,
      isLunchOnly: values.isLunchOnly,
      personNumber: values.personNumber,
      specialDietNumber: values.specialDietNumber,
      pricing: pricing.find(it => it.id.toString() === values.pricingId.toString()),
      customer,
    };
    dispatch(setData(reservation));
  };

  const defaultValues = () => {
   

    return {
      isArrivalDiner: true,
      isDepartureDiner: false,
      isArrivalLunch: true,
      isDepartureLunch: true,
      reservationComment: reservationEntity?.comment,
      customerComment: reservationEntity?.customer?.comment,
      ...reservationEntity,
      ...reservationEntity.customer,
      pricingId: reservationEntity?.pricing?.id,
    };
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="gestionhebergementApp.reservation.home.createOrEditLabel" data-cy="ReservationCreateUpdateHeading">
            Créer ou modifier la réservation et le client.
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
               <Button
                tag={Link}
                id="cancel-save"
                data-cy="entityCreateCancelButton"
                to="/planning"
                replace
                style={{ backgroundColor: '#114B5F', color: 'white' }}
              >
                &nbsp;
                <span className="d-none d-md-inline">Annuler</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="stepTwo" type="submit">
                <FontAwesomeIcon icon="save" />
                &nbsp; Suivant
              </Button>
              <ValidatedField
                label="Prénom"
                id="customer-firstname"
                name="firstname"
                data-cy="firstname"
                type="text"
                validate={{
                  required: { value: true, message: 'Ce champ est requis.' },
                  minLength: { value: 1, message: 'Ce champ est requis et doit avoir au moins 1 caractère.' },
                  maxLength: { value: 50, message: 'Ce champ ne peut pas dépasser plus de 50 caractères.' },
                }}
              />
              <ValidatedField
                label="Nom"
                id="customer-lastname"
                name="lastname"
                data-cy="lastname"
                type="text"
                validate={{
                  required: { value: true, message: 'Ce champ est requis.' },
                  minLength: { value: 1, message: 'Ce champ est requis et doit avoir au moins 1 caractère.' },
                  maxLength: { value: 50, message: 'Ce champ ne peut pas dépasser plus de 50 caractères.' },
                }}
              />
              <ValidatedField
                label="Age"
                id="customer-age"
                name="age"
                data-cy="age"
                type="text"
                validate={{
                  min: { value: 1, message: 'Age minimum: 1 an.' },
                  max: { value: 125, message: 'Age maximum: 125 ans.' },
                  validate: v => isNumber(v) || 'Ce champ doit contenir un nombre.',
                }}
              />
              {/* <ValidatedField label="Genre" id="customer-isFemal" name="isFemal" data-cy="isFemal" type="select">
                <option value="true" key="0">
                  Femme
                </option>
                <option value="false" key="1">
                  Homme
                </option>
              </ValidatedField> */}
              <ValidatedField
                label="Téléphone"
                id="customer-phoneNumber"
                name="phoneNumber"
                data-cy="phoneNumber"
                type="text"
                validate={{
                  required: { value: true, message: 'Le numéro de téléphone est obligatoire.' },
                  minLength: { value: 10, message: 'Minimum 10' },
                  maxLength: { value: 16, message: 'Maximum 16' },
                }}
              />
              <ValidatedField
                label="Email"
                id="customer-email"
                name="email"
                data-cy="email"
                type="text"
                validate={{
                  required: { value: true, message: 'Ce champ est requis.' },
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Adresse email invalide.',
                  },
                }}
              />
              <ValidatedField
                label="Remarque sur le client"
                id="customer-comment"
                name="customerComment"
                data-cy="comment"
                type="textarea"
                validate={{
                  maxLength: { value: 400, message: 'Ce champ ne doit pas dépasser 400 caractères.' },
                }}
              />
              <ValidatedField
                label="Nombre de personnes à héberger"
                id="reservation-personNumber"
                name="personNumber"
                data-cy="personNumber"
                type="number"
                validate={{
                  required: { value: true, message: 'Valeur requise' },
                  min: { value: 1, message: 'Le nombre doit être au minimum 1.' },
                  max: { value: 1000, message: 'Le nombre ne doit pas dépasser 1000.' },
                  validate: v => isNumber(v) || 'Ce champ doit contenir un nombre.',
                }}
              />
              <ValidatedField
                label="Nombre de régimes sans gluten OU sans lactose."
                id="reservation-specialDietNumber"
                name="specialDietNumber"
                data-cy="specialDietNumber"
                type="number"
                validate={{
                  required: { value: true, message: 'Valeur requise' },
                  min: { value: 0, message: 'Minimum 0' },
                  max: { value: 1000, message: 'Max 1000' },
                  validate: value => isNumber(value) || 'Tapez un nombre',
                }}
              />
              <ValidatedField
                label="Mange uniquement le midi, et n'est pas hébérgé au campus."
                id="reservation-isLunchOnly"
                name="isLunchOnly"
                data-cy="isLunchOnly"
                type="checkbox"
                check
              />
              <p style={{ color: 'red' }}>Si l&apos;option est cochée, alors les options de repas ci-dessous n&apos;ont aucun effet.</p>
              <ValidatedField
                label="Prévoir le repas du midi, d'arrivée"
                id="reservation-isArrivalLunch"
                name="isArrivalLunch"
                data-cy="isArrivalLunch"
                type="checkbox"
                check
              />
              <ValidatedField
                label="Prévoir le repas du soir, d'arrivée"
                id="reservation-isArrivalDiner"
                name="isArrivalDiner"
                data-cy="isArrivalDiner"
                type="checkbox"
                check
              />
              <ValidatedField
                label="Prévoir le repas du midi, du départ"
                id="reservation-isDepartureLunch"
                name="isDepartureLunch"
                data-cy="isDepartureLunch"
                type="checkbox"
                check
              />
              <ValidatedField
                label="Prévoir le repas du soir, du départ"
                id="reservation-isDepartureDiner"
                name="isDepartureDiner"
                data-cy="isDepartureDiner"
                type="checkbox"
                check
              />
              <ValidatedField
                label="Date d'arrivée"
                id="reservation-arrivalDate"
                name="arrivalDate"
                data-cy="arrivalDate"
                type="date"
                validate={{
                  required: { value: true, message: 'Valeur requise' },
                }}
              />
              <ValidatedField
                label="Date de départ"
                id="reservation-departureDate"
                name="departureDate"
                data-cy="departureDate"
                type="date"
                validate={{
                  required: { value: true, message: 'Valeur requise' },
                }}
              />
              <ValidatedField
                label="Commentaire"
                id="reservation-comment"
                name="reservationComment"
                data-cy="comment"
                type="textarea"
                validate={{
                  maxLength: { value: 400, message: 'Max 400' },
                }}
              />
              <ValidatedField id="reservation-pricing" name="pricingId" data-cy="pricing" label="Tarif" type="select">
                <option value="" key="0" />
                {pricing
                  ? pricing.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.wording}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              {!isNew ? (
                <Button tag={Link} id="back" data-cy="entityBackButton" to={`/bookingbeds/${reservationEntity.id}`} replace color="info">
                  &nbsp;
                  <FontAwesomeIcon icon="arrow-left" />
                  <span className="d-none d-md-inline">Retour</span>
                </Button>
              ) : (
                ''
              )}
              &nbsp;
              <Button
                tag={Link}
                id="cancel-save"
                data-cy="entityCreateCancelButton"
                to="/planning"
                replace
                style={{ backgroundColor: '#114B5F', color: 'white' }}
              >
                &nbsp;
                <span className="d-none d-md-inline">Annuler</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="stepTwo" type="submit">
                <FontAwesomeIcon icon="save" />
                &nbsp; Suivant
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ReservationCustomerUpdate;

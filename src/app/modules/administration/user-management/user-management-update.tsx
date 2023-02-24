import { Button, Heading, HStack, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { IUser } from 'app/shared/model/user.model'
import React, { useEffect } from 'react'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { isEmail, ValidatedField, ValidatedForm } from 'react-jhipster'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { createUser, getRoles, getUser, reset, updateUser } from './user-management.reducer'

export const UserManagementUpdate = () => {
  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const { login } = useParams<'login'>()
  const isNew = login === undefined

  useEffect(() => {
    if (isNew) {
      dispatch(reset())
    } else {
      dispatch(getUser(login))
    }
    dispatch(getRoles())
    return () => {
      dispatch(reset())
    }
  }, [login])

  const handleClose = () => {
    navigate('/admin/user-management')
  }

  const saveUser = (values: IUser) => {
    if (isNew) {
      dispatch(createUser(values))
    } else {
      dispatch(updateUser(values))
    }
    handleClose()
  }

  const isInvalid = false
  const user = useAppSelector(state => state.userManagement.user)
  const loading = useAppSelector(state => state.userManagement.loading)
  const updating = useAppSelector(state => state.userManagement.updating)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const authorities = useAppSelector(state => state.userManagement.authorities)

  return (
    <VStack>
      <Heading>Créer ou éditer un utilisateur</Heading>

      {loading ? <p>Loading...</p> : (
        <ValidatedForm onSubmit={saveUser} defaultValues={user}>
          <ValidatedField
            type="text"
            name="login"
            label="Login"
            validate={{
              required: {
                value: true,
                message: "Votre nom d'utilisateur est obligatoire."
              },
              pattern: {
                value:
                  /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/,
                message: "Votre nom d'utilisateur est invalide."
              },
              minLength: {
                value: 1,
                message: "Votre nom d'utilisateur doit contenir plus d'un caractère."
              },
              maxLength: {
                value: 50,
                message: "Votre nom d'utilisateur ne peut pas contenir plus de 50 caractères."
              }
            }}
          />
          <ValidatedField
            type="text"
            name="firstName"
            label="Prénom"
            validate={{
              maxLength: {
                value: 50,
                message: 'Ce champ doit faire moins de 50 caractères.'
              }
            }}
          />
          <ValidatedField
            type="text"
            name="lastName"
            label="Nom"
            validate={{
              maxLength: {
                value: 50,
                message: 'Ce champ doit faire moins de 50 caractères.'
              }
            }}
          />

          <ValidatedField
            name="email"
            label="Email"
            placeholder="Votre email"
            type="email"
            validate={{
              required: {
                value: true,
                message: 'Votre email est requis.'
              },
              minLength: {
                value: 5,
                message: 'Votre email doit comporter au moins 5 caractères.'
              },
              maxLength: {
                value: 254,
                message: 'Votre email ne doit pas comporter plus de 50 caractères.'
              },
              validate: v => isEmail(v) || "Votre email n'est pas valide."
            }}
          />
          <ValidatedField
            type="checkbox"
            name="activated"
            check
            value={true}
            disabled={!user.id}
            label="Activé"
          />
          <ValidatedField type="select" name="authorities" multiple label="Droits">
            {authorities.map(role => (
              <option value={role} key={role}>
                {role}
              </option>
            ))}
          </ValidatedField>
          <HStack>
            <Button
              as={Link}
              to="/admin/user-management"
              variant={'back'}
              leftIcon={<FaArrowLeft />}
            >
              Retour
            </Button>

            <Button
              variant="save"
              type="submit"
              disabled={isInvalid || updating}
              leftIcon={<FaSave />}
            >
              Sauvegarder
            </Button>
          </HStack>
        </ValidatedForm>
      )}
    </VStack>
  )
}

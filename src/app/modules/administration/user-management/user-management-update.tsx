import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  VStack
} from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { IUser } from 'app/shared/model/user.model'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { ValidatedField } from 'react-jhipster'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { createUser, getRoles, getUser, reset, updateUser } from './user-management.reducer'

interface UserForm {
  login: string
  firstName: string
  lastName: string
  email: string
  activated: boolean
  langKey: string
  authorities: string[]
}
export const UserManagementUpdate = () => {
  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const { login } = useParams<'login'>()
  const isNew = login === undefined
  const user = useAppSelector(state => state.userManagement.user)
  useEffect(() => {
    if (isNew) {
      dispatch(reset())
    } else {
      dispatch(getUser(login))
      setIsActivated(user.activated)
    }
    dispatch(getRoles())
    return () => {
      dispatch(reset())
    }
  }, [login])

  const [isActivated, setIsActivated] = React.useState(true)
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<UserForm>({
    defaultValues: user
  })
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

  const loading = useAppSelector(state => state.userManagement.loading)
  const updating = useAppSelector(state => state.userManagement.updating)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const authorities = useAppSelector(state => state.userManagement.authorities)

  return (
    <VStack>
      <Heading>{isNew ? 'Créer' : 'Éditer'} un utilisateur</Heading>

      {loading ? <p>Loading...</p> : (
        <form
          onSubmit={handleSubmit(saveUser)}
        >
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={errors.login !== undefined}>
              <FormLabel htmlFor="login" fontWeight={'bold'}>
                {'Login'}
              </FormLabel>
              <Input
                id="login"
                type="text"
                placeholder="Login"
                {...register('login', {
                  required: 'Le login est obligatoire',
                  minLength: {
                    value: 2,
                    message: 'This field is required to be at least 4 characters.'
                  },
                  maxLength: {
                    value: 20,
                    message: 'This field cannot be longer than 20 characters.'
                  }
                })}
              />

              <FormErrorMessage>
                {errors.login && errors.login.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.firstName !== undefined}>
              <FormLabel htmlFor="firstName" fontWeight={'bold'}>
                {'Prénom'}
              </FormLabel>
              <Input
                id="firstName"
                type="text"
                placeholder="Prénom"
                {...register('firstName', {
                  maxLength: {
                    value: 50,
                    message: 'Ce champ doit faire moins de 50 caractères.'
                  }
                })}
              />

              <FormErrorMessage>
                {errors.lastName && errors.lastName.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.lastName !== undefined}>
              <FormLabel htmlFor="lastName" fontWeight={'bold'}>
                {'Nom'}
              </FormLabel>
              <Input
                id="lastName"
                type="text"
                placeholder="Nom"
                {...register('lastName', {
                  maxLength: {
                    value: 50,
                    message: 'Ce champ doit faire moins de 50 caractères.'
                  }
                })}
              />

              <FormErrorMessage>
                {errors.lastName && errors.lastName.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.email !== undefined}>
              <FormLabel htmlFor="email" fontWeight={'bold'}>
                {'Email'}
              </FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                {...register('email', {
                  required: "L'email est obligatoire",
                  minLength: {
                    value: 2,
                    message: 'This field is required to be at least 4 characters.'
                  },
                  maxLength: {
                    value: 20,
                    message: 'This field cannot be longer than 20 characters.'
                  }
                })}
              />

              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            <CheckboxGroup>
              <VStack>
                <Checkbox
                  disabled={!user.id}
                  isChecked={isActivated}
                  alignSelf={'flex-start'}
                  pl={12}
                  onChange={e => setIsActivated(e.target.checked)}
                >
                  Activé
                </Checkbox>
              </VStack>
            </CheckboxGroup>
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
          </VStack>
        </form>
      )}
    </VStack>
  )
}

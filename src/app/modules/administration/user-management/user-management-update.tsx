import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  useToast,
  VStack
} from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as A from '@effect/data/ReadonlyArray'
import * as String from '@effect/data/String'
import * as S from '@effect/schema/Schema'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { schemaResolver } from 'app/entities/bed/resolver'
import type { Authorities } from 'app/shared/model/user.model'
import { User } from 'app/shared/model/user.model'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { createUser, getRoles, getUser, reset, updateUser } from './user-management.reducer'

export const UserManagementUpdate = () => {
  const [authoritiesSelected, setAuthoritiesSelected] = React.useState<readonly Authorities[]>([])
  const currentUser = pipe(
    useAppSelector(state => state.authentication.account),
    O.map(a => a.login),
    O.getOrElse(() => '')
  )
  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const { login } = useParams<'login'>()
  const isNew = login === undefined
  const user = useAppSelector(state => state.userManagement.user)
  const updateSuccess = useAppSelector(state => state.userManagement.updateSuccess)

  const toast = useToast()

  const defaultValues = (user: O.Option<User>) =>
    isNew || !O.isSome(user) ?
      {
        activated: true,
        createdBy: currentUser,
        langKey: 'fr-FR',
        lastModifiedBy: currentUser,
        authorities: []
      } :
      S.encode(User)(user.value)
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

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset: resetForm
  } = useForm({
    resolver: schemaResolver(User)
  })

  useEffect(() => {
    resetForm(defaultValues(user))
  }, [pipe(user, O.map(u => u.id), O.getOrNull)])
  useEffect(() => {
    pipe(user, O.map(({ authorities }) => setAuthoritiesSelected(authorities)))
  }, [pipe(user, O.map(u => u.authorities), O.getOrNull)])

  useEffect(() => {
    if (updateSuccess) {
      toast({
        position: 'top',
        title: `L'utilisateur a bien été ${isNew ? 'créé' : 'modifié'}.`,
        status: 'success',
        duration: 9000,
        isClosable: true
      })
      navigate('/admin/user-management')
    }
  }, [updateSuccess])

  const saveUser = (authoritiesSelected: readonly Authorities[]) => (values: User) => {
    if (isNew) {
      dispatch(createUser({ ...values, authorities: authoritiesSelected }))
    } else {
      dispatch(updateUser({ ...values, authorities: authoritiesSelected }))
    }
  }
  const saveUserWithAuthorities = saveUser(authoritiesSelected)
  console.log(errors)
  const loading = useAppSelector(state => state.userManagement.loading)
  const updating = useAppSelector(state => state.userManagement.updating)

  const authorities = useAppSelector(state => state.userManagement.authorities)

  return (
    <VStack>
      <Heading>{isNew ? 'Créer' : 'Éditer'} un utilisateur</Heading>

      {loading ? <p>Loading...</p> : (
        <form
          onSubmit={handleSubmit(v => saveUserWithAuthorities(v as unknown as User))}
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
                    value: 4,
                    message: 'This field is required to be at least 4 characters.'
                  }
                })}
              />

              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>

            <Checkbox
              disabled={!pipe(user, O.map(u => u.id), O.exists(O.isSome))}
              alignSelf={'flex-start'}
              {...register('activated')}
            >
              Activé
            </Checkbox>

            <VStack alignItems={'flex-start'}>
              <FormLabel fontWeight={'bold'}>
                {'Rôles'}
              </FormLabel>
              <VStack alignItems={'flex-start'}>
                {authorities.map(role => (
                  <Checkbox
                    value={role}
                    disabled={(role === 'ROLE_HABITANT' && pipe(
                      authoritiesSelected,
                      A.contains(
                        String.Equivalence
                      )('ROLE_EMPLOYEE')
                    ))
                      || (role === 'ROLE_EMPLOYEE'
                        && pipe(
                          authoritiesSelected,
                          A.contains(String.Equivalence)('ROLE_HABITANT')
                        ))}
                    onChange={e => {
                      if (e.target.checked) {
                        setAuthoritiesSelected([...authoritiesSelected, role])
                      } else {
                        setAuthoritiesSelected(authoritiesSelected.filter(a => a !== role))
                      }
                    }}
                    isChecked={authoritiesSelected.includes(role)}
                    key={role}
                  >
                    {role}
                  </Checkbox>
                ))}
              </VStack>
            </VStack>

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
                disabled={updating}
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

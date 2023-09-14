import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack
} from '@chakra-ui/react'
import * as S from '@effect/schema/Schema'
import { schemaResolver } from 'app/entities/bed/resolver'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

const UserForm = S.struct({
  username: S.string,
  password: S.string,
  rememberMe: S.boolean
})

type UserForm = S.Schema.To<typeof UserForm>
type UserFormEncoded = S.Schema.From<typeof UserForm>

export interface ILoginModalProps {
  showModal: boolean
  loginError: boolean
  handleLogin: (username: string, password: string, rememberMe: boolean) => void
  handleClose: () => void
}

export const LoginModal = (props: ILoginModalProps) => {
  const login = (
    { username, password, rememberMe }: UserForm
  ) => {
    props.handleLogin(username, password, rememberMe)
  }

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<UserFormEncoded>({ mode: 'onTouched', resolver: schemaResolver(UserForm) })

  const { loginError, handleClose } = props

  return (
    <Modal
      isOpen={props.showModal}
      onClose={handleClose}
      autoFocus={false}
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <form
          onSubmit={handleSubmit(v => login(v as unknown as UserForm))}
        >
          <ModalHeader id="login-title" data-cy="loginTitle">
            Connexion
          </ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              {loginError ?
                (
                  <Alert status="error" data-cy="loginError">
                    <strong>Impossible de se connecter !</strong>{' '}
                    Vérifier votre mot de passe et/ou votre nom d&apos;utilisateur.
                  </Alert>
                ) :
                null}

              <FormControl isRequired isInvalid={errors.username !== undefined}>
                <FormLabel htmlFor="username" fontWeight={'bold'}>
                  {"Nom d'utilisateur"}
                </FormLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nom d'utilisateur"
                  {...register('username', {
                    required: "Le nom d'utilisateur est obligatoire"
                  })}
                />

                <FormErrorMessage>
                  {errors.username && errors.username.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={errors.password !== undefined}>
                <FormLabel htmlFor="password" fontWeight={'bold'}>
                  {'Mot de passe'}
                </FormLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mot de passe"
                  {...register('password', {
                    required: 'Le mot de passe ne peut pas être vide.'
                  })}
                />

                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl>
                <HStack>
                  <Text fontWeight={'bold'}>{'Souvenez-vous de moi'}</Text>
                  <Checkbox
                    id="rememberMe"
                    placeholder="Type"
                    {...register('rememberMe')}
                  />
                </HStack>

                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>

              <VStack w="100%">
                <Alert status="warning">
                  <Link to="/account/reset/request" data-cy="forgetYourPasswordSelector">
                    Avez-vous oublié votre mot de passe ?
                  </Link>
                </Alert>
                <Alert status="warning">
                  <HStack>
                    <span>Vous n&apos;avez pas encore de compte ?</span>{' '}
                    <Link to="/account/register">Créer un compte.</Link>
                  </HStack>
                </Alert>
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button variant="back" onClick={handleClose} tabIndex={1}>
                Annuler
              </Button>
              <Button variant="save" type="submit" data-cy="submit">
                Se connecter
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

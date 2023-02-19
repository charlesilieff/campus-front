import { Button } from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { ValidatedField } from 'react-jhipster'
import { Link } from 'react-router-dom'
import { Alert, Col, Form, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'

export interface ILoginModalProps {
  showModal: boolean
  loginError: boolean
  handleLogin: (username: string, password: string, rememberMe: boolean) => void
  handleClose: () => void
}

export const LoginModal = (props: ILoginModalProps) => {
  const login = (
    { username, password, rememberMe }: { username: string; password: string; rememberMe: boolean }
  ) => {
    props.handleLogin(username, password, rememberMe)
  }

  const {
    handleSubmit,
    register,
    formState: { errors, touchedFields }
  } = useForm({ mode: 'onTouched' })

  const { loginError, handleClose } = props

  return (
    <Modal
      isOpen={props.showModal}
      toggle={handleClose}
      backdrop="static"
      id="login-page"
      autoFocus={false}
    >
      <Form onSubmit={handleSubmit(login)}>
        <ModalHeader id="login-title" data-cy="loginTitle" toggle={handleClose}>
          Connexion
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md="12">
              {loginError ?
                (
                  <Alert color="danger" data-cy="loginError">
                    <strong>Impossible de se connecter to sign in!</strong>{' '}
                    Vérifier votre mot de passe et/ou votre nom d&apos;utilisateur.
                  </Alert>
                ) :
                null}
            </Col>
            <Col md="12">
              <ValidatedField
                name="username"
                label="Nom d'utilisateur"
                placeholder="Votre nom d'utilisateur"
                required
                autoFocus
                data-cy="username"
                validate={{
                  required: "Le nom d'utilisateur ne peut pas être vide."
                }}
                register={register}
                // @ts-expect-error react-hook-form types are not up to date
                error={errors.username}
                isTouched={touchedFields.username}
              />
              <ValidatedField
                name="password"
                type="password"
                label="Mot de passe"
                placeholder="Mot de passe"
                required
                data-cy="password"
                validate={{
                  required: 'Le mot de passe ne peut pas être vide.'
                }}
                register={register}
                // @ts-expect-error react-hook-form types are not up to date
                error={errors.password}
                isTouched={touchedFields.password}
              />
              <ValidatedField
                name="rememberMe"
                type="checkbox"
                check
                label="Souvenez-vous de moi"
                value={true}
                register={register}
              />
            </Col>
          </Row>
          <div className="mt-1">&nbsp;</div>
          <Alert color="warning">
            <Link to="/account/reset/request" data-cy="forgetYourPasswordSelector">
              Avez-vous oublié votre mot de passe ?
            </Link>
          </Alert>
          <Alert color="warning">
            <span>Vous n&apos;avez pas encore de compte ?</span>{' '}
            <Link to="/account/register">Créer un compte.</Link>
          </Alert>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleClose} tabIndex={1}>
            Annuler
          </Button>{' '}
          <Button backgroundColor={'#17a2b8'} color={'white'} type="submit" data-cy="submit">
            Se connecter
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

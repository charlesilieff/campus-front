import { useAppDispatch, useAppSelector } from 'app/config/store'
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar'
import React, { useEffect, useState } from 'react'
import { isEmail, ValidatedField, ValidatedForm } from 'react-jhipster'
import { toast } from 'react-toastify'
import { Button, Col, Row } from 'reactstrap'

import { handleRegister, reset } from './register.reducer'

export const RegisterPage = () => {
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()

  useEffect(
    () => () => {
      dispatch(reset())
    },
    []
  )

  const handleValidSubmit = ({ username, email, firstPassword }) => {
    dispatch(
      handleRegister({
        login: username,
        email,
        password: firstPassword,
        langKey: 'en'
      })
    )
  }

  const updatePassword = event => setPassword(event.target.value)

  const successMessage = useAppSelector(state => state.register.successMessage)

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
    }
  }, [successMessage])

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h1 id="register-title" data-cy="registerTitle">
            Création d&apos;un compte
          </h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          <ValidatedForm id="register-form" onSubmit={handleValidSubmit}>
            <ValidatedField
              name="username"
              label="Nom d'utilisateur"
              placeholder={"Nom d'utilisateur"}
              validate={{
                required: {
                  value: true,
                  message: "Votre nom d'utilisateur est obligatoire."
                },
                pattern: {
                  value:
                    /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/,
                  message: "Votre nom d'utilisateur n'est valide."
                },
                minLength: {
                  value: 2,
                  message: "Votre nom d'utilisateur doit comporter au moins 2 caractère."
                },
                maxLength: {
                  value: 50,
                  message: "Votre nom d'utilisateur ne doit pas comporter plus de 50 caractères."
                }
              }}
              data-cy="username"
            />
            <ValidatedField
              name="email"
              label="Email"
              placeholder={'Votre email'}
              type="email"
              validate={{
                required: {
                  value: true,
                  message: 'Votre email est obligatoire.'
                },
                minLength: {
                  value: 5,
                  message: "Votre email d'utilisateur doit comporter au moins 2 caractère."
                },
                maxLength: {
                  value: 254,
                  message: 'Votre email ne doit pas comporter plus de 254 caractères.'
                },
                validate: v => isEmail(v) || "Votre email n'est pas valide."
              }}
              data-cy="email"
            />
            <ValidatedField
              name="firstPassword"
              label="Nouveau mot de passe"
              placeholder={'Mot de passe'}
              type="password"
              onChange={updatePassword}
              validate={{
                required: {
                  value: true,
                  message: 'Votre mot de passe est obligatoire.'
                },
                minLength: {
                  value: 4,
                  message: 'Votre mot de passe ne doit pas comporter moins de 4 caractères.'
                },
                maxLength: {
                  value: 50,
                  message: 'Votre mot de passe ne doit pas comporter plus de 50 caractères.'
                }
              }}
              data-cy="firstPassword"
            />
            <PasswordStrengthBar password={password} />
            <ValidatedField
              name="secondPassword"
              label="Confirmation du mot de passe"
              placeholder="Confirmez votre mot de passe"
              type="password"
              validate={{
                required: {
                  value: true,
                  message: 'La confirmation du mot de passe est obligatoire.'
                },
                minLength: {
                  value: 4,
                  message:
                    'Votre confirmation de mot de passe ne doit pas comporter moins de 4 caractères.'
                },
                maxLength: {
                  value: 50,
                  message:
                    'Votre confirmation de mot de passe ne doit pas comporter plus de 50 caractères.'
                },
                validate: v =>
                  v === password || 'Le mot de passe et la confirmation ne correspondent pas.'
              }}
              data-cy="secondPassword"
            />
            <Button id="register-submit" color="primary" type="submit" data-cy="submit">
              Enregistrez-vous
            </Button>
          </ValidatedForm>
        </Col>
      </Row>
    </div>
  )
}

export default RegisterPage

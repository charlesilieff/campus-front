import './password-strength-bar.scss'

import React from 'react'

export interface IPasswordStrengthBarProps {
  password: string
}

export const PasswordStrengthBar = ({ password }: IPasswordStrengthBarProps): JSX.Element => {
  const colors = ['#F00', '#F90', '#FF0', '#9F0', '#0F0']

  const measureStrength = (p: string): number => {
    let force = 0
    const regex = /[$-/:-?{-~!"^_`[\]]/g
    const flags = {
      lowerLetters: /[a-z]+/.test(p),
      upperLetters: /[A-Z]+/.test(p),
      numbers: /[0-9]+/.test(p),
      symbols: regex.test(p)
    }

    const passedMatches =
      Object.values(flags).filter((isMatchedFlag: boolean) => !!isMatchedFlag).length

    force += 2 * p.length + (p.length >= 10 ? 1 : 0)
    force += passedMatches * 10

    // penalty (short password)
    force = p.length <= 6 ? Math.min(force, 10) : force

    // penalty (poor variety of characters)
    force = passedMatches === 1 ? Math.min(force, 10) : force
    force = passedMatches === 2 ? Math.min(force, 20) : force
    force = passedMatches === 3 ? Math.min(force, 40) : force

    return force
  }

  const getColor = (s: number): { idx: number; col: string } => {
    let idx = 0
    if (s > 10) {
      if (s <= 20) {
        idx = 1
      } else if (s <= 30) {
        idx = 2
      } else if (s <= 40) {
        idx = 3
      } else {
        idx = 4
      }
    }
    return { idx: idx + 1, col: colors[idx] }
  }

  const getPoints = (
    force: 0 | {
      idx: number
      col: string
    }
  ) => {
    const pts: JSX.Element[] = []
    for (let i = 0; i < 5; i++) {
      pts.push(
        <li
          key={i}
          className="point"
          style={force !== 0 && i < force.idx ?
            { backgroundColor: force.col } :
            { backgroundColor: '#DDD' }}
        />
      )
    }
    return pts
  }

  const strength = typeof password === 'string' ? getColor(measureStrength(password)) : 0
  const points = getPoints(strength)

  return (
    <div id="strength">
      <small>Force du mot de passe:</small>
      <ul id="strengthBar">{points}</ul>
    </div>
  )
}

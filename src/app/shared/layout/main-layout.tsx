import { HStack } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import React from 'react'

import { Brand, Help, Home } from './header/header-components'
import { VFixedLayout } from './header/VFixedLayout'
import { AccountMenu, AdminMenu, EntitiesMenu } from './menus'

export interface IHeaderProps {
  isAuthenticated: boolean
  isIntermittent: boolean
  isAdmin: boolean
  isResp: boolean
  ribbonEnv: string
  isInProduction: boolean
  isOpenAPIEnabled: boolean
  isUser: boolean
  main: ReactNode
}

export const MainLayout = (props: IHeaderProps) => (
  <VFixedLayout
    top={
      <HStack backgroundColor={'#E95420'} justifyContent={'space-between'} px={4}>
        <Brand />

        <HStack>
          {!window.location.pathname.endsWith('reservation-request/new') && <Help />}
          {!window.location.pathname.endsWith('reservation-request/new') && <Home />}

          {props.isAuthenticated && (
            <EntitiesMenu
              isResp={props.isResp}
              isIntermittent={props.isIntermittent}
              isUser={props.isUser}
            />
          )}
          {props.isAuthenticated && props.isAdmin && (
            <AdminMenu showOpenAPI={props.isOpenAPIEnabled} />
          )}
          {!window.location.pathname.endsWith('reservation-request/new') && (
            <AccountMenu isAuthenticated={props.isAuthenticated} />
          )}
        </HStack>
      </HStack>
    }
    main={props.main}
  />
)

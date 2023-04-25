import { HStack, Stack } from '@chakra-ui/react'
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
  isHabitant: boolean
}

export const MainLayout = (props: IHeaderProps) => (
  <VFixedLayout
    top={
      <HStack backgroundColor={'#E95420'} justifyContent={'space-between'} px={4}>
        <Brand />

        <Stack direction={{ base: 'column-reverse', md: 'row' }} maxH="190px">
          {!window.location.pathname.endsWith('reservation-request/new') && <Help />}
          {!window.location.pathname.endsWith('reservation-request/new') && <Home />}

          {props.isAuthenticated && (
            <EntitiesMenu
              isResp={props.isResp}
              isIntermittent={props.isIntermittent}
              isUser={props.isUser}
              isHabitant={props.isHabitant}
            />
          )}
          {props.isAuthenticated && props.isAdmin && (
            <AdminMenu showOpenAPI={props.isOpenAPIEnabled} />
          )}
          {!window.location.pathname.endsWith('reservation-request/new') && (
            <AccountMenu isAuthenticated={props.isAuthenticated} />
          )}
        </Stack>
      </HStack>
    }
    main={props.main}
  />
)

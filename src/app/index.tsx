import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'

import { App as AppComponent } from './app'
import { setupAxiosInterceptors } from './config/axios-interceptor'
import { getStore } from './config/store'
import { theme } from './config/theme'
import { ErrorBoundary } from './shared/error/error-boundary'
import { clearAuthentication } from './shared/reducers/authentication'

const store = getStore()

const actions = bindActionCreators({ clearAuthentication }, store.dispatch)
setupAxiosInterceptors(() => actions.clearAuthentication('login.error.unauthorized'))

const rootEl = document.getElementById('root')
const root = rootEl !== null ? createRoot(rootEl) : null
const render = Component => {
  // eslint-disable-next-line react/no-render-return-value
  if (root) {
    root.render(
      <ErrorBoundary>
        <ChakraProvider theme={theme}>
          <Provider store={store}>
            <div>
              <Component />
            </div>
          </Provider>
        </ChakraProvider>
      </ErrorBoundary>
    )
  }
}
render(AppComponent)

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ChakraProvider } from '@chakra-ui/react'
import getStore from './config/store';
import setupAxiosInterceptors from './config/axios-interceptor';
import { clearAuthentication } from './shared/reducers/authentication';
import ErrorBoundary from './shared/error/error-boundary';
import AppComponent from './app';
import { loadIcons } from './config/icon-loader';

const store = getStore();

const actions = bindActionCreators({ clearAuthentication }, store.dispatch);
setupAxiosInterceptors(() => actions.clearAuthentication('login.error.unauthorized'));

loadIcons();

const rootEl = document.getElementById('root');
const root = createRoot(rootEl);
const render = Component =>
  // eslint-disable-next-line react/no-render-return-value
  root.render(
    <ErrorBoundary>
      <ChakraProvider>
      <Provider store={store}>
        <div>
          <Component />
        </div>
      </Provider>
      </ChakraProvider>
    </ErrorBoundary>,
  );

render(AppComponent);

import {createMemoryHistory} from 'history';
import React from 'react';
import {Provider} from 'react-redux';
import {Router} from 'react-router-dom';
import {RestfulProvider} from 'restful-react';

import {render} from '@testing-library/react';
import {renderHook} from '@testing-library/react-hooks';

import {ApprovedAny} from '../@types';
import {createStore} from '../store';

export function getRestfulWrapper(base: string) {
  const RestfulWrapper: React.FC = ({children}) => {
    return <RestfulProvider base={base}>{children}</RestfulProvider>;
  };
  return {
    base,
    RestfulWrapper,
  };
}

export function getProviderWrapper(
  setupStore?: (store: ReturnType<typeof createStore>) => void
) {
  const store = createStore();
  setupStore && setupStore(store);
  const ProviderWrapper: React.FC<ApprovedAny> = props => (
    <Provider store={store}>{props.children}</Provider>
  );
  return {
    store,
    ProviderWrapper,
  };
}

export function getRouterWrapper(
  setupHistory?: (history: ReturnType<typeof createMemoryHistory>) => void
) {
  const history = createMemoryHistory();
  setupHistory && setupHistory(history);
  const RouterWrapper: React.FC<ApprovedAny> = props => (
    <Router history={history}>{props.children}</Router>
  );

  return {
    history,
    RouterWrapper,
  };
}

export function renderWithProviderAndRouterAndRestful(
  ui: React.ReactElement,
  base: string,
  setupStore?: (store: ReturnType<typeof createStore>) => void,
  setupHistory?: (history: ReturnType<typeof createMemoryHistory>) => void
) {
  const {store, ProviderWrapper} = getProviderWrapper(setupStore);
  const {history, RouterWrapper} = getRouterWrapper(setupHistory);
  const {RestfulWrapper} = getRestfulWrapper(base);
  const Wrapper: React.FC<ApprovedAny> = props => (
    <ProviderWrapper>
      <RouterWrapper>
        <RestfulWrapper>{props.children}</RestfulWrapper>
      </RouterWrapper>
    </ProviderWrapper>
  );
  const target = render(ui, {wrapper: Wrapper});
  return {
    ...target,
    store,
    history,
  };
}

export function renderWithProviderAndRouter(
  ui: React.ReactElement,
  setupStore?: (store: ReturnType<typeof createStore>) => void,
  setupHistory?: (history: ReturnType<typeof createMemoryHistory>) => void
) {
  const {store, ProviderWrapper} = getProviderWrapper(setupStore);
  const {history, RouterWrapper} = getRouterWrapper(setupHistory);
  const Wrapper: React.FC<ApprovedAny> = props => (
    <ProviderWrapper>
      <RouterWrapper>{props.children}</RouterWrapper>
    </ProviderWrapper>
  );
  const target = render(ui, {wrapper: Wrapper});

  return {
    ...target,
    store,
    history,
  };
}

export function renderWithProviderAndRestful(
  ui: React.ReactElement,
  base: string,
  setupStore?: (store: ReturnType<typeof createStore>) => void
) {
  const {store, ProviderWrapper} = getProviderWrapper(setupStore);
  const {RestfulWrapper} = getRestfulWrapper(base);
  const Wrapper: React.FC<ApprovedAny> = props => (
    <ProviderWrapper>
      <RestfulWrapper>{props.children}</RestfulWrapper>
    </ProviderWrapper>
  );
  const target = render(ui, {wrapper: Wrapper});

  return {
    ...target,
    store,
    history,
  };
}

export function renderWithProvider(
  ui: React.ReactElement,
  setupStore?: (store: ReturnType<typeof createStore>) => void
) {
  const {store, ProviderWrapper} = getProviderWrapper(setupStore);
  const target = render(ui, {wrapper: ProviderWrapper});
  return {
    ...target,
    store,
  };
}

export function renderWithRestfulAndRouter(
  ui: React.ReactElement,
  base: string,
  setupHistory?: (history: ReturnType<typeof createMemoryHistory>) => void
) {
  const {RestfulWrapper} = getRestfulWrapper(base);
  const {history, RouterWrapper} = getRouterWrapper(setupHistory);
  const Wrapper: React.FC<ApprovedAny> = props => (
    <RouterWrapper>
      <RestfulWrapper>{props.children}</RestfulWrapper>
    </RouterWrapper>
  );
  const target = render(ui, {wrapper: Wrapper});
  return {
    ...target,
    history,
  };
}

export function renderWithRestful(ui: React.ReactElement, base: string) {
  const {RestfulWrapper} = getRestfulWrapper(base);
  const target = render(ui, {wrapper: RestfulWrapper});
  return {
    ...target,
  };
}

export function renderWithRouter(
  ui: React.ReactElement,
  setupHistory?: (history: ReturnType<typeof createMemoryHistory>) => void
) {
  const {history, RouterWrapper} = getRouterWrapper(setupHistory);
  return {
    ...render(ui, {wrapper: RouterWrapper}),
    history,
  };
}

export function renderHookWithProvider<P, R>(
  callback: (props: P) => R,
  setupStore?: (store: ReturnType<typeof createStore>) => void
) {
  const {store, ProviderWrapper} = getProviderWrapper(setupStore);
  const target = renderHook(callback, {wrapper: ProviderWrapper});
  return {
    ...target,
    store,
  };
}

export function renderHookWithRestful<P, R>(
  callback: (props: P) => R,
  base: string
) {
  const {RestfulWrapper} = getRestfulWrapper(base);
  const target = renderHook(callback, {wrapper: RestfulWrapper});
  return {
    ...target,
  };
}

export function renderHookWithProviderAndRestful<P, R>(
  callback: (props: P) => R,
  base: string,
  setupStore?: (store: ReturnType<typeof createStore>) => void
) {
  const {RestfulWrapper} = getRestfulWrapper(base);
  const {store, ProviderWrapper} = getProviderWrapper(setupStore);
  const Wrapper: React.FC<ApprovedAny> = props => (
    <ProviderWrapper>
      <RestfulWrapper>{props.children}</RestfulWrapper>
    </ProviderWrapper>
  );
  const target = renderHook(callback, {wrapper: Wrapper});
  return {
    store,
    ...target,
  };
}

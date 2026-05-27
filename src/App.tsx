import React from 'react';
import { RouterProvider } from 'react-router';
import { Slide, ToastContainer } from 'react-toastify';
import mazeStore from 'src/stores/mazeStore';
import cursorStore from 'src/stores/cursorStore';
import configStore from 'src/stores/configStore';
import { StoreContext } from 'src/context/storeContext';
import { GlobalStyle } from 'src/styles/global';
import { AppRouter } from 'src/router';

export default function App(): JSX.Element {
  return (
    <React.Fragment>
      <StoreContext.Provider value={{ mazeStore, cursorStore, configStore }}>
        <ToastContainer position="top-right" autoClose={3000} theme="dark" transition={Slide} />
        <GlobalStyle />
        <React.Suspense fallback="loading">
          <RouterProvider router={AppRouter} />
        </React.Suspense>
      </StoreContext.Provider>
    </React.Fragment>
  );
}

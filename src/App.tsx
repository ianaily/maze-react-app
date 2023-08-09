import React from 'react';
import { Slide, ToastContainer } from 'react-toastify';
import mazeStore from 'src/stores/mazeStore';
import cursorStore from 'src/stores/cursorStore';
import { StoreContext } from 'src/context/storeContext';
import { GlobalStyle } from 'src/styles/global';
import { MazeRedactor } from 'src/views/mazeRedactor';

export default function App() {
  return (
    <React.Fragment>
      <StoreContext.Provider value={{ mazeStore, cursorStore }}>
        <ToastContainer position="top-right" autoClose={3000} theme="dark" transition={Slide} />
        <GlobalStyle />
        <MazeRedactor />
      </StoreContext.Provider>
    </React.Fragment>
  );
}

import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { appLinks } from './const';

const MainMenu = React.lazy(() => import('src/views/mainMenu'));
const Gameplay = React.lazy(() => import('src/views/gameplay'));
const Redactor = React.lazy(() => import('src/views/mazeRedactor'));

export const routes = [
  {
    path: appLinks.mainMenu,
    element: <MainMenu />,
  },
  {
    path: appLinks.gameplay,
    element: <Gameplay />,
  },
  {
    path: appLinks.mazeRedactor,
    element: <Redactor />,
  },
  {
    path: '*',
    element: '404',
  },
];

export const AppRouter = createBrowserRouter(routes);

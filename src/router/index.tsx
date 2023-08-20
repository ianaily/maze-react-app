import React from 'react';
import { createHashRouter } from 'react-router-dom';
import { appLinks } from './const';

const MainMenu = React.lazy(() => import('src/views/mainMenu'));
const Gameplay = React.lazy(() => import('src/views/gameplay'));
const Redactor = React.lazy(() => import('src/views/mazeRedactor'));
const Settings = React.lazy(() => import('src/views/settings'));
const Difficult = React.lazy(() => import('src/views/difficult'));

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
    path: appLinks.settings,
    element: <Settings />,
  },
  {
    path: appLinks.difficult,
    element: <Difficult />,
  },
  {
    path: '*',
    element: '404',
  },
];

export const AppRouter = createHashRouter(routes);

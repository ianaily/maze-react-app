import React from 'react';
import { GlobalStyle } from 'src/styles/global';
import Renderer from 'src/components/renderer';
import { generateMaze } from 'src/core/generateMaze';
import { buildMazePots } from 'src/core/buildMazePots';

export default function App() {
  const maze = React.useMemo(() => {
    const maze = buildMazePots(50, 35);

    return generateMaze(maze);
  }, []);

  return (
    <React.Fragment>
      <GlobalStyle />
      <Renderer maze={maze} size={24} />
    </React.Fragment>
  );
}

import React from 'react';

import '../styles/App.scss';
import { DrawingBoard } from './DrawingBoard';
import Header from './Header';

/**
 * Root component for app
 */
function App () {
  return (
    <div className="app">
      <Header />
      <DrawingBoard />
    </div>
  );
}

export default App;

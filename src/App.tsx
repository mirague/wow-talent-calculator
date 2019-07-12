import React, { useState } from 'react';
import './App.scss';
import { Calculator } from './components/Calculator';

const App: React.FC = () => {
  const [selectedClass, setClass] = useState('warlock')

  return (
    <div className="App">
      {/* <ClassSelector 
        onSelect={setClass}
      /> */}
      {selectedClass && (
        <Calculator forClass={selectedClass} />
      )}
    </div>
  );
}

export default App;

// Options.js
import React from 'react';

const Options = ({ handleOptionClick, options }) => {
  return (
    <div className="options-container">
      <h3>Click the options below to continue</h3>
      {options.map((option, index) => (
        <button key={index} onClick={() => handleOptionClick(option)}>
          {option}
        </button>
      ))}
    </div>
  );
};

export default Options;

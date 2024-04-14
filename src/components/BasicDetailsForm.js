// BasicDetailsForm.js
import React from 'react';

const BasicDetailsForm = ({ handleBasicDetailsSubmit, basicDetailsIndex, basicDetails, setBasicDetails }) => {
  const detail = Object.keys(basicDetails)[basicDetailsIndex];

  return (
    <div className="basic-details-form">
      <form onSubmit={handleBasicDetailsSubmit}>
        <label htmlFor="input">{`Please provide your ${detail}:`}</label>
        <input
          type="text"
          id="input"
          value={basicDetails[detail]}
          onChange={(event) => {
            const newValue = event.target.value;
            setBasicDetails((prevState) => ({
              ...prevState,
              [detail]: newValue,
            }));
          }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default BasicDetailsForm;

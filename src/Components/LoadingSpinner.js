import React from 'react';
import { Audio } from 'react-loader-spinner';

const LoadingSpinner = () => {
  return (
    <div className="overlay-spinner">
      <div className="spinner-container">
        <Audio
          height={70}
          width={70}
          radius={9}
          color="grey"
          ariaLabel="three-dots-loading"
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;


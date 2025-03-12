import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Redirect = () => {
  const location = useLocation();

  useEffect(() => {
    const { target } = location.state || {};
    if (target) {
      window.location.href = target;
    }
  }, [location.state]);

  return <p>Redirecting...</p>;
};

export default Redirect;

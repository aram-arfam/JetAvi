import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const CargoContext = createContext();

export const CargoProvider = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [awbDetails, setAwbDetails] = useState(() => {
    const savedAwb = localStorage.getItem("awbDetails");
    return savedAwb ? JSON.parse(savedAwb) : null;
  });

 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Save awbDetails to localStorage when it changes
  useEffect(() => {
    if (awbDetails) {
      localStorage.setItem("awbDetails", JSON.stringify(awbDetails));
    }
  }, [awbDetails]);


  
  return (
    <CargoContext.Provider
      value={{
        awbDetails, setAwbDetails,
        loading, setLoading,
        error, setError,
      }}
    >
      {children}
    </CargoContext.Provider>
  );
};

CargoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CargoProvider;
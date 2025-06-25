export const validateDimensions = (length, width, height) => {
    if (parseFloat(length) < 0 || parseFloat(width) < 0 || parseFloat(height) < 0) {
      return "Dimensions cannot be negative";
    }
    if (parseFloat(length) > 3000 || parseFloat(width) > 3000 || parseFloat(height) > 3000) {
      return "Dimensions exceed maximum allowed size (3000cm)";
    }
    return null;
  };

 export const validateWeight = (weight) => {
    if (parseFloat(weight) <= 0) {
      return "Weight must be greater than 0";
    }
    if (parseFloat(weight) > 1000) {
      return "Weight exceeds maximum allowed (1000kg)";
    }
    return null;
  };
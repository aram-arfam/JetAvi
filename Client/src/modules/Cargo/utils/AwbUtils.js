  export const calculateVolume = (length, width, height) => {
    if (!length || !width || !height) return 0;
    return parseFloat(length) * parseFloat(width) * parseFloat(height);
  };

  export const calculateChargeableWeight = (actualWeight, length, width, height) => {
    const volume = calculateVolume(length, width, height);
    if (!isNaN(actualWeight)) {
      const volumetricWeight = volume / 6000;
      return Math.max(parseFloat(actualWeight), volumetricWeight).toFixed(2);
    }
    return "";
  };

  export const calculateTotalWeight = (piecesData) => {
    if (!Array.isArray(piecesData)) return 0;
    return piecesData.reduce((total, piece) => total + (parseFloat(piece.actualWeight) || 0), 0);
  };
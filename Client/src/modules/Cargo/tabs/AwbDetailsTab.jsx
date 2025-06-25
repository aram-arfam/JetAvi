import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import AwbForm from "../components/AwbForm.jsx";

const AwbDetailsTab = ({ awbDetails, handleAwbDetailsChange, handleSave }) => {
  const [, setFormData] = useState({
    ...awbDetails,
    shipperAddress: awbDetails?.shipperAddress || {},
    consigneeAddress: awbDetails?.consigneeAddress || {},
    insuranceDetails: awbDetails?.insuranceDetails || {},
  });

  useEffect(() => {
    if (awbDetails) {
      setFormData({
        ...awbDetails,
        shipperAddress: awbDetails.shipperAddress || {},
        consigneeAddress: awbDetails.consigneeAddress || {},
        insuranceDetails: awbDetails.insuranceDetails || {},
      });
    }
  }, [awbDetails]);

  return (
    <Paper sx={{ p: 2, ml: 3, mb: 3, mt: 3 }} elevation={3}>
      <AwbForm
        formData={awbDetails}
        handleFieldChange={handleAwbDetailsChange}
        handleSubmit={handleSave}
        hideSubmitButton={true}
      />
    </Paper>
  );
};

export default AwbDetailsTab;

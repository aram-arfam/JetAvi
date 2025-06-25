import React from "react";
import useCargoForm from "../hooks/useCargoForm.js";
import Modal from "../../../components/Modal.jsx";
import { toast } from "react-toastify";
import { Box, Typography, Paper } from "@mui/material";
import { cargoService } from "../services/cargoService.js";
import AwbForm from "../components/AwbForm.jsx";

const AwbGenration = () => {
  const { formData, handleChange, handleSubmit, isModalOpen, setIsModalOpen } =
    useCargoForm();

  const handleUpdate = async (updatedData) => {
    try {
      const response = await cargoService.updateAwb(
        updatedData.awbNo,
        updatedData
      );
      toast.success("AWB updated successfully!");

      setIsModalOpen(false);
      setTimeout(() => window.location.reload(), 10);
      console.log(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed!");
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setTimeout(() => window.location.reload(), 10);
  };

  const handleFieldChange = (field) => (event) => {
    handleChange({
      target: {
        name: field,
        value: event.target.value,
        type: event.target.type,
        checked: event.target.checked,
      },
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        p: { xs: 2, md: 4 },
      }}
    >
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        <Typography
          variant="h1"
          sx={{
            mb: 4,
            fontSize: { xs: "1.75rem", md: "2.25rem" },
            color: "primary.main",
          }}
        >
          AWB Generation
        </Typography>

        <AwbForm
          formData={formData}
          handleFieldChange={handleFieldChange}
          handleSubmit={handleSubmit}
        />
      </Paper>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        initialData={{
          ...formData,
          shipperAddress: formData.shipperAddress || {},
          consigneeAddress: formData.consigneeAddress || {},
          insuranceDetails: formData.insuranceDetails || {},
        }}
        onSave={handleUpdate}
      />
    </Box>
  );
};

export default AwbGenration;

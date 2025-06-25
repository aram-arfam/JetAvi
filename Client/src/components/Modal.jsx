import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import AwbForm from "../modules/Cargo/components/AwbForm";
import AwbSummary from "../modules/Cargo/components/AwbSummary";

const Modal = ({ isOpen, onClose, initialData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    ...initialData,
    shipperAddress: initialData?.shipperAddress || {},
    consigneeAddress: initialData?.consigneeAddress || {},
    insuranceDetails: initialData?.insuranceDetails || {},
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        shipperAddress: initialData.shipperAddress || {},
        consigneeAddress: initialData.consigneeAddress || {},
        insuranceDetails: initialData.insuranceDetails || {},
      });
    }
  }, [initialData]);

  const handleFieldChange = (field) => (event) => {
    const { value, type, checked } = event.target;

    if (field.includes(".")) {
      // Handle nested objects (e.g., shipperAddress.street)
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      // Handle regular fields
      setFormData((prev) => ({
        ...prev,
        [field]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onSave(formData);
    setIsEditing(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "background.paper",
          backgroundImage: "none",
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
          backgroundColor: "primary.main",
          color: "white",
        }}
      >
        <Typography variant="h5" component="span">
          AWB {formData.awbNo ? `#${formData.awbNo}` : "Details"}
        </Typography>
        <Box>
          <IconButton
            onClick={toggleEditing}
            size="small"
            sx={{ color: "white", mr: 1 }}
            disabled={isEditing}
          >
            <EditIcon />
          </IconButton>
          <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 1, px: isEditing ? 3 : 1 }}>
        {isEditing ? (
          <AwbForm
            formData={formData}
            handleFieldChange={handleFieldChange}
            handleSubmit={handleSubmit}
            hideSubmitButton={true}
          />
        ) : (
          <AwbSummary
            formData={formData}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          justifyContent: "flex-end",
          backgroundColor: "background.paper",
        }}
      >
        {isEditing ? (
          <>
            <Button
              variant="outlined"
              color="secondary"
              onClick={toggleEditing}
              sx={{ mr: 1 }}
            >
              Cancel Edit
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              startIcon={<SaveIcon />}
            >
              Save Changes
            </Button>
          </>
        ) : (
          <Button variant="outlined" color="primary" onClick={onClose}>
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Modal;

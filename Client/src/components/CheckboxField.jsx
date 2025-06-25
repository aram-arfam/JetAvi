import { FormControlLabel, Checkbox, Box } from "@mui/material";

const CheckboxField = ({ label, name, checked, onChange }) => {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        p: 1,
        transition: "all 0.2s",
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            name={name}
            checked={checked}
            onChange={onChange}
            sx={{
              color: "primary.main",
              "&.Mui-checked": {
                color: "primary.main",
              },
            }}
          />
        }
        label={label}
        sx={{
          "& .MuiFormControlLabel-label": {
            color: "text.primary",
            fontSize: "0.875rem",
            fontWeight: 500,
          },
        }}
      />
    </Box>
  );
};

export default CheckboxField;

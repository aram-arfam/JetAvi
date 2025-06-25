import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const SelectField = ({ label, name, value, onChange, options }) => {
  return (
    <FormControl fullWidth>
      <InputLabel sx={{ color: "primary.main" }}>{label}</InputLabel>
      <Select
        name={name}
        value={value}
        onChange={onChange}
        label={label}
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.23)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "primary.main",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "primary.main",
          },
          "& .MuiSelect-select": {
            color: "text.primary",
          },
        }}
      >
        {options.map((option, index) => (
          <MenuItem key={option.value || index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectField;

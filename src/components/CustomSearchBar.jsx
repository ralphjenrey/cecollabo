import { Autocomplete, TextField } from "@mui/material";
import PropTypes from "prop-types";
const CustomSearchBar = ({ placeholder, handleChange, uniqueOptions }) => {
    return (
        <Autocomplete
        freeSolo
        options={uniqueOptions}
        onInputChange={(event, value) => handleSearch(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search"
            variant="outlined"
            fullWidth
          />
        )}
      />
    )
};

CustomSearchBar.PropTypes = {
    placeholder: PropTypes.string,
    handleChange: PropTypes.func,
    uniqueOptions: PropTypes.array
}
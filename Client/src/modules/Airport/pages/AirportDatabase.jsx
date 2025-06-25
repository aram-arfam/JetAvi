import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { airportService } from "../services/airportService";
import {
  Box,
  Paper,
  Typography,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Button,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Save as SaveIcon,
  FileDownload as FileDownloadIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import AirportTable from "../components/AirportTable";
import AirportSearch from "../components/AirportSearch";
import AirportForm from "../components/AirportForm";
import useAirportForm from "../hooks/useAirportForm";
import { formatAirportData, filterAirports } from "../utils/airportUtils";

const AirportDatabase = () => {
  const [airports, setAirports] = useState([]);
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [icaoSearch, setIcaoSearch] = useState("");
  const [iataSearch, setIataSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [editingAirport, setEditingAirport] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedAirports, setSelectedAirports] = useState({});

  const {
    formData,
    formErrors,
    formSubmitted,
    handleChange,
    handleSubmit,
    resetForm,
    setFormData,
  } = useAirportForm();

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    try {
      const response = await airportService.getAirports();
      console.log("Response:", response.data);
      setAirports(response.data);

      const formattedAirports = response.data.map(formatAirportData);
      console.log("Formatted Airports:", formattedAirports);

      setFilteredAirports(formattedAirports);
    } catch (error) {
      console.error("Error fetching airports:", error);
      toast.error("Failed to fetch airports");
    }
  };

  const handleEdit = (airport) => {
    // Create a properly structured form data with all required nested objects
    const formattedData = {
      ...airport,
      // Ensure all nested objects exist
      cargoFacilities: {
        warehouse: false,
        customsClearance: false,
        coldStorage: false,
        hazmatHandling: false,
        ...(airport.cargoFacilities || {}),
      },
      handlingAgent: {
        name: "",
        contactNumber: "",
        email: "",
        ...(airport.handlingAgent || {}),
      },
      freightHandling: {
        prepaid: true,
        collect: true,
        ...(airport.freightHandling || {}),
      },
      specialHandling: {
        liveAnimals: false,
        perishableGoods: false,
        oversizedCargo: false,
        ...(airport.specialHandling || {}),
      },
      // Ensure arrays exist
      runways: airport.runways?.length ? airport.runways : [{ lengthMeters: "", surfaceType: "" }],
      airlinesServiced: airport.airlinesServiced?.length ? airport.airlinesServiced : [""],
      majorRoutes: airport.majorRoutes?.length ? airport.majorRoutes : [""],
    };
    
    setEditingAirport(airport);
    setFormData(formattedData);
    setIsFormVisible(true);
  };

  const handleUpdate = async () => {
    try {
      // Format the data before sending
      const updateData = {
        ...formData,
        icao: formData.icao.toUpperCase(),
        iata: formData.iata.toUpperCase(),
      };

      console.log("Editing airport:", editingAirport);
      console.log("Update data:", updateData);

      // Validate required fields
      const requiredFields = ["icao", "iata", "name", "city", "country"];
      const missingFields = requiredFields.filter(
        (field) => !updateData[field]
      );

      if (missingFields.length > 0) {
        toast.error(
          `Please fill in all required fields: ${missingFields.join(", ")}`
        );
        return;
      }

      // Validate ICAO and IATA formats
      if (!/^[A-Z]{4}$/.test(updateData.icao)) {
        toast.error("ICAO code must be exactly 4 letters");
        return;
      }
      if (!/^[A-Z]{3}$/.test(updateData.iata)) {
        toast.error("IATA code must be exactly 3 letters");
        return;
      }

      if (!editingAirport?._id) {
        console.error("No airport ID found:", editingAirport);
        toast.error("Invalid airport data");
        return;
      }

      await airportService.updateAirport(editingAirport._id, updateData);
      toast.success("Airport updated successfully");
      setIsFormVisible(false);
      setEditingAirport(null);
      resetForm();
      fetchAirports();
    } catch (error) {
      console.error("Update error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update airport";
      toast.error(errorMessage);
    }
  };

  const handleExportToExcel = async () => {
    const selectedData = airports.filter(
      (airport) => selectedAirports[airport._id]
    );
    if (selectedData.length === 0) {
      toast.warning("Please select airports to export");
      return;
    }

    try {
      await airportService.exportToExcel(selectedData);
      toast.success("Export completed successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  const formatYesNo = (value) => (value ? "Yes" : "No");

  const formatAirportDetails = (airport) => {
    const cargoFacilities = airport.cargoFacilities
      ? Object.entries(airport.cargoFacilities)
          .map(([key, value]) => `${key}: ${formatYesNo(value)}`)
          .join(", ")
      : "N/A";

    const freightHandling = airport.freightHandling
      ? Object.entries(airport.freightHandling)
          .map(([key, value]) => `${key}: ${formatYesNo(value)}`)
          .join(", ")
      : "N/A";

    const specialHandling = airport.specialHandling
      ? Object.entries(airport.specialHandling)
          .map(([key, value]) => `${key}: ${formatYesNo(value)}`)
          .join(", ")
      : "N/A";

    const runways = airport.runways
      ? airport.runways
          .map((runway) => `Length: ${runway.lengthMeters}m | Surface: ${runway.surfaceType}`)
          .join(", ")
      : "N/A";

    return `
      ICAO: ${airport.icao} | IATA: ${airport.iata} | Name: ${airport.name} | City: ${airport.city} | Country: ${airport.country}
      Operator: ${airport.operator || "N/A"} | Tarmac: ${airport.tarmac || "N/A"} | GMT Offset: ${airport.gmtOffset || "N/A"}
      Timezone: ${airport.timezone || "N/A"} | Opening Hours: ${airport.openingHours || "N/A"} | Open 24H: ${formatYesNo(airport.open24)}
      Customs: ${formatYesNo(airport.customs)}
      Cargo Facilities: ${cargoFacilities}
      Handling Agent: ${
        airport.handlingAgent
          ? `${airport.handlingAgent.name} | ${airport.handlingAgent.contactNumber} | ${airport.handlingAgent.email}`
          : "N/A"
      }
      Freight Handling: ${freightHandling}
      Special Handling: ${specialHandling}
      Runways: ${runways}
      Airlines Serviced: ${airport.airlinesServiced ? airport.airlinesServiced.join(", ") : "N/A"}
      Major Routes: ${airport.majorRoutes ? airport.majorRoutes.join(", ") : "N/A"}
    `;
  };

  const handleCopy = () => {
    const selectedData = airports.filter((airport) => selectedAirports[airport._id]);

    if (selectedData.length === 0) {
      toast.warning("Please select airports to copy");
      return;
    }

    const copyText = selectedData.map(formatAirportDetails).join("\n\n");

    navigator.clipboard.writeText(copyText);
    toast.success(`Copied ${selectedData.length} airports to clipboard!`);
  };

  useEffect(() => {
    const filtered = filterAirports(airports, {
      searchQuery,
      icaoSearch,
      iataSearch,
      citySearch,
      countrySearch,
    });
    setFilteredAirports(filtered);
  }, [
    searchQuery,
    icaoSearch,
    iataSearch,
    citySearch,
    countrySearch,
    airports,
  ]);

  // Calculate selected airports count
  const selectedCount = filteredAirports.filter(
    (airport) => selectedAirports[airport._id]
  ).length;

  // Combine all search terms
  const getSearchQuery = () => {
    const terms = [
      searchQuery,
      icaoSearch,
      iataSearch,
      citySearch,
      countrySearch,
    ].filter(Boolean);

    return terms.join(" ");
  };
  console.log("Filtered Airports:", filteredAirports);

  return (
    <Box sx={{ p: 6, minHeight: "100vh", bgcolor: "background.default" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h1">Airport Database</Typography>

        {selectedCount > 0 ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Paper sx={{ px: 4, py: 2, bgcolor: "secondary.main" }}>
              <Typography variant="subtitle1" color="primary">
                Selected: {selectedCount} Airports
              </Typography>
            </Paper>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopy}
            >
              Copy
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportToExcel}
            >
              Export
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2} alignItems="center">
            <Tooltip title="Refresh">
              <IconButton onClick={fetchAirports}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Box>

      <Stack spacing={4}>
        <Paper sx={{ p: 2 }}>
          <AirportSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            icaoSearch={icaoSearch}
            setIcaoSearch={setIcaoSearch}
            iataSearch={iataSearch}
            setIataSearch={setIataSearch}
            citySearch={citySearch}
            setCitySearch={setCitySearch}
            countrySearch={countrySearch}
            setCountrySearch={setCountrySearch}
          />
        </Paper>

        {isFormVisible && (
          <Paper sx={{ p: 2 }}>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 2 }}
            >
              <Grid item>
                <Typography variant="h6">
                  {editingAirport ? "Edit Airport" : "Add New Airport"}
                </Typography>
              </Grid>
              <Grid item>
                <Tooltip title="Save">
                  <IconButton
                    onClick={editingAirport ? handleUpdate : handleSubmit}
                  >
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            <AirportForm
              formData={formData}
              formErrors={formErrors}
              formSubmitted={formSubmitted}
              handleChange={handleChange}
              readOnly={false}
            />
          </Paper>
        )}

        <Paper>
          <AirportTable
            airports={filteredAirports}
            searchQuery={getSearchQuery()}
            onEdit={handleEdit}
            selectedAirports={selectedAirports}
            onSelectionChange={setSelectedAirports}
          />
        </Paper>
      </Stack>
    </Box>
  );
};

export default AirportDatabase;

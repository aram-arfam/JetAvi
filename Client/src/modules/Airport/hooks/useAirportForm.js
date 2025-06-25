import { useState } from "react";
import { toast } from "react-toastify";
import { airportService } from "../services/airportService";

const useAirportForm = () => {
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    icao: "",
    iata: "",
    city: "",
    country: "",

    // Time and Operations
    timezone: "",
    openingHours: "",
    open24: false,

    // Infrastructure
    operator: "",
    tarmac: "",
    runways: [{ lengthMeters: "", surfaceType: "" }],

    // Cargo Facilities
    cargoFacilities: {
      warehouse: false,
      customsClearance: false,
      coldStorage: false,
      hazmatHandling: false,
    },

    // Handling Information
    handlingAgent: {
      name: "",
      contactNumber: "",
      email: "",
    },

    // Freight and Cargo Handling
    freightHandling: {
      prepaid: true,
      collect: true,
    },

    // Special Handling Capabilities
    specialHandling: {
      liveAnimals: false,
      perishableGoods: false,
      oversizedCargo: false,
    },

    // Capacity and Operations
    maxCargoWeightKg: "",
    airlinesServiced: [""],
    majorRoutes: [""],

    // Customs and Regulations
    customs: false,
  });

  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      "name",
      "icao",
      "iata",
      "city",
      "country",
      "timezone",
      "openingHours",
      "maxCargoWeightKg",
    ];

    // Check required fields
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = "This field is required";
      }
    });

    // Validate ICAO format (4 letters)
    if (formData.icao && !/^[A-Z]{4}$/.test(formData.icao.toUpperCase())) {
      errors.icao = "ICAO code must be exactly 4 letters";
    }

    // Validate IATA format (3 letters)
    if (formData.iata && !/^[A-Z]{3}$/.test(formData.iata.toUpperCase())) {
      errors.iata = "IATA code must be exactly 3 letters";
    }

    // Validate maxCargoWeightKg is a positive number
    if (
      formData.maxCargoWeightKg &&
      (isNaN(formData.maxCargoWeightKg) || formData.maxCargoWeightKg <= 0)
    ) {
      errors.maxCargoWeightKg =
        "Maximum cargo weight must be a positive number";
    }

    // Validate email format if provided
    if (
      formData.handlingAgent.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.handlingAgent.email)
    ) {
      errors["handlingAgent.email"] = "Invalid email format";
    }

    // Validate runway data if provided
    formData.runways.forEach((runway, index) => {
      if (
        runway.lengthMeters &&
        (isNaN(runway.lengthMeters) || runway.lengthMeters <= 0)
      ) {
        errors[`runways.${index}.lengthMeters`] =
          "Runway length must be a positive number";
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Handle nested object fields
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    }
    // Handle array fields
    else if (name.includes("[")) {
      const [parent, index, child] = name
        .match(/(\w+)\[(\d+)\]\.(\w+)/)
        .slice(1);
      setFormData((prev) => ({
        ...prev,
        [parent]: prev[parent].map((item, i) =>
          i === parseInt(index) ? { ...item, [child]: value } : item
        ),
      }));
    }
    // Handle regular fields
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Convert codes to uppercase and prepare submission data
    const submissionData = {
      ...formData,
      icao: formData.icao.toUpperCase(),
      iata: formData.iata.toUpperCase(),
      // Filter out empty array elements
      airlinesServiced: formData.airlinesServiced.filter(
        (airline) => airline.trim() !== ""
      ),
      majorRoutes: formData.majorRoutes.filter((route) => route.trim() !== ""),
      // Filter out empty runway entries
      runways: formData.runways.filter(
        (runway) => runway.lengthMeters && runway.surfaceType
      ),
    };

    if (!validateForm()) {
      const missingFields = Object.keys(formErrors);
      toast.error(
        `Please correct the following fields: ${missingFields.join(", ")}`
      );
      return;
    }

    try {
      const response = await airportService.saveAirport(submissionData);
      toast.success(response.data.message || "Airport added successfully");
      resetForm();
      setFormSubmitted(false);
      setFormErrors({});
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error adding airport";

      // Handle duplicate key errors
      if (
        errorMessage.includes("duplicate key error") &&
        errorMessage.includes("icao")
      ) {
        setFormErrors((prev) => ({
          ...prev,
          icao: "This ICAO code already exists",
        }));
        toast.error("An airport with this ICAO code already exists");
      } else if (
        errorMessage.includes("duplicate key error") &&
        errorMessage.includes("iata")
      ) {
        setFormErrors((prev) => ({
          ...prev,
          iata: "This IATA code already exists",
        }));
        toast.error("An airport with this IATA code already exists");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      // Basic Information
      name: "",
      icao: "",
      iata: "",
      city: "",
      country: "",

      // Time and Operations
      timezone: "",
      openingHours: "",
      open24: false,

      // Infrastructure
      operator: "",
      tarmac: "",
      runways: [{ lengthMeters: "", surfaceType: "" }],

      // Cargo Facilities
      cargoFacilities: {
        warehouse: false,
        customsClearance: false,
        coldStorage: false,
        hazmatHandling: false,
      },

      // Handling Information
      handlingAgent: {
        name: "",
        contactNumber: "",
        email: "",
      },

      // Freight and Cargo Handling
      freightHandling: {
        prepaid: true,
        collect: true,
      },

      // Special Handling Capabilities
      specialHandling: {
        liveAnimals: false,
        perishableGoods: false,
        oversizedCargo: false,
      },

      // Capacity and Operations
      maxCargoWeightKg: "",
      airlinesServiced: [""],
      majorRoutes: [""],

      // Customs and Regulations
      customs: false,
    });
    setFormErrors({});
    setFormSubmitted(false);
  };

  return {
    formData,
    formErrors,
    formSubmitted,
    handleChange,
    handleSubmit,
    setFormData,
    setFormErrors,
    setFormSubmitted,
    resetForm,
  };
};

export default useAirportForm;

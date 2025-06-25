import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { cargoService } from "../services/cargoService";
import { CargoContext } from "../context/CargoContext";

const useCargoForm = () => {
  const { setAwbDetails, setPiecesDetails } = useContext(CargoContext);
  
  const [savedAwbData, setSavedAwbData] = useState(null);
  const [formData, setFormData] = useState({
    // Basic AWB Information
    airline: "",
    mawbNo: "",
    awbNo: "",
    flightNumber: "",
    status: "Request",
    company: "",
    customer: "",
    customerContact: "", 

    // Shipper Information 
    shipperName: "",
    shipperContactNumber: "",
    shipperAddress: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },

    // Consignee Information
    consigneeName: "",
    consigneeContactNumber: "",
    consigneeAddress: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },

    // Cargo Details
    origin: "",
    destination: "",
    originAirportCode: "",
    destinationAirportCode: "",
    pieces: "",
    weight: "",
    chargeableWeight: "",
    volume: "",
    readyDate: "",
    arrivalDate: "",

    // Customs & Insurance
    customsDeclaration: "",
    hsCode: "",
    customsClearance: "Pending",
    insurance: "Paid",
    insuranceDetails: {
      policyNumber: "",
      coverageAmount: "",
      insuranceCompany: "",
      policyDate: "",
    },

    // Additional Information
    delivery: "Airport Pickup",
    specialHandling: "No",
    freightCharges: "Prepaid",
    approvalStatus: "Pending",
    weightDiscrepancy: false,
    priorityShipment: false,
    qualityCheck: false,
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Generate AWB numbers when airline is selected
  useEffect(() => {
    const fetchGeneratedNumbers = async () => {
      if (!formData.airline) return; // Only generate if airline is selected

      try {
        const response = await cargoService.generateAwbNumbers(formData.airline);
        
        if (response.data.success) {
          setFormData((prev) => ({
            ...prev,
            mawbNo: response.data.data.mawbNo,
            awbNo: response.data.data.awbNo,
          }));
        } else {
          toast.error(response.data.message || "Failed to generate AWB numbers");
        }
      } catch (error) {
        console.error("Error generating numbers:", error);
        toast.error(error.response?.data?.message || "Failed to generate AWB numbers");
      }
    };

    fetchGeneratedNumbers();
  }, [formData.airline]); // Re-run when airline changes

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle nested object fields (e.g., shipperAddress.street)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
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
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.airline) {
      toast.error("Please select an airline first");
      return;
    }

    try {
      const response = await cargoService.createAwb(formData);
      if (response.data.success) {
        toast.success("AWB created successfully!");
        setSavedAwbData(response.data.data);
        
        // Update context state with new AWB data
        const { piecesDetails = [], ...awbData } = response.data.data;
        setAwbDetails(awbData);
        setPiecesDetails(piecesDetails);
        
        setIsModalOpen(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create AWB");
      console.error(error);
      console.log(formData)
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    savedAwbData,
    isModalOpen,
    setIsModalOpen,
  };
};

export default useCargoForm;
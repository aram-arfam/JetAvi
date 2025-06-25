import { useContext } from 'react';
import { CargoContext } from '../context/CargoContext';
import { cargoService } from '../services/cargoService';
import { toast } from 'react-toastify';

const useCargoActions = () => {
  const {
    awbDetails, setAwbDetails,
    piecesData, setPiecesData,
    loading, setLoading, 
    error, setError,
  } = useContext(CargoContext);

  //Function to fetch awb details if awbno. is provided
  const fetchAwbDetails = async (awbNo) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cargoService.getAwbByNo(awbNo);

      if (!response?.data) {
        throw new Error("Invalid response from server");
      }

      const { success, data, message } = response.data;

      if (success && data) {
        setAwbDetails(data);
        toast.success("AWB details fetched successfully!");
        return true;
      } else {
        const errorMsg = message || "AWB not found";
        setError(errorMsg);
        toast.error(errorMsg);
        return false;
      }
    } catch (error) {
      console.error("Error fetching AWB:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch AWB details";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to clear all AWB data
  const clearAwbData = () => {
    setAwbDetails(null);

    localStorage.removeItem("awbDetails");
   
  };

  // Function to update AWB status
  const updateAwbStatus = (newStatus) => {
    if (awbDetails) {
      setAwbDetails((prev) => ({
        ...prev,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      }));
    }
  };

  // Handle AWB Planning dialog form submission with validation
  const handleAwbSubmit = async (tempAwbNo) => {
    if (!tempAwbNo) {
      toast.error("Please enter an AWB number");
      return false;
    }

    let formattedAwbNo = tempAwbNo;

    if (/^\d{11}$/.test(tempAwbNo)) {
      formattedAwbNo = `${tempAwbNo.slice(0, 3)}-${tempAwbNo.slice(3)}`;
    }

    if (!/^\d{3}-\d{8}$/.test(formattedAwbNo)) {
      toast.error("Invalid AWB number format. Use XXX-XXXXXXXX or XXXXXXXXXXX");
      return false;
    }

    try {
      return await fetchAwbDetails(formattedAwbNo);
    } catch (err) { 
      console.error("Error in handleAwbSubmit:", err);
      return false;
    }
  };

  // Handle field changes in AWB details
  const handleAwbDetailsChange = (field) => (event) => {
    const { value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;
  
    if (field.includes("[")) {
      // Handle array fields like "pieces[0].weight"
      const [parent, index, child] = field.match(/(\w+)\[(\d+)\]\.(\w+)/).slice(1);
      setAwbDetails((prev) => ({
        ...prev,
        [parent]: prev[parent].map((item, i) =>
          i === parseInt(index) ? { ...item, [child]: fieldValue } : item
        ),
      }));
    } else if (field.includes(".")) {
      // Handle nested object fields like "sender.name"
      const [parent, child] = field.split(".");
      setAwbDetails((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: fieldValue,
        },
      }));
    } else {
      // Handle simple fields like "destination"
      setAwbDetails((prev) => ({
        ...prev,
        [field]: fieldValue,
      }));
    }
  };

  // Save AWB details (create or update)
  const handleSave = async () => {
    if (!awbDetails?.awbNo) {
      toast.error("Please enter an AWB number");
      return;
    }

    if (!/^\d{3}-\d{8}$/.test(awbDetails.awbNo)) {
      toast.error("Invalid AWB number format. Please use format: XXX-XXXXXXXX");
      return;
    }

    try {
      try {
        await cargoService.getAwbByNo(awbDetails.awbNo);
        const response = await cargoService.updateAwb(awbDetails.awbNo, {
          ...awbDetails,
          
        });

        if (response.data.success) {
          toast.success("AWB details updated successfully!");
        }
      } catch (error) {
        if (error.response?.status === 404) {
          const response = await cargoService.createAwb({
            ...awbDetails,
            
          });

          if (response.data.success) {
            toast.success("AWB details created successfully!");
          }
        } else {
          throw error;
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save AWB details"
      );
      console.error(error);
    }
  };

    
  const fetchPieces = async (awbId) => {
    try {
      if (!awbId) {
        throw new Error("AWB ID is required");
      }
      const response = await cargoService.getPieces(awbId);
      setPiecesData(response.data.data);
      console.log(response.data.data);
    } catch (err) {
      console.error("Error fetching pieces:", err);
    }
  };

  return {
    awbDetails,
    loading,
    error,
    fetchAwbDetails,
    clearAwbData,
    updateAwbStatus,
    handleAwbSubmit,
    handleAwbDetailsChange,
    handleSave,
    piecesData,
    
  };
};

export default useCargoActions;
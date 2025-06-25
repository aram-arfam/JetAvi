import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const cargoService = {
  // AWB Operations
  generateAwbNumbers: async (airlineCode) => {
    return await api.post("/api/awbs/generate", { airlineCode });
  },

  createAwb: async (awbData) => {
    return await api.post("/api/awbs", awbData);
  },

  updateAwb: async (awbNo, awbData) => {
    return await api.put(`/api/awbs/${awbNo}`, awbData);
  },

  deleteAwb: async (awbNo) => {
    return await api.delete(`/api/awbs/${awbNo}`);
  },

  getAllAwbs: async () => {
    return await api.get("/api/awbs");
  },

  getAwbByNo: async (awbNo) => {
    try {
      const response = await api.get(`/api/awbs/${awbNo}`);
      return response;
    } catch (error) {
      // If it's a 404, throw a custom error
      if (error.response?.status === 404) {
        throw new Error(`AWB ${awbNo} not found in the database`);
      }
      throw error;
    }
  },
  emailAwb: async (emailData) => {
    return await api.post(`/api/awbs/email`, emailData);
  },
  emailAwbPdf: async (payload) => {
    // payload should be { awbId, to, subject }
    console.log("Calling backend /api/awbs/email-pdf with:", payload);
    // Make sure the endpoint path matches your backend route setup
    return await api.post(`/api/awbs/email-pdf`, payload);
},


  // Piece Operations
  addPiece: async (awbNo, pieceData) => {
    return await api.post(`/api/awbs/${awbNo}/pieces`, pieceData);
  },

  updatePiece: async (awbNo, pieceId, pieceData) => {
    return await api.put(`/api/awbs/${awbNo}/pieces/${pieceId}`, pieceData);
  },

  deletePiece: async (awbNo, pieceId) => {
    return await api.delete(`/api/awbs/${awbNo}/pieces/${pieceId}`);
  },

  getPiece: async (awbNo, pieceId) => {
    return await api.get(`/api/awbs/${awbNo}/pieces/${pieceId}`);
  },

  getPieces: async (awbNo) => {
    return await api.get(`/api/awbs/${awbNo}/pieces`);
  },

  // Status Operations
  updateStatus: async (awbNo, status) => {
    return await api.patch(`/api/awbs/${awbNo}/status`, { status });
  },

  exportAwbs: async (awbNos) => {
    return await api.post(
      `/api/awbs/export`,
      { awbNos },
      {
        responseType: "blob",
      }
    );
  },

  getRates: async(awbId, pieceId)=>{
    return await api.get(`/api/awbs/${awbId}/pieces/${pieceId}/rates`);
  } ,
  addRate: async(awbId, pieceId, rateData)=>{
    return await api.post(`/api/awbs/${awbId}/pieces/${pieceId}/rates`, rateData);
  },
  updateRate: async(awbId, pieceId, rateId, rateData)=>{
    return await api.put(`/api/awbs/${awbId}/pieces/${pieceId}/rates/${rateId}`, rateData);
  },
  deleteRate: async(awbId, pieceId, rateId)=>{
    return await api.delete(`/api/awbs/${awbId}/pieces/${pieceId}/rates/${rateId}`);
  },
  generateRates: async(awbId, rateSettings)=>{
    return await api.post(`/api/awbs/${awbId}/generate-rates`, rateSettings);
  }



};
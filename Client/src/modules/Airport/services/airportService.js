import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

//axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const airportService = {
  getAirports: () => api.get("/api/airports/getairport"),
  saveAirport: (airportData) =>
    api.post("/api/airports/addairport", airportData),
  updateAirport: (id, airportData) =>
    api.put(`/api/airports/updateairport/${id}`, airportData),
  deleteAirport: (icao) => api.delete(`/api/airports/deleteairport/${icao}`),
  getAirportByICAO: (icao) => api.get(`/api/airports/getairport/${icao}`),
  exportToExcel: async (data) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Airports");

      // Define columns with more comprehensive fields
      const columns = [
        "ICAO",
        "IATA",
        "Name",
        "City",
        "Country",
        "Operator",
        "Tarmac",
        "Timezone",
        "Opening Hours",
        "Open 24H",
        "Customs",
        "Max Cargo Weight (kg)",
        "Warehouse",
        "Customs Clearance",
        "Cold Storage",
        "Hazmat Handling",
        "Handling Agent",
        "Contact Number",
        "Email",
        "Prepaid Freight",
        "Collect Freight",
        "Live Animals",
        "Perishable Goods",
        "Oversized Cargo",
        "Airlines Serviced",
        "Major Routes",
        "Runways"
      ];

      worksheet.addRow(columns);

      // Add data rows with expanded information
      data.forEach((airport) => {
        worksheet.addRow([
          airport.icao,
          airport.iata,
          airport.name,
          airport.city,
          airport.country,
          airport.operator || "N/A",
          airport.tarmac || "N/A",
          airport.timezone || "N/A",
          airport.openingHours || "N/A",
          airport.open24 ? "Yes" : "No",
          airport.customs ? "Yes" : "No",
          airport.maxCargoWeightKg || "N/A",
          airport.cargoFacilities?.warehouse ? "Yes" : "No",
          airport.cargoFacilities?.customsClearance ? "Yes" : "No",
          airport.cargoFacilities?.coldStorage ? "Yes" : "No",
          airport.cargoFacilities?.hazmatHandling ? "Yes" : "No",
          airport.handlingAgent?.name || "N/A",
          airport.handlingAgent?.contactNumber || "N/A",
          airport.handlingAgent?.email || "N/A",
          airport.freightHandling?.prepaid ? "Yes" : "No",
          airport.freightHandling?.collect ? "Yes" : "No",
          airport.specialHandling?.liveAnimals ? "Yes" : "No",
          airport.specialHandling?.perishableGoods ? "Yes" : "No",
          airport.specialHandling?.oversizedCargo ? "Yes" : "No",
          airport.airlinesServiced?.join(", ") || "N/A",
          airport.majorRoutes?.join(", ") || "N/A",
          airport.runways?.map(r => `${r.lengthMeters}m (${r.surfaceType})`).join(", ") || "N/A"
        ]);
      });

      // Format the worksheet for better readability
      worksheet.columns.forEach(column => {
        column.width = 20;
      });

      // Add some styling
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(
        blob,
        `Airports_Export_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch (error) {
      console.error("Export error:", error);
      throw error;
    }
  },
};

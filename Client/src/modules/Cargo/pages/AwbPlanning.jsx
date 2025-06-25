import React, { useState, useContext, useEffect } from "react";
import { Box, Paper, Tabs, Tab, Typography } from "@mui/material";
import AwbSearchDialog from "../components/AwbSearchDialog";
import AwbHeader from "../components/AwbHeader";
import AwbMainDetails from "../components/AwbMainDetails";
import AwbDetailsTab from "../tabs/AwbDetailsTab";
import AwbPiecesTab from "../tabs/AwbPiecesTab";
import AwbPrintnMailTab from "../tabs/AwbPrintnMailTab";
import AwbRatesTab from "../tabs/AwbRatesTab";
import useCargoActions from "../hooks/useCargoActions";
import { statusOptions } from "../utils/constants";


const AwbPlanning = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [showAwbDialog, setShowAwbDialog] = useState(false);
  const [tempAwbNo, setTempAwbNo] = useState("");

  const {
    clearAwbData,
    handleAwbDetailsChange,
    handleSave,
    handleCheckboxChange,
    awbDetails,
    loading,
    handleAwbSubmit,

  } = useCargoActions();


  useEffect(() => {
    if (!awbDetails && !loading) {
      setShowAwbDialog(true);
    }
    console.log(awbDetails);
   
  }, [awbDetails, loading]);



  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleDialogSubmit = async () => {
    const success = await handleAwbSubmit(tempAwbNo);
    if (success) {
      setShowAwbDialog(false);
    }
  };

    
   

   

  return (
    <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
      <AwbSearchDialog
        open={showAwbDialog}
        onClose={() => setShowAwbDialog(false)}
        loading={loading}
        tempAwbNo={tempAwbNo}
        setTempAwbNo={setTempAwbNo}
        handleAwbSubmit={handleDialogSubmit}
      />

      {!showAwbDialog && (
        <>
          <AwbHeader
            loading={loading}
            awbDetails={awbDetails}
            handleAwbDetailsChange={handleAwbDetailsChange}
            statusOptions={statusOptions}
            onSave={handleSave}
            handleRefresh={clearAwbData}
          />

          <AwbMainDetails
            loading={loading}
            awbDetails={awbDetails}
            handleAwbDetailsChange={handleAwbDetailsChange}
            statusOptions={statusOptions}
          />

          <Paper sx={{ width: "100%" }} elevation={3}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab label="Details" />
              <Tab label="Pieces Details" />
              <Tab label="Rates" />
              <Tab label="Print" />
              
            </Tabs>

            <Box sx={{ p: 3 }}>
              {currentTab === 0 && (
                <AwbDetailsTab
                  awbDetails={awbDetails}
                  handleAwbDetailsChange={handleAwbDetailsChange}
                  handleCheckboxChange={handleCheckboxChange}
                  onSave={handleSave}
                />
              )}
              {currentTab === 1 && (
                <AwbPiecesTab
                  awbId={awbDetails?._id}
                />
              )}

             
              {currentTab === 2 && (
                <AwbRatesTab
                  awbId={awbDetails?._id}
                  awbNo={awbDetails?.awbNo}
                />
              )}
               {currentTab === 3 && (
                <AwbPrintnMailTab
                  awbDetails={awbDetails}
                  handleAwbDetailsChange={handleAwbDetailsChange}
                  
                />
              )}
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default AwbPlanning;

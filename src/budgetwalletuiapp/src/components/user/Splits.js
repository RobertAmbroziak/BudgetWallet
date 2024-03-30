import React, { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import { useLanguage } from "../../LanguageContext";
import translations from "../../translations";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import "./Splits.css";
import Summary from "./Summary.js";
import { LineChart } from "@mui/x-charts/LineChart";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import { Modal, Box, Typography, Button } from "@mui/material";

function Splits({ jwtToken, splitsRequest }) {
  const [splitsResponse, setSplitsResponse] = useState(null);
  const { language } = useLanguage();
  const [openModal, setOpenModal] = useState(false);
  const [currentSplit, setCurrentSplit] = useState(null);
  const [chartData, setChartData] = useState({
    xAxis: [],
    series: [],
  });

  const handleOpenModal = (split) => {
    setCurrentSplit(split);
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);
  const editSplitBoxStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (jwtToken) {
          const response = await axios.get(
            `${config.API_BASE_URL}${config.API_ENDPOINTS.SPLITS}`,
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
              params: splitsRequest,
            }
          );

          const xAxisData = response.data.splitChartItems.map(
            (item) => item.periodOrderId
          );
          const budgetPartSeries = response.data.splitChartItems.map(
            (item) => item.budgetPartSumValue
          );
          const splitPartSeries = response.data.splitChartItems.map(
            (item) => item.spltPartSumValue
          );

          setChartData({
            xAxis: [{ data: xAxisData }],
            series: [
              {
                showMark: false,
                name: translations[language].lbl_budget, 
                data: budgetPartSeries,
                valueFormatter: (value) =>
                  value == null ? "NaN" : value.toString(),
              },
              {
                showMark: false,
                name: translations[language].lbl_expenses, 
                data: splitPartSeries,
              },
            ],
          });

          let lastTransferId = null;
          let isShaded = false;
          const processedSplits = response.data.splits.map((split) => {
            if (split.transferId !== lastTransferId) {
              isShaded = !isShaded;
              lastTransferId = split.transferId;
            }
            return { ...split, isShaded };
          });

          setSplitsResponse({
            ...response.data,
            splits: processedSplits,
          });
        } else {
          console.error("Token not found");
        }
      } catch (error) {
        console.error("Error fetching splits");
      }
    };
    fetchData();
  }, [jwtToken, splitsRequest]);

  return (
    <div>
      {splitsResponse && splitsResponse.splits ? (
        <div>
          <br />
          {splitsResponse.splitSummary.budgetValue > 0 && (
            <>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="summary-content"
                  id="summary-header"
                >
                  {translations[language].lbl_Summary}
                </AccordionSummary>
                <AccordionDetails>
                  <Summary splitsSummary={splitsResponse.splitSummary} />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="pchart-content"
                  id="chart-header"
                >
                  {translations[language].lbl_Chart}
                </AccordionSummary>
                <AccordionDetails>
                  <LineChart
                    xAxis={chartData.xAxis}
                    series={chartData.series}
                    height={200}
                    margin={{ top: 10, bottom: 20 }}
                  />
                </AccordionDetails>
              </Accordion>
              <br />
            </>
          )}
          <Table className="bwtable">
            <Thead>
              <Tr>
                <Th className="editColumn">{translations[language].hdr_Edit}</Th>
                <Th>{translations[language].hdr_Split}</Th>
                <Th>{translations[language].hdr_Transfer}</Th>
                <Th>{translations[language].hdr_Category}</Th>
                <Th>{translations[language].hdr_Account}</Th>
                <Th>{translations[language].hdr_Date}</Th>
                <Th>{translations[language].hdr_Value}</Th>
                <Th>{translations[language].hdr_Percentage}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {splitsResponse.splits.map((split, index) => (
                <Tr key={index} className={split.isShaded ? "shaded" : ""}>
                  <Td className="editColumn">
                    <Button onClick={() => handleOpenModal(split)}>
                      <EditIcon />
                    </Button>
                  </Td>
                  <Td>
                    <Tooltip title={split.splitDescription || ""}>
                      <span>{split.splitName}</span>
                    </Tooltip>
                  </Td>
                  <Td>
                    <Tooltip title={split.transferDescription || ""}>
                      <span>{split.transferName}</span>
                    </Tooltip>
                  </Td>
                  <Td>
                    <Tooltip title={split.categoryDescription || ""}>
                      <span>{split.categoryName}</span>
                    </Tooltip>
                  </Td>
                  <Td>
                    <Tooltip title={split.accountSourceDescription || ""}>
                      <span>{split.accountSourceName}</span>
                    </Tooltip>
                  </Td>
                  <Td>{split.transferDateFormated}</Td>
                  <Td>
                    <Tooltip
                      title={`${translations[language].tlt_TransferValue}: ${
                        split.transferValueFormated || ""
                      }`}
                    >
                      <span>{split.splitValueFormated}</span>
                    </Tooltip>
                  </Td>
                  <Td>{split.percentage} %</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-editSplit-title"
            aria-describedby="modal-editSplit-description"
          >
            <Box sx={editSplitBoxStyle}>
              <Typography
                id="modal-editSplit-title"
                variant="h6"
                component="h2"
              >
                {translations[language].lbl_SplitEdition}
              </Typography>
              <Typography id="modal-editSplit-description" sx={{ mt: 2 }}>
                {translations[language].lbl_SplitEditionFor}{" "}
                {currentSplit?.splitName}
              </Typography>
              <Button onClick={handleCloseModal}>
                {translations[language].btn_Close}
              </Button>
            </Box>
          </Modal>
        </div>
      ) : null}
    </div>
  );
}

export default Splits;

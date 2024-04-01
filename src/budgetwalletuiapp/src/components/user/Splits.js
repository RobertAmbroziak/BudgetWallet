import React, { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import { useLanguage } from "../../LanguageContext";
import translations from "../../translations";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import "./Splits.css";
import Summary from "./Summary.js";
import TransferEdit from "./TransferEdit.js";
import { LineChart } from "@mui/x-charts/LineChart";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "@mui/material";

function Splits({ jwtToken, splitsRequest, filtersData }) {
  const [splitsResponse, setSplitsResponse] = useState(null);
  const { language } = useLanguage();
  const [openModal, setOpenModal] = useState(false);
  const [currentTransfer, setCurrentTransfer] = useState(null);
  const [chartData, setChartData] = useState({
    xAxis: [],
    series: [],
  });

  const handleOpenModal = (split) => {
    const relatedSplits = splitsResponse.splits.filter(s => s.transferId === split.transferId).map(s => ({
      id: s.id,
      name: s.splitName,
      description: s.splitDescription,
      value: s.splitValue,
      categoryId: s.categoryId,
    }));
    
    const currentTransfer = {
      transferId: split.transferId,
      transferName: split.transferName,
      transferDescription: split.transferDescription,
      transferValue: split.transferValue,
      transferDate: split.transferDate,
      budgetId: splitsRequest.BudgetId,
      accountSourceId: split.accountSourceId,
      accountSourceName: split.accountSourceName,
      accountSourceDescription: split.accountSourceDescription,
      splits: relatedSplits,
      accounts: filtersData.accounts,
      categories: filtersData.categories
    };

    setCurrentTransfer(currentTransfer);
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);
  const handleSaveTransfer= () =>{
    console.log("TODO: zapis splitu i transferu po edycji. Wywołanie refreshu przez click SZUKAJ");
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
  }, [jwtToken, splitsRequest, language]);

  return (
    <div>
      {splitsResponse && splitsResponse.splits ? (
        <div>
          <br />
          {splitsResponse.splitSummary.budgetValue > 0 && (
            <>
              <Accordion sx={{ my: 1, mx: 2 }}>
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
              <Accordion sx={{ my: 1, mx: 2 }}>
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
          {/* <SplitEdit openModal={openModal} handleCloseModal={handleCloseModal} currentSplit={currentSplit}/> */}
          <TransferEdit jwtToken={jwtToken} openModal={openModal} handleCloseModal={handleCloseModal} handleSaveTransfer={handleSaveTransfer} currentTransfer={currentTransfer}/>
        </div>
      ) : null}
    </div>
  );
}

export default Splits;

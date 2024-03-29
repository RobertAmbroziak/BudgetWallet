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

function Splits({ jwtToken, splitsRequest }) {
  const [splitsResponse, setSplitsResponse] = useState(null);
  const { language } = useLanguage();
  const [chartData, setChartData] = useState({
    xAxis: [],
    series: [],
  });

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
                data: budgetPartSeries,
                valueFormatter: (value) =>
                  value == null ? "NaN" : value.toString(),
              },
              { 
                showMark: false,
                data: splitPartSeries
               },
            ],
          });
          setSplitsResponse(response.data);
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
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="summary-content"
              id="summary-header"
            >
              PODSUMOWANIE
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
              WYKRES
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
          <Table className="bwtable">
            <Thead>
              <Tr>
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
                <Tr key={index}>
                  <Td>{split.splitName}</Td>
                  <Td>{split.transferName}</Td>
                  <Td>{split.categoryName}</Td>
                  <Td>{split.accountSourceName}</Td>
                  <Td>{split.transferDateFormated}</Td>
                  <Td>{split.splitValueFormated}</Td>
                  <Td>{split.percentage} %</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      ) : null}
    </div>
  );
}

export default Splits;

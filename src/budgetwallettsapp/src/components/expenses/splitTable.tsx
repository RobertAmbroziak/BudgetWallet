import React, { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import { useLanguage } from "../../contexts/languageContext";
import translations from "../../translations";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import "./splitTable.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "@mui/material";
import { useUser } from "../../contexts/userContext";
import { TransferFilter } from "../../types/api/transferFilter";
import { SplitRequest } from "../../types/api/splitRequest";

import { Split } from "../../types/api/split";
import SplitChart from "./splitChart";
import SplitSummary from "./splitSummary";
import { SplitsResponse } from "../../types/api/splitsResponse";
import { ChartData } from "../../types/internal/chartData";
import { Transfer } from "../../types/internal/transfer";
import EditExpense from "../expense/editExpense";

interface Props {
  splitRequest: SplitRequest | null;
  expenseFilterData: TransferFilter;
}

const SplitTable: React.FC<Props> = ({ splitRequest, expenseFilterData }) => {
  const { jwtToken } = useUser();
  const [refreshData, setRefreshData] = useState<boolean>(false);
  const [splitResponse, setSplitResponse] = useState<SplitsResponse | null>(
    null
  );
  const { language } = useLanguage();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [currentTransfer, setCurrentTransfer] = useState<Transfer | null>(null);
  const [chartData, setChartData] = useState<ChartData>({
    xAxis: [],
    series: [],
  });

  const handleOpenModal = (split: Split) => {
    const relatedSplits: Split[] =
      splitResponse?.splits
        .filter((s) => s.transferId === split.transferId)
        .map((s) => ({
          splitId: s.splitId,
          splitName: s.splitName,
          splitDescription: s.splitDescription,
          splitValue: s.splitValue,
          categoryId: s.categoryId,
          isActive: s.isActive,

          categoryName: s.categoryName,
          categoryDescription: s.categoryDescription,
          accountSourceId: s.accountSourceId,
          accountSourceName: s.accountSourceName,
          accountSourceDescription: s.accountSourceDescription,
          transferId: s.transferId,
          transferName: s.transferName,
          transferDescription: s.transferDescription,
          transferValue: s.transferValue,
          transferDate: s.transferDate,
          orderId: s.orderId,
          percentage: s.percentage,
          transferDateFormated: s.transferDateFormated,
          splitValueFormated: s.splitValueFormated,
          transferValueFormated: s.transferValueFormated,
          isShaded: null,
        })) || [];

    const currentTransfer: Transfer = {
      transferId: split.transferId,
      transferName: split.transferName,
      transferDescription: split.transferDescription,
      transferValue: split.transferValue,
      transferDate: split.transferDate,
      budgetId: splitRequest?.budgetId ?? 0,
      accountSourceId: split.accountSourceId,
      accountSourceName: split.accountSourceName,
      accountSourceDescription: split.accountSourceDescription,
      splits: relatedSplits,
      accounts: expenseFilterData.accounts,
      categories: expenseFilterData.categories,
    };

    setCurrentTransfer(currentTransfer);
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleSaveTransfer = () => {
    handleCloseModal();
    setRefreshData((current) => !current);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (jwtToken) {
          const response = await axios.get<SplitsResponse>(
            `${config.API_BASE_URL}${config.API_ENDPOINTS.SPLITS}`,
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
              params: splitRequest,
            }
          );

          const xAxisData: number[] = response.data.splitChartItems.map(
            (item) => item.periodOrderId
          );
          const budgetPartSeries: number[] = response.data.splitChartItems.map(
            (item) => item.budgetPartSumValue
          );

          const splitPartSeries: number[] = response.data.splitChartItems.map(
            (item) => item.splitPartSumValue ?? 0
          );

          setChartData({
            xAxis: [{ data: xAxisData }],
            series: [
              {
                showMark: false,
                name: translations[language].lbl_budget,
                data: budgetPartSeries,
                valueFormatter: (value: number) =>
                  value == null ? "0" : value.toString(),
              },
              {
                showMark: false,
                name: translations[language].lbl_expenses,
                data: splitPartSeries,
              },
            ],
          });

          let lastTransferId: number | null = null;
          let isShaded: boolean = false;
          const processedSplits = response.data.splits.map((split) => {
            if (split.transferId !== lastTransferId) {
              isShaded = !isShaded;
              lastTransferId = split.transferId;
            }
            return { ...split, isShaded };
          });

          setSplitResponse({
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
  }, [splitRequest, language, refreshData, jwtToken]);

  return (
    <div>
      {splitResponse && splitResponse.splits ? (
        <div>
          <br />
          {splitResponse.splitSummary.budgetValue > 0 && (
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
                  <SplitSummary splitSummary={splitResponse.splitSummary} />
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
                  <SplitChart chartData={chartData} />
                </AccordionDetails>
              </Accordion>
              <br />
            </>
          )}
          <Table className="bwtable">
            <Thead>
              <Tr>
                <Th className="editColumn">
                  {translations[language].hdr_Edit}
                </Th>
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
              {splitResponse.splits.map((split, index) => (
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
          {currentTransfer && (
            <EditExpense
              openModal={openModal}
              handleCloseModal={handleCloseModal}
              handleSaveTransfer={handleSaveTransfer}
              currentTransfer={currentTransfer}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default SplitTable;

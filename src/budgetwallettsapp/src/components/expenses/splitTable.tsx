import React, { useState, useEffect } from "react";
import config from "../../config";
import axios from "axios";
import { useLanguage } from "../../contexts/languageContext";
import translations from "../../translations";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import "./splitTable.css";
//import Summary from "../../components/expenses/splitSummary";
//import EditExpenseModal from "../../components/expense/editExpenseModal";
import { LineChart } from "@mui/x-charts/LineChart";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "@mui/material";
//import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../../contexts/userContext";
import { ExpenseFilterData } from "../../types/expenseFilterData";
import { SplitRequest } from "../../types/splitRequest";

import { Split, SplitResponse, Transfer, ChartData } from "../../types/split";

interface Props {
  splitRequest: SplitRequest | null;
  expenseFilterData: ExpenseFilterData;
}

const SplitTable: React.FC<Props> = ({ splitRequest, expenseFilterData }) => {
  const { jwtToken } = useUser();
  const [refreshData, setRefreshData] = useState<boolean>(false);
  const [splitResponse, setSplitResponse] = useState<SplitResponse | null>(
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
      transferDate: split.transferDateFormated,
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

  //   const editTransferSuccessToast = () => {
  //     toast.success(translations[language].toast_editTransferSuccess, {
  //       position: "top-right",
  //       autoClose: 4000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "colored",
  //     });
  //   };

  const handleCloseModal = () => setOpenModal(false);

  const handleSaveTransfer = () => {
    handleCloseModal();
    setRefreshData((current) => !current);
    //editTransferSuccessToast();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (jwtToken) {
          const response = await axios.get<SplitResponse>(
            `${config.API_BASE_URL}${config.API_ENDPOINTS.SPLITS}`,
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
              params: splitRequest,
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
    <>
      {/* <ToastContainer /> */}
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
                    {/* <Summary splitsSummary={splitResponse.splitSummary} /> */}
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
            {/* <TransferEdit
              openModal={openModal}
              handleCloseModal={handleCloseModal}
              handleSaveTransfer={handleSaveTransfer}
              currentTransfer={currentTransfer}
            /> */}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default SplitTable;

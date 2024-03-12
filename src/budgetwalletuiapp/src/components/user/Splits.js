import React, { useState, useEffect } from 'react';
import config from '../../config';
import axios from 'axios';
import { useLanguage } from '../../LanguageContext';
import translations from '../../translations';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import './Splits.css';

function Splits({jwtToken, splitsRequest}) {
    const [splitsResponse, setSplitsResponse] = useState(null);
    const { language } = useLanguage();

    useEffect(() => {
        const fetchData = async () => {
            try {
              if (jwtToken) {
                const response = await axios.get(`${config.API_BASE_URL}${config.API_ENDPOINTS.SPLITS}`, {
                    headers: {
                      Authorization: `Bearer ${jwtToken}`,
                    },
                    params: splitsRequest
                  }  
                );
                setSplitsResponse(response.data);
              }
              else
              {
                  console.log('brak tokena');
              };
            } catch (error) {
                console.log('fetchData Eroor');
            }
          };
          fetchData();
    },[jwtToken]);

  return (
    <div>
      {splitsResponse && splitsResponse.splits ? (
        <div>
          <br/>
            <Table className='bwtable'>
              <Thead>
                <Tr>
                  <Th>{translations[language].hdr_Split}</Th>
                  <Th>{translations[language].hdr_Transfer}</Th>
                  <Th>{translations[language].hdr_Category}</Th>
                  <Th>{translations[language].hdr_Account}</Th>
                  <Th>{translations[language].hdr_Date}</Th>
                  <Th>{translations[language].hdr_Value}</Th>
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
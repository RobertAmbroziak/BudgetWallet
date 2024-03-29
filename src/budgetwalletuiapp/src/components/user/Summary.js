import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Summary({ splitsSummary }) {

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
      <Typography variant="summary">
        Wartość: {splitsSummary.splitsValue} / Suma: {splitsSummary.budgetValue} | Procent: {splitsSummary.percentage}%
      </Typography>
    </Box>
  );
}

export default Summary;
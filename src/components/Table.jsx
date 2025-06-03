import React from 'react';
import { Box } from '@mui/material';

const Table = ({ columns, data }) => {
  return (
    <Box sx={{ overflowX: 'auto', width: '100%' }}>
      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{
          width: '100%',
          minWidth: '600px', // set a min width to allow scrolling on small screens
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr>
            {columns.map(({ header, key }) => (
              <th key={key}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {columns.map(({ key, render }) => (
                <td key={key}>
                  {render ? render(row[key], row) : row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default Table;

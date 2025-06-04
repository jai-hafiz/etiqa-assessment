import React from 'react';
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const Table = ({ columns, data }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        width: '100%',
        overflowX: 'auto',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
      }}
    >
      <MuiTable sx={{ width: "100%", maxWidth: "100%" }}>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: '#f5f5f5',
            }}
          >
            {columns.map(({ header, key }) => (
              <TableCell
                key={key}
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: '#333',
                  borderBottom: '2px solid #e0e0e0',
                  padding: '12px',
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow
              key={idx}
              sx={{
                '&:hover': {
                  backgroundColor: '#fafafa',
                },
                '&:nth-of-type(odd)': {
                  backgroundColor: '#ffffff',
                },
              }}
            >
              {columns.map(({ key, render }) => (
                <TableCell
                  key={key}
                  sx={{
                    fontSize: '0.9rem',
                    color: '#555',
                    borderBottom: '1px solid #e0e0e0',
                    padding: '10px',
                  }}
                >
                  {render ? render(row[key], row) : row[key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
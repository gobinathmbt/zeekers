import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const API_URL = "http://localhost:9000";

const Logs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/logs`);
      
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sno</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Changes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {logs.map((log, index) => (
    <TableRow key={log._id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{log.action}</TableCell>
      <TableCell>{log.user}</TableCell>
      <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
      <TableCell>
        {log.changes.map((change, changeIndex) => (
          <div key={changeIndex}>
            <div>
              <strong>{change.field}</strong> :  <strong>From</strong> {change.oldValue}  <strong>To</strong> {change.newValue}
            </div>
          </div>
        ))}
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>
    </div>
  );
};

export default Logs;

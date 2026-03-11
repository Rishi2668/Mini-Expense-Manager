import { useEffect, useState } from "react";
import { getDashboard } from "../services/api";
import type { DashboardData } from "../types/Expense";

import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  CircularProgress,
  Alert,
  Box
} from "@mui/material";

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const d = await getDashboard();
        setData(d);
      } catch (err) {
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <Container maxWidth="md">

      <Typography variant="h4" sx={{ mb: 3, mt: 2 }}>
        Dashboard
      </Typography>

      {loading && <CircularProgress />}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && data && (
        <Box display="flex" flexDirection="column" gap={4}>

          {/* Monthly Totals */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Totals by Category
            </Typography>

            {Object.keys(data.monthlyTotals).length === 0 ? (
              <Typography>No data for current month.</Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Category</b></TableCell>
                      <TableCell><b>Total</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(data.monthlyTotals).map(([cat, total]) => (
                      <TableRow key={cat}>
                        <TableCell>{cat}</TableCell>
                        <TableCell>₹{total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

          {/* Top Vendors */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Vendors
            </Typography>

            {data.topVendors.length === 0 ? (
              <Typography>No vendor data.</Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Vendor</b></TableCell>
                      <TableCell><b>Total</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.topVendors.map((v) => (
                      <TableRow key={v.vendor}>
                        <TableCell>{v.vendor}</TableCell>
                        <TableCell>₹{v.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

          {/* Anomalies */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Anomalies
            </Typography>

            {data.anomalies.length === 0 ? (
              <Typography>No anomalies detected.</Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Date</b></TableCell>
                      <TableCell><b>Vendor</b></TableCell>
                      <TableCell><b>Category</b></TableCell>
                      <TableCell><b>Amount</b></TableCell>
                      <TableCell><b>Description</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.anomalies.map((e) => (
                      <TableRow key={e.id} sx={{ backgroundColor: "#ffe6e6" }}>
                        <TableCell>{e.date}</TableCell>
                        <TableCell>{e.vendorName}</TableCell>
                        <TableCell>{e.category}</TableCell>
                        <TableCell>₹{e.amount.toFixed(2)}</TableCell>
                        <TableCell>{e.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

        </Box>
      )}
    </Container>
  );
}
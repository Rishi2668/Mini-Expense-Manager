import { useEffect, useState } from "react";
import { getExpenses } from "../services/api";
import type { Expense } from "../types/Expense";

import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
  Stack
} from "@mui/material";

interface ExpenseTableProps {
  refreshKey: number;
}

export function ExpenseTable({ refreshKey }: ExpenseTableProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getExpenses();
        setExpenses(data);
      } catch (err) {
        setError("Failed to load expenses.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [refreshKey]);

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          All Expenses
        </Typography>

        {loading && <CircularProgress />}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && expenses.length === 0 && (
          <Typography>No expenses yet.</Typography>
        )}

        {!loading && !error && expenses.length > 0 && (
          <>
            <TableContainer sx={{ paddingBottom: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Vendor</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {expenses
                    .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                    .map((e) => (
                      <TableRow
                        key={e.id}
                        sx={
                          e.isAnomaly
                            ? { backgroundColor: "#ffe6e6" }
                            : {}
                        }
                      >
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

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2">
                Page {page + 1} of{" "}
                {Math.max(1, Math.ceil(expenses.length / rowsPerPage))}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    setPage((p) =>
                      p + 1 >= Math.ceil(expenses.length / rowsPerPage)
                        ? p
                        : p + 1
                    )
                  }
                  disabled={page + 1 >= Math.ceil(expenses.length / rowsPerPage)}
                >
                  Next
                </Button>
              </Stack>
            </Stack>
          </>
        )}
      </Paper>
    </Container>
  );
}
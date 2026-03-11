import { useState } from "react";
import { AddExpenseForm } from "./components/AddExpenseForm";
import { UploadCSV } from "./components/UploadCSV";
import { ExpenseTable } from "./components/ExpenseTable";
import { Dashboard } from "./components/Dashboard";

import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  Stack,
  Dialog
} from "@mui/material";

type View = "expenses" | "dashboard";

function App() {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const showToast = (message: string, type: "success" | "error" = "success") => {
  setToastMessage(message);
  setToastType(type);
  setToastOpen(true);
};
  const [view, setView] = useState<View>("expenses");
  const [refreshKey, setRefreshKey] = useState(0);

  const [openAdd, setOpenAdd] = useState(false);
  const [openCSV, setOpenCSV] = useState(false);

  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  const handleTabChange = (_: React.SyntheticEvent, newValue: View) => {
    setView(newValue);
  };

  return (
    <Container maxWidth="md">

      <Box textAlign="center" marginTop={4}>
        <Typography variant="h4" gutterBottom>
          Mini Expense Manager
        </Typography>
      </Box>

      <Tabs
        value={view}
        onChange={handleTabChange}
        centered
        sx={{ marginBottom: 3 }}
      >
        <Tab label="Expenses" value="expenses" />
        <Tab label="Dashboard" value="dashboard" />
      </Tabs>

      {view === "expenses" && (
        <>
          {/* Buttons */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            sx={{ marginBottom: 3 }}
          >
            <Button
              variant="contained"
              onClick={() => setOpenAdd(true)}
            >
              Add Expense
            </Button>

            <Button
              variant="outlined"
              onClick={() => setOpenCSV(true)}
            >
              Upload CSV
            </Button>
          </Stack>

          {/* Add Expense Popup */}
          <Dialog
            open={openAdd}
            onClose={() => setOpenAdd(false)}
            maxWidth="sm"
            fullWidth
          >
            <AddExpenseForm
              onSuccess={() => {
                setOpenAdd(false);
                triggerRefresh();
              }}
            />
          </Dialog>

          {/* Upload CSV Popup */}
          <Dialog
            open={openCSV}
            onClose={() => setOpenCSV(false)}
            maxWidth="sm"
            fullWidth
          >
            <UploadCSV
              onSuccess={() => {
                setOpenCSV(false);
                triggerRefresh();
              }}
            />
          </Dialog>

          {/* Expense Table */}
          <ExpenseTable refreshKey={refreshKey} />
        </>
      )}

      {view === "dashboard" && <Dashboard />}
    </Container>
  );
}

export default App;
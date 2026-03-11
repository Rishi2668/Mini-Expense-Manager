import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addExpense, type ExpenseRequest } from "../services/api";

import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Alert,
  Paper,
  Snackbar
} from "@mui/material";

interface AddExpenseFormProps {
  onSuccess: () => void;
}

export function AddExpenseForm({ onSuccess }: AddExpenseFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);

  const vendors = [
    "Swiggy",
    "Zomato",
    "Uber",
    "Ola",
    "Amazon",
    "Flipkart",
    "Rapido",
    "BigBasket",
    "Blinkit"
  ];

  const validationSchema = Yup.object({
    date: Yup.string().required("Date is required"),
    amount: Yup.number()
      .typeError("Amount must be a number")
      .moreThan(0, "Amount must be greater than zero")
      .required("Amount is required"),
    vendorName: Yup.string().required("Vendor name is required"),
    description: Yup.string().nullable()
  });

  const formik = useFormik<ExpenseRequest>({
    initialValues: {
      date: "",
      amount: 0,
      vendorName: "",
      description: ""
    },
    validationSchema,
  onSubmit: async (values, { resetForm, setSubmitting }) => {
    setSuccess(null);
    setError(null);
    try {
      setLoading(true);

      await addExpense(values);

      setSuccess("Expense added successfully.");
      setError(null);
      resetForm();
      setToastOpen(true);

      setTimeout(() => {
        onSuccess();
      }, 1500);

    } catch (err: any) {
      setSuccess(null);
      const backendMessage =
        err?.response?.data && typeof err.response.data === "object"
          ? err.response.data.message
          : undefined;
      const message =
        backendMessage && typeof backendMessage === "string"
          ? backendMessage
          : "Failed to add expense.";
      setError(message);
      setToastOpen(true);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  }
  });

  const toastMessage = success ?? error;

  return (
    <Paper elevation={3} sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Add Expense
      </Typography>

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        display="flex"
        flexDirection="column"
        gap={2}
      >
    <TextField
      label="Date"
      type="date"
      name="date"
      InputLabelProps={{ shrink: true }}
      inputProps={{
        max: new Date().toISOString().split("T")[0]
      }}
      value={formik.values.date}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched.date && Boolean(formik.errors.date)}
      helperText={formik.touched.date && formik.errors.date}
    />

        <TextField
          label="Amount"
          type="number"
          name="amount"
          value={formik.values.amount}
          onChange={(e) =>
            formik.setFieldValue(
              "amount",
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
          onBlur={formik.handleBlur}
          error={formik.touched.amount && Boolean(formik.errors.amount)}
          helperText={formik.touched.amount && formik.errors.amount}
        />

        <TextField
          select
          label="Vendor Name"
          name="vendorName"
          value={formik.values.vendorName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.vendorName && Boolean(formik.errors.vendorName)}
          helperText={formik.touched.vendorName && formik.errors.vendorName}
        >
          {vendors.map((vendor) => (
            <MenuItem key={vendor} value={vendor}>
              {vendor}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Description"
          name="description"
          multiline
          rows={3}
          value={formik.values.description}
          onChange={formik.handleChange}
        />

        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Expense"}
        </Button>

        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Box>

      <Snackbar
        open={toastOpen && Boolean(toastMessage)}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <Alert
          severity={success ? "success" : "error"}
          variant="filled"
          sx={{
            backgroundColor: success ? "#e9f7ef" : "#fdecea",
            color: "#000"
          }}
          onClose={() => setToastOpen(false)}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
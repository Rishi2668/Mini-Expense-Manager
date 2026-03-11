import { useRef, useState } from "react";
import { uploadCSV } from "../services/api";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

import {
  Paper,
  Typography,
  Button,
  Box,
  Snackbar,
  Alert
} from "@mui/material";

interface UploadCSVProps {
  onSuccess: () => void;
}

export function UploadCSV({ onSuccess }: UploadCSVProps) {

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const inputRef = useRef<HTMLInputElement | null>(null);


  const removeFile = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUpload = async () => {

    if (!file) {
      setToastType("error");
      setToastMessage("Please select a CSV file.");
      setToastOpen(true);
      return;
    }

    if (!file.name.endsWith(".csv")) {
      setToastType("error");
      setToastMessage("Invalid file. Please upload a CSV.");
      setToastOpen(true);
      return;
    }

    try {
      setLoading(true);

      await uploadCSV(file);

      setToastType("success");
      setToastMessage("CSV uploaded successfully.");
      setToastOpen(true);
      setFile(null);
      // delay closing dialog so toast is visible
      setTimeout(() => {
        onSuccess();
      }, 1500);

    } catch (err: any) {
      setToastType("error");
      const backendMessage =
        err?.response?.data && typeof err.response.data === "object"
          ? err.response.data.message
          : undefined;
      setToastMessage(
        backendMessage && typeof backendMessage === "string"
          ? backendMessage
          : "Failed to upload CSV."
      );
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Upload CSV
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>

        <Button variant="outlined" component="label">
          Select CSV File
          <input
            ref={inputRef}
            hidden
            type="file"
            accept=".csv"
            onChange={(e) => {
              const selectedFile = e.target.files ? e.target.files[0] : null;
              setFile(selectedFile);
            }}
          />
        </Button>

      
        {file && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              border: "1px solid #ddd",
              padding: 1,
              borderRadius: 1
            }}
          >
            <Typography variant="body2">
              {file.name}
            </Typography>

            <IconButton size="small" onClick={removeFile}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={loading || !file}
        >
          {loading ? "Uploading..." : "Upload"}
        </Button>

      </Box>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <Alert severity={toastType} variant="filled">
          {toastMessage}
        </Alert>
      </Snackbar>

    </Paper>
  );
}
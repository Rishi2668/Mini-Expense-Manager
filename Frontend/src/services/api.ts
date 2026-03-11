import axios from 'axios';
import type { DashboardData, Expense } from '../types/Expense';

const api = axios.create({
  baseURL: 'http://localhost:8080'
});

export interface ExpenseRequest {
  date: string;
  amount: number;
  vendorName: string;
  description: string;
}

export async function getExpenses(): Promise<Expense[]> {
  const response = await api.get<Expense[]>('/expenses');
  return response.data;
}

export async function addExpense(payload: ExpenseRequest): Promise<Expense> {
  const response = await api.post<Expense>('/expenses', payload);
  return response.data;
}

export async function uploadCSV(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);

  await api.post('/expenses/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

export async function getDashboard(): Promise<DashboardData> {
  const response = await api.get<DashboardData>('/dashboard');
  return response.data;
}



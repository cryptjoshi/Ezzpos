// API configuration

// Base API URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://d0e9-2405-9800-ba33-33f5-d07-2c9d-4e05-cf05.ngrok-free.app' || 'http://192.168.1.119:8030';

// API endpoints
export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/api/v1/authen/login`,
  products: `${API_BASE_URL}/api/v1/item/list`,
  addInvoice: `${API_BASE_URL}/api/v1/invoice/add`,
  getInvoice: `${API_BASE_URL}/api/v1/invoice/list`,
  docInvoice: `${API_BASE_URL}/api/v1/invoice/docno`,
  getMasterData: `${API_BASE_URL}/api/v1/settings`,
  updateSettings: `${API_BASE_URL}/api/v1/settings/update`,
  getInvoiceNo: `${API_BASE_URL}/api/v1/invoice/docno`,
  getInvoiceByDocno: `${API_BASE_URL}/api/v1/invoice/bydocno`,
  getCustomers: `${API_BASE_URL}/api/v1/ar/list`,
  // Add other endpoints here as needed
};

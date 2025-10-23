import { getToken } from './auth';

const API_URL = 'http://localhost:5000/api'; // Your backend server URL

// Helper function to handle API responses and parse JSON
const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    // Throw an error with the message from the backend, or a default one
    throw new Error(data.message || 'An error occurred while processing your request.');
  }
  return data;
};

// Helper to create a request with common headers
const createRequest = (method: string, body?: any, token?: string | null) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  // If a token is provided, add it to the Authorization header
  if (token) {
    headers['x-auth-token'] = token;
  }
  return {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };
};

// --- Donor API Calls ---
export const getDonors = (filters: { bloodGroup?: string; location?: string; search?: string }) => {
  // Build query parameters from the filters object
  const queryParams = new URLSearchParams(filters as any).toString();
  return fetch(`${API_URL}/donors?${queryParams}`).then(handleResponse);
};

export const registerDonor = (donorData: any) => {
  return fetch(`${API_URL}/donors`, createRequest('POST', donorData)).then(handleResponse);
};

// --- Contact Message API Calls ---
export const createMessage = (messageData: any) => {
  return fetch(`${API_URL}/messages`, createRequest('POST', messageData)).then(handleResponse);
};

// --- Admin API Calls ---
export const adminLogin = (credentials: any) => {
  return fetch(`${API_URL}/admin/login`, createRequest('POST', credentials)).then(handleResponse);
};

export const getAdminDonors = () => {
  const token = getToken();
  return fetch(`${API_URL}/donors`, createRequest('GET', undefined, token)).then(handleResponse);
};

export const deleteDonor = (id: number) => {
    const token = getToken();
    return fetch(`${API_URL}/donors/${id}`, createRequest('DELETE', undefined, token)).then(handleResponse);
};

export const getAdminMessages = () => {
    const token = getToken();
    return fetch(`${API_URL}/messages`, createRequest('GET', undefined, token)).then(handleResponse);
};

export const deleteMessage = (id: number) => {
    const token = getToken();
    return fetch(`${API_URL}/messages/${id}`, createRequest('DELETE', undefined, token)).then(handleResponse);
};


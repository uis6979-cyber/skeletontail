import axios from "axios";

/**
 * Shared Axios instance for backend communication.
 * 
 * Configuration:
 * - baseURL: Derived from environment variables with a local fallback for development.
 * - withCredentials: Set to true to allow cross-site requests to include cookies or Auth headers.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  withCredentials: true,
});
'use client';
import { signOut } from "next-auth/react";
import { getStoredSessionClient } from "./session-helper";

 
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
  data?: any;
}

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const httpClient = {
  async request<T>(
    endpoint: string,
    method: HttpMethod = "GET",
    options: FetchOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const session =  getStoredSessionClient();
      const jwt = session?.user.access_token;
      const { params, data, ...customConfig } = options;
      
      const queryParams = params
        ? `?${new URLSearchParams(params).toString()}`
        : "";
      const url = `${API_URL}${endpoint}${queryParams}`;

      const config: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
          ...customConfig.headers,
        },
        ...customConfig,
      };

      if (data && method !== "GET") {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(url, config);

      if (response.status === 401) {
        await signOut();
      }

      const responseData = await response.json().catch(() => null);

      return {
        status: response.status,
        data: responseData,
        error: !response.ok ? responseData?.message || "Erro na requisição" : undefined
      };

    } catch (error) {
      return {
        status: 500,
        error: error instanceof Error ? error.message : "Erro interno"
      };
    }
  },

  get<T>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, "GET", options);
  },

  post<T>(endpoint: string, data?: any, options?: FetchOptions) {
    return this.request<T>(endpoint, "POST", { ...options, data });
  },

  put<T>(endpoint: string, data?: any, options?: FetchOptions) {
    return this.request<T>(endpoint, "PUT", { ...options, data });
  },

  patch<T>(endpoint: string, data?: any, options?: FetchOptions) {
    return this.request<T>(endpoint, "PATCH", { ...options, data });
  },

  delete<T>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, "DELETE", options);
  }
};
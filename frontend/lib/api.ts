const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface Record {
  _id: string;
  number: number;
  locationName: string;
  date: string;
  loginHour: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  email: string;
  phone: string;
  brandDevice: string;
  digitalInterest: string;
  locationType: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenderStats {
  _id: string;
  count: number;
  percentage: number;
}

export interface LocationStats {
  _id: string;
  count: number;
}

export interface InterestStats {
  _id: string;
  count: number;
}

export interface DashboardStats {
  totalRecords: number;
  genderDistribution: GenderStats[];
  locationDistribution: LocationStats[];
  interestDistribution: InterestStats[];
  avgAge: number;
}

class ApiClient {
  private async request<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async getRecords(
    params: {
      page?: number;
      limit?: number;
      gender?: string;
      locationType?: string;
      digitalInterest?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: string;
    } = {}
  ): Promise<PaginatedResponse<Record>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    const endpoint = `/v1/records?${searchParams.toString()}`;
    const response = await this.request<PaginatedResponse<Record>>(endpoint);
    return response.data;
  }

  async getGenderStats(): Promise<GenderStats[]> {
    const response = await this.request<GenderStats[]>("/v1/stats/gender");
    return response.data;
  }

  async getLocationStats(): Promise<LocationStats[]> {
    const response = await this.request<LocationStats[]>("/v1/stats/location");
    return response.data;
  }

  async getInterestStats(): Promise<InterestStats[]> {
    const response = await this.request<InterestStats[]>("/v1/stats/interest");
    return response.data;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.request<DashboardStats>("/v1/stats/dashboard");
    return response.data;
  }

  async getHealth(): Promise<any> {
    const response = await this.request<any>("/health");
    return response.data;
  }
}

export const apiClient = new ApiClient();

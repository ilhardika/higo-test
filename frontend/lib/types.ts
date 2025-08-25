export interface RecordItem {
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

export interface PaginatedRecords {
  data: RecordItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
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

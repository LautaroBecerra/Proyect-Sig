export interface FloodReport {
  id: number;
  description: string;
  latitude: number;
  longitude: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}
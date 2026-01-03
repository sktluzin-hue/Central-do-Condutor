
export type VehicleType = 'carro' | 'moto';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  plate: string;
  currentKm: number;
  fuelType: string;
  oilType?: string;
  lastOilChangeKm?: number;
  observations?: string;
  createdAt: number;
  maintenanceHistory?: Record<string, number>; // Armazena a KM da última vez que cada peça foi trocada
}

export interface Expense {
  id: string;
  vehicleId: string;
  category: 'combustivel' | 'manutencao' | 'imposto' | 'seguro' | 'outros';
  amount: number;
  date: string;
  description: string;
}

export interface MaintenanceAlert {
  id: string;
  vehicleId: string;
  partName: string;
  intervalKm: number;
  lastDoneKm: number;
  status: 'ok' | 'warning' | 'critical';
}

export interface GuideContent {
  id: string;
  title: string;
  icon: string;
  content: string;
  category: string;
}

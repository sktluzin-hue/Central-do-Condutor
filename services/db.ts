
import { User, Vehicle, Expense, MaintenanceAlert } from '../types';

const STORAGE_KEYS = {
  USERS: 'cdc_users',
  CURRENT_USER: 'cdc_current_user',
  VEHICLES: 'cdc_vehicles',
  EXPENSES: 'cdc_expenses',
};

export const db = {
  // Auth
  getUsers: (): User[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    } catch {
      return [];
    }
  },
  saveUser: (user: User) => {
    const users = db.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },
  getCurrentUser: (): User | null => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
    } catch {
      return null;
    }
  },
  setCurrentUser: (user: User | null) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  // Vehicles
  getVehicles: (userId: string): Vehicle[] => {
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES) || '[]');
      return all.filter((v: Vehicle) => v.userId === userId);
    } catch {
      return [];
    }
  },
  addVehicle: (vehicle: Vehicle) => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES) || '[]');
    all.push(vehicle);
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(all));
  },
  updateVehicle: (vehicle: Vehicle) => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES) || '[]');
    const index = all.findIndex((v: Vehicle) => v.id === vehicle.id);
    if (index !== -1) {
      all[index] = vehicle;
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(all));
    }
  },
  deleteVehicle: (vehicleId: string) => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES) || '[]');
    const filtered = all.filter((v: Vehicle) => v.id !== vehicleId);
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(filtered));
  },
  completeMaintenance: (vehicleId: string, partName: string, currentKm: number) => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.VEHICLES) || '[]');
    const index = all.findIndex((v: Vehicle) => v.id === vehicleId);
    if (index !== -1) {
      const vehicle = all[index];
      if (!vehicle.maintenanceHistory) vehicle.maintenanceHistory = {};
      vehicle.maintenanceHistory[partName] = currentKm;
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(all));
      return true;
    }
    return false;
  },

  // Expenses
  getExpenses: (vehicleId: string): Expense[] => {
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES) || '[]');
      return all.filter((e: Expense) => e.vehicleId === vehicleId);
    } catch {
      return [];
    }
  },
  addExpense: (expense: Expense) => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES) || '[]');
    all.push(expense);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(all));
  },
  updateExpense: (expense: Expense) => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES) || '[]');
    const index = all.findIndex((e: Expense) => e.id === expense.id);
    if (index !== -1) {
      all[index] = expense;
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(all));
    }
  },
  deleteExpense: (expenseId: string) => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES) || '[]');
    const filtered = all.filter((e: Expense) => e.id !== expenseId);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(filtered));
  },

  // Alerts
  getAlerts: (vehicleId: string, currentKm: number, maintenanceHistory: Record<string, number> = {}): MaintenanceAlert[] => {
    const baseAlerts = [
      { id: '1', name: 'Óleo do Motor', interval: 10000 },
      { id: '2', name: 'Filtro de Ar', interval: 15000 },
      { id: '3', name: 'Velas de Ignição', interval: 40000 },
      { id: '4', name: 'Correia Dentada', interval: 60000 },
    ];
    
    return baseAlerts.map(base => {
      const lastDone = maintenanceHistory[base.name] || 0;
      const nextDue = lastDone + base.interval;
      const remaining = nextDue - currentKm;
      
      let status: 'ok' | 'warning' | 'critical' = 'ok';
      if (remaining <= 0) status = 'critical';
      else if (remaining < 1500) status = 'warning';

      return {
        id: base.id,
        vehicleId,
        partName: base.name,
        intervalKm: base.interval,
        lastDoneKm: lastDone,
        status
      };
    });
  }
};

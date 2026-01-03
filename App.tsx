
import React, { useState, useEffect } from 'react';
import { User, Vehicle, Expense, MaintenanceAlert } from './types';
import { db } from './services/db';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import VehiclesPage from './pages/Vehicles';
import ExpensesPage from './pages/Expenses';
import ConsumptionCalc from './pages/ConsumptionCalc';
import GuidesPage from './pages/Guides';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  const refreshVehicles = () => {
    if (user) {
      const userVehicles = db.getVehicles(user.id);
      setVehicles(userVehicles);
      return userVehicles;
    }
    return [];
  };

  useEffect(() => {
    const currentUser = db.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      const userVehicles = db.getVehicles(currentUser.id);
      setVehicles(userVehicles);
      if (userVehicles.length > 0) {
        setSelectedVehicleId(userVehicles[0].id);
      }
    }
  }, []);

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    db.setCurrentUser(loggedUser);
    const userVehicles = db.getVehicles(loggedUser.id);
    setVehicles(userVehicles);
    if (userVehicles.length > 0) {
      setSelectedVehicleId(userVehicles[0].id);
    }
  };

  const handleLogout = () => {
    setUser(null);
    db.setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const handleAddVehicle = (v: Vehicle) => {
    db.addVehicle(v);
    const updated = refreshVehicles();
    if (!selectedVehicleId && updated.length > 0) {
      setSelectedVehicleId(updated[updated.length - 1].id);
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={handleLogout}
      userName={user.name}
    >
      {activeTab === 'dashboard' && (
        <Dashboard 
          user={user} 
          vehicle={selectedVehicle} 
          allVehicles={vehicles}
          onSelectVehicle={(id) => setSelectedVehicleId(id)}
          setActiveTab={setActiveTab}
        />
      )}
      {activeTab === 'veiculos' && (
        <VehiclesPage 
          vehicles={vehicles} 
          onAdd={handleAddVehicle} 
          userId={user.id} 
        />
      )}
      {activeTab === 'gastos' && selectedVehicle && (
        <ExpensesPage vehicle={selectedVehicle} />
      )}
      {activeTab === 'gastos' && !selectedVehicle && (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500">
          <p>Cadastre um veículo primeiro para gerenciar gastos.</p>
        </div>
      )}
      {activeTab === 'consumo' && (
        <ConsumptionCalc />
      )}
      {activeTab === 'guias' && (
        <GuidesPage />
      )}
    </Layout>
  );
};

export default App;


import React, { useEffect, useState } from 'react';
import { User, Vehicle, MaintenanceAlert } from '../types';
import { db } from '../services/db';
import { 
  AlertCircle, 
  Calendar, 
  ChevronRight, 
  Droplet, 
  Plus, 
  CheckCircle2,
  MessageCircle,
  Users
} from 'lucide-react';
import { CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DashboardProps {
  user: User;
  vehicle: Vehicle | undefined;
  allVehicles: Vehicle[];
  onSelectVehicle: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, vehicle, allVehicles, onSelectVehicle, setActiveTab }) => {
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);

  const loadVehicleData = () => {
    if (vehicle) {
      const vehicleAlerts = db.getAlerts(vehicle.id, vehicle.currentKm, vehicle.maintenanceHistory);
      setAlerts(vehicleAlerts);

      const vehicleExpenses = db.getExpenses(vehicle.id);
      const chartData = vehicleExpenses.slice(-5).map(e => ({
        date: new Date(e.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        valor: e.amount
      }));
      setExpenses(chartData);
    }
  };

  useEffect(() => {
    loadVehicleData();
  }, [vehicle]);

  const handleCompleteMaintenance = (partName: string) => {
    if (vehicle) {
      if (confirm(`Confirmar que trocou "${partName}" agora com ${vehicle.currentKm} km?`)) {
        db.completeMaintenance(vehicle.id, partName, vehicle.currentKm);
        
        // Disparar atualização
        const updatedVehicles = db.getVehicles(user.id);
        const updated = updatedVehicles.find(v => v.id === vehicle.id);
        if (updated) {
          onSelectVehicle(updated.id);
          // Pequeno delay para garantir que o state de vehicle atualizou
          setTimeout(loadVehicleData, 10);
        }
      }
    }
  };

  if (allVehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mb-6">
          <Plus className="text-blue-600" size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Sem veículos ainda!</h2>
        <p className="text-slate-500 mb-8 max-w-sm font-medium">Cadastre seu carro ou moto para começar a usar todas as funções da Central.</p>
        <button 
          onClick={() => setActiveTab('veiculos')}
          className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
        >
          Cadastrar Meu Primeiro Veículo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Vehicle Selector */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {allVehicles.map((v) => (
          <button
            key={v.id}
            onClick={() => onSelectVehicle(v.id)}
            className={`
              flex-shrink-0 px-6 py-3 rounded-2xl border-2 transition-all active:scale-95 font-bold text-sm
              ${vehicle?.id === v.id ? 'bg-white border-blue-600 text-blue-600 shadow-md' : 'bg-slate-100 border-transparent text-slate-400'}
            `}
          >
            {v.brand} {v.model}
          </button>
        ))}
        <button 
          onClick={() => setActiveTab('veiculos')}
          className="flex-shrink-0 p-3 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Evolução de Gastos</h3>
            <button 
              onClick={() => setActiveTab('gastos')}
              className="text-[10px] text-blue-600 bg-blue-50 px-4 py-2 rounded-full font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
            >
              Ver Detalhes
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={expenses.length > 0 ? expenses : [{ date: '-', valor: 0 }]}>
                <defs>
                  <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}}
                  formatter={(value) => [`R$ ${value}`, 'Valor']}
                />
                <Area type="monotone" dataKey="valor" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorValor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Odômetro Atual</p>
            <h2 className="text-5xl font-black tracking-tighter">{vehicle?.currentKm} <span className="text-lg font-bold text-slate-600">km</span></h2>
          </div>
          <div className="relative z-10 space-y-4 mt-8">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400">
                <Droplet size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase">Combustível</p>
                <p className="text-sm font-bold">{vehicle?.fuelType}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 flex items-center justify-center text-orange-400">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase">Ano Modelo</p>
                <p className="text-sm font-bold">{vehicle?.year}</p>
              </div>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-[80px]"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-800 flex items-center gap-3 uppercase tracking-tight">
              <AlertCircle size={24} className="text-orange-500" />
              Revisões Pendentes
            </h3>
          </div>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${alert.status === 'critical' ? 'bg-red-500 animate-pulse' : alert.status === 'warning' ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                  <div>
                    <p className="font-black text-slate-800 text-sm">{alert.partName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Trocar com {alert.lastDoneKm + alert.intervalKm} km</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] px-3 py-1 rounded-full font-black ${
                    alert.status === 'critical' ? 'text-red-600 bg-red-100' : 
                    alert.status === 'warning' ? 'text-orange-600 bg-orange-100' : 
                    'text-green-600 bg-green-100'
                  }`}>
                    {alert.status === 'critical' ? 'ATRASADO' : alert.status === 'warning' ? 'EM BREVE' : 'OK'}
                  </span>
                  <button 
                    onClick={() => handleCompleteMaintenance(alert.partName)}
                    className="p-3 bg-white text-blue-600 rounded-xl shadow-sm hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                    title="Marcar como trocada"
                  >
                    <CheckCircle2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Suporte na Home */}
          <div className="grid grid-cols-2 gap-4">
             <a 
              href="https://wa.me/32998426140" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-emerald-500 text-white p-6 rounded-[32px] shadow-lg flex flex-col items-center justify-center text-center gap-2 hover:scale-[1.02] transition-all"
            >
              <MessageCircle size={32} />
              <span className="font-black text-xs uppercase tracking-widest">Falar com Mecânico</span>
            </a>
            <a 
              href="https://chat.whatsapp.com/HDLFvcHmbSB1CwdSE4ROpM" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-sky-500 text-white p-6 rounded-[32px] shadow-lg flex flex-col items-center justify-center text-center gap-2 hover:scale-[1.02] transition-all"
            >
              <Users size={32} />
              <span className="font-black text-xs uppercase tracking-widest">Entrar no Grupo</span>
            </a>
          </div>

          <div 
            onClick={() => setActiveTab('guias')}
            className="bg-blue-600 text-white p-8 rounded-[40px] shadow-xl relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-2">Saúde do Veículo</h3>
              <p className="text-blue-100 text-sm mb-8 font-medium">Faça o checklist agora para evitar problemas no caminho.</p>
              <button className="flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-transform group-hover:translate-x-2">
                Abrir Checklist
                <ChevronRight size={18} />
              </button>
            </div>
            <CheckCircle2 className="absolute -bottom-10 -right-10 text-white/10 group-hover:rotate-12 transition-transform" size={200} />
          </div>

          <div 
            onClick={() => setActiveTab('consumo')}
            className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 group cursor-pointer hover:border-blue-200 active:scale-[0.98] transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-800 mb-1">Média de Consumo</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-tight">Calcule o desempenho do seu tanque</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

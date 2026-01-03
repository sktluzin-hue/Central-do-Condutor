
import React, { useState, useEffect } from 'react';
import { Vehicle, VehicleType } from '../types';
import { Plus, Car, Bike, Trash2, Edit2, Info, X } from 'lucide-react';
import { db } from '../services/db';

interface VehiclesPageProps {
  vehicles: Vehicle[];
  onAdd: (v: Vehicle) => void;
  userId: string;
}

const VehiclesPage: React.FC<VehiclesPageProps> = ({ vehicles, onAdd, userId }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    type: 'carro',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    currentKm: 0,
    fuelType: 'Flex',
    plate: '',
    observations: ''
  });

  useEffect(() => {
    if (editingVehicle) {
      setFormData({ ...editingVehicle });
      setShowForm(true);
    }
  }, [editingVehicle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicle) {
      const updated: Vehicle = {
        ...editingVehicle,
        ...formData as Vehicle,
      };
      db.updateVehicle(updated);
      window.location.reload(); 
    } else {
      const v: Vehicle = {
        ...formData as Vehicle,
        id: Math.random().toString(36).substr(2, 9),
        userId,
        createdAt: Date.now(),
      };
      onAdd(v);
    }
    closeForm();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingVehicle(null);
    setFormData({ type: 'carro', brand: '', model: '', year: new Date().getFullYear(), currentKm: 0, fuelType: 'Flex', plate: '', observations: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Atenção! Todos os dados deste veículo serão excluídos. Confirmar?")) {
      db.deleteVehicle(id);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Meus Veículos</h2>
          <p className="text-slate-500 font-bold">Gerencie sua garagem</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-[20px] font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={20} />
          Cadastrar Novo
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                {editingVehicle ? 'Editar Veículo' : 'Novo Veículo'}
              </h3>
              <button onClick={closeForm} className="p-3 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'carro'})}
                  className={`flex-1 flex flex-col items-center p-6 rounded-[32px] border-4 transition-all ${formData.type === 'carro' ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-xl shadow-blue-100' : 'border-slate-50 text-slate-300 opacity-50'}`}
                >
                  <Car size={40} className="mb-2" />
                  <span className="font-black text-xs uppercase tracking-widest">Carro</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'moto'})}
                  className={`flex-1 flex flex-col items-center p-6 rounded-[32px] border-4 transition-all ${formData.type === 'moto' ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-xl shadow-blue-100' : 'border-slate-50 text-slate-300 opacity-50'}`}
                >
                  <Bike size={40} className="mb-2" />
                  <span className="font-black text-xs uppercase tracking-widest">Moto</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Marca</label>
                  <input required type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-700 outline-none" placeholder="Ex: Honda" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Modelo</label>
                  <input required type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-700 outline-none" placeholder="Ex: Civic" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Ano</label>
                  <input required type="number" value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-700 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">KM Atual</label>
                  <input required type="number" value={formData.currentKm} onChange={e => setFormData({...formData, currentKm: parseInt(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-700 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Placa</label>
                  <input type="text" value={formData.plate} onChange={e => setFormData({...formData, plate: e.target.value.toUpperCase()})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-700 outline-none" placeholder="ABC1D23" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Combustível</label>
                  <select value={formData.fuelType} onChange={e => setFormData({...formData, fuelType: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-700 outline-none">
                    <option>Flex</option>
                    <option>Gasolina</option>
                    <option>Etanol</option>
                    <option>Diesel</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-6 pt-6 border-t border-slate-100">
                <button type="button" onClick={closeForm} className="flex-1 py-5 text-slate-400 font-bold hover:text-slate-600">Cancelar</button>
                <button type="submit" className="flex-2 px-8 py-5 bg-blue-600 text-white font-black rounded-[24px] shadow-xl shadow-blue-100 active:scale-95 transition-all">
                  {editingVehicle ? 'Salvar Alterações' : 'Concluir Cadastro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {vehicles.map((v) => (
          <div key={v.id} className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-lg ${v.type === 'carro' ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'}`}>
                {v.type === 'carro' ? <Car size={32} /> : <Bike size={32} />}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingVehicle(v)} className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"><Edit2 size={20} /></button>
                <button onClick={() => handleDelete(v.id)} className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"><Trash2 size={20} /></button>
              </div>
            </div>

            <div className="relative z-10">
              <h4 className="text-2xl font-black text-slate-800 mb-1">{v.brand}</h4>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-6">{v.model}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Km Atual</p>
                  <p className="text-sm font-black text-slate-700">{v.currentKm.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Placa</p>
                  <p className="text-sm font-black text-slate-700">{v.plate || 'S/P'}</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              {v.type === 'carro' ? <Car size={180} /> : <Bike size={180} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehiclesPage;

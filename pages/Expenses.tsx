
import React, { useState, useEffect } from 'react';
import { Vehicle, Expense } from '../types';
import { db } from '../services/db';
import { Plus, Filter, Calendar, CreditCard, Edit2, Trash2, X, ChevronRight } from 'lucide-react';

interface ExpensesPageProps {
  vehicle: Vehicle;
}

type FilterPeriod = 'semana' | 'mes' | 'ano' | 'personalizado' | 'todos';

const ExpensesPage: React.FC<ExpensesPageProps> = ({ vehicle }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [period, setPeriod] = useState<FilterPeriod>('todos');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const [formData, setFormData] = useState<Partial<Expense>>({
    category: 'combustivel',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  useEffect(() => {
    loadExpenses();
  }, [vehicle, period, dateRange]);

  useEffect(() => {
    if (editingExpense) {
      setFormData({ ...editingExpense });
      setShowForm(true);
    }
  }, [editingExpense]);

  const loadExpenses = () => {
    let all = db.getExpenses(vehicle.id);
    const now = new Date();

    if (period === 'semana') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      all = all.filter(e => new Date(e.date) >= weekAgo);
    } else if (period === 'mes') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      all = all.filter(e => new Date(e.date) >= monthAgo);
    } else if (period === 'ano') {
      const yearAgo = new Date();
      yearAgo.setFullYear(now.getFullYear() - 1);
      all = all.filter(e => new Date(e.date) >= yearAgo);
    } else if (period === 'personalizado' && dateRange.start && dateRange.end) {
      all = all.filter(e => {
        const d = new Date(e.date);
        return d >= new Date(dateRange.start) && d <= new Date(dateRange.end);
      });
    }

    setExpenses(all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExpense) {
      const updated: Expense = {
        ...editingExpense,
        ...formData as Expense,
      };
      db.updateExpense(updated);
    } else {
      const exp: Expense = {
        ...formData as Expense,
        id: Math.random().toString(36).substr(2, 9),
        vehicleId: vehicle.id,
      };
      db.addExpense(exp);
    }
    closeForm();
    loadExpenses();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingExpense(null);
    setFormData({ category: 'combustivel', amount: 0, date: new Date().toISOString().split('T')[0], description: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm("Remover este lançamento permanentemente?")) {
      db.deleteExpense(id);
      loadExpenses();
    }
  };

  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Controle de Gastos</h2>
          <p className="text-slate-500 font-bold">{vehicle.brand} {vehicle.model} • <span className="text-blue-600">Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-[20px] font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={24} />
          Lançar Gasto
        </button>
      </div>

      {/* Period Selector Tiles */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <Filter size={20} className="text-blue-600" />
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Filtrar Histórico</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(['todos', 'semana', 'mes', 'ano', 'personalizado'] as FilterPeriod[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                period === p 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' 
                : 'bg-slate-100 text-slate-400 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {period === 'personalizado' && (
          <div className="mt-8 flex flex-col sm:flex-row items-end gap-4 p-6 bg-slate-50 rounded-[32px] animate-in slide-in-from-top-4">
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Data Inicial</label>
              <input 
                type="date" 
                value={dateRange.start}
                onChange={e => setDateRange({...dateRange, start: e.target.value})}
                className="w-full px-5 py-4 bg-white border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700" 
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Data Final</label>
              <input 
                type="date" 
                value={dateRange.end}
                onChange={e => setDateRange({...dateRange, end: e.target.value})}
                className="w-full px-5 py-4 bg-white border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700" 
              />
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-xl font-black text-slate-800">
                {editingExpense ? 'Editar Lançamento' : 'Novo Gasto'}
              </h3>
              <button onClick={closeForm} className="p-3 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Categoria</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as any})}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-black text-slate-700"
                >
                  <option value="combustivel">⛽ Combustível</option>
                  <option value="manutencao">🔧 Manutenção</option>
                  <option value="imposto">📄 Impostos/Taxas</option>
                  <option value="seguro">🛡️ Seguro</option>
                  <option value="outros">📦 Outros</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Valor do Gasto</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-3xl font-black text-blue-600"
                  placeholder="0,00"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Data da Transação</label>
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Onde ou com o que?</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700"
                  placeholder="Ex: Posto do Centro"
                />
              </div>
              
              <div className="flex gap-4 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 py-5 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-200 transition-all active:scale-95"
                >
                  {editingExpense ? 'Salvar Alterações' : 'Confirmar Gasto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense List */}
      <div className="grid grid-cols-1 gap-4">
        {expenses.length === 0 ? (
          <div className="bg-white py-24 rounded-[40px] text-center text-slate-400 font-bold border border-slate-100 italic">
            Nenhum registro encontrado para o período selecionado.
          </div>
        ) : (
          expenses.map((exp) => (
            <div key={exp.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 group hover:shadow-lg transition-all">
              <div className="flex items-center gap-5 w-full sm:w-auto">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner ${
                  exp.category === 'combustivel' ? 'bg-orange-50' : 
                  exp.category === 'manutencao' ? 'bg-blue-50' : 'bg-slate-50'
                }`}>
                  {exp.category === 'combustivel' ? '⛽' : 
                   exp.category === 'manutencao' ? '🔧' : 
                   exp.category === 'imposto' ? '📄' : 
                   exp.category === 'seguro' ? '🛡️' : '📦'}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 leading-tight">{exp.description || 'Lançamento Diversos'}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(exp.date).toLocaleDateString('pt-BR')}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{exp.category}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</p>
                  <p className="text-xl font-black text-slate-900">R$ {exp.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setEditingExpense(exp)}
                    className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all active:scale-90"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(exp.id)}
                    className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpensesPage;

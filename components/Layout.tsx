
import React from 'react';
import { 
  Home, 
  Car, 
  DollarSign, 
  Book, 
  LogOut, 
  Menu, 
  X,
  PieChart,
  MessageCircle,
  Users
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  userName: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout, userName }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Início', icon: <Home size={20} /> },
    { id: 'veiculos', label: 'Meus Veículos', icon: <Car size={20} /> },
    { id: 'gastos', label: 'Gastos', icon: <DollarSign size={20} /> },
    { id: 'consumo', label: 'Calculadora', icon: <PieChart size={20} /> },
    { id: 'guias', label: 'Central de Guias', icon: <Book size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img src="https://i.imgur.com/I4K5xg2.png" alt="Logo" className="w-8 h-8 object-contain" />
          <h1 className="text-lg font-bold text-blue-600">Central do Condutor</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex md:flex-col
      `}>
        <div className="p-8 flex flex-col items-center border-b border-slate-800">
          <img src="https://i.imgur.com/I4K5xg2.png" alt="Logo" className="w-16 h-16 object-contain mb-4" />
          <h1 className="text-xl font-black text-white text-center leading-tight">Central do Condutor</h1>
          <p className="text-slate-400 text-xs mt-2 font-medium italic">Olá, {userName}</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Principal</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all
                ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              {item.icon}
              <span className="font-bold">{item.label}</span>
            </button>
          ))}

          <div className="mt-8 pt-8 border-t border-slate-800">
            <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Suporte e Comunidade</p>
            <a 
              href="https://wa.me/32998426140" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-4 py-3 text-emerald-400 hover:bg-emerald-900/20 rounded-2xl transition-all"
            >
              <MessageCircle size={20} />
              <span className="font-bold">Falar com Mecânico</span>
            </a>
            <a 
              href="https://chat.whatsapp.com/HDLFvcHmbSB1CwdSE4ROpM" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-4 py-3 text-sky-400 hover:bg-sky-900/20 rounded-2xl transition-all"
            >
              <Users size={20} />
              <span className="font-bold">Grupo de Motoristas</span>
            </a>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-4 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-2xl transition-all font-bold"
          >
            <LogOut size={20} />
            Sair da Conta
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto pb-24 md:pb-10">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 flex items-center justify-around p-2 z-40">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`}
          >
            {item.icon}
            <span className="text-[10px] mt-1 font-bold">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;

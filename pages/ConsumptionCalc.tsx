
import React, { useState } from 'react';
import { Calculator, Zap, Fuel, Route } from 'lucide-react';

const ConsumptionCalc: React.FC = () => {
  const [km, setKm] = useState<number | string>('');
  const [liters, setLiters] = useState<number | string>('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    if (km && liters) {
      setResult(Number(km) / Number(liters));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Calculator size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Calculadora de Consumo</h2>
        <p className="text-slate-500">Descubra quantos km seu veículo faz por litro</p>
      </div>

      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Route size={16} />
              Quilômetros Rodados
            </label>
            <input
              type="number"
              value={km}
              onChange={e => setKm(e.target.value)}
              placeholder="Ex: 450"
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-lg font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Fuel size={16} />
              Litros Abastecidos
            </label>
            <input
              type="number"
              value={liters}
              onChange={e => setLiters(e.target.value)}
              placeholder="Ex: 45"
              className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-lg font-bold"
            />
          </div>
          
          <button
            onClick={calculate}
            className="w-full py-5 bg-blue-600 text-white font-bold rounded-3xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
          >
            <Zap size={20} />
            Calcular Média
          </button>
        </div>

        {result !== null && (
          <div className="mt-8 p-8 bg-blue-50 rounded-[32px] text-center border-2 border-dashed border-blue-200 animate-in zoom-in duration-300">
            <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-2">Sua média é de</p>
            <h3 className="text-5xl font-black text-blue-700 mb-1">
              {result.toFixed(2)}
              <span className="text-xl font-bold ml-2">km/l</span>
            </h3>
            <p className="text-blue-400 text-sm">Bom trabalho! Uma média eficiente economiza no bolso.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <h4 className="font-bold text-slate-700 mb-2">Dica de Ouro:</h4>
          <p className="text-sm text-slate-500">Para uma medição precisa, sempre complete o tanque até o automático da bomba, zere o odômetro parcial e repita o processo no próximo abastecimento.</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <h4 className="font-bold text-slate-700 mb-2">Economize:</h4>
          <p className="text-sm text-slate-500">Pneus descalibrados podem aumentar o consumo em até 10%. Verifique a calibragem a cada 15 dias.</p>
        </div>
      </div>
    </div>
  );
};

export default ConsumptionCalc;

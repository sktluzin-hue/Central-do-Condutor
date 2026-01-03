
import React, { useState } from 'react';
import { GUIDES, DASHBOARD_LIGHTS, VIDEO_LESSONS, CHECKLIST_ITEMS } from '../constants';
import { 
  BookOpen, 
  Lightbulb, 
  PlayCircle, 
  CheckCircle, 
  Search,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

const GuidesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guias' | 'luzes' | 'videos' | 'checklist'>('guias');
  const [selectedGuide, setSelectedGuide] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Central de Conhecimento</h2>
          <p className="text-slate-500">Tudo o que você precisa saber sobre seu veículo</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 overflow-x-auto">
        <button 
          onClick={() => {setActiveTab('guias'); setSelectedGuide(null);}}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${activeTab === 'guias' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
        >
          <BookOpen size={18} />
          Guias
        </button>
        <button 
          onClick={() => {setActiveTab('luzes'); setSelectedGuide(null);}}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${activeTab === 'luzes' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
        >
          <Lightbulb size={18} />
          Painel
        </button>
        <button 
          onClick={() => {setActiveTab('checklist'); setSelectedGuide(null);}}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${activeTab === 'checklist' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
        >
          <CheckCircle size={18} />
          Checklist
        </button>
        <button 
          onClick={() => {setActiveTab('videos'); setSelectedGuide(null);}}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${activeTab === 'videos' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
        >
          <PlayCircle size={18} />
          Vídeos
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === 'guias' && !selectedGuide && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GUIDES.map(guide => (
              <button
                key={guide.id}
                onClick={() => setSelectedGuide(guide)}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4 text-left group"
              >
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  {guide.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">{guide.title}</h4>
                  <p className="text-sm text-slate-400">{guide.description}</p>
                </div>
                <ChevronRight className="text-slate-300" />
              </button>
            ))}
          </div>
        )}

        {selectedGuide && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-right-4 duration-300">
            <button onClick={() => setSelectedGuide(null)} className="text-blue-600 font-bold mb-6 flex items-center gap-2 hover:underline">
              ← Voltar para Guias
            </button>
            <h3 className="text-3xl font-black text-slate-800 mb-6">{selectedGuide.title}</h3>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
              {selectedGuide.content}
            </div>
          </div>
        )}

        {activeTab === 'luzes' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {DASHBOARD_LIGHTS.map(light => (
              <div key={light.id} className="bg-white p-6 rounded-3xl border border-slate-100 text-center flex flex-col items-center group">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-slate-50 transition-colors`}>
                  {React.cloneElement(light.icon as React.ReactElement, { size: 32 })}
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-2">{light.name}</h4>
                <p className="text-[10px] text-slate-400 leading-tight">{light.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Inspeção Preventiva</h3>
            <div className="space-y-4">
              {CHECKLIST_ITEMS.map((item, idx) => (
                <label key={idx} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-6 h-6 border-2 border-slate-200 rounded-lg peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                      <CheckCircle className="text-white opacity-0 peer-checked:opacity-100" size={16} />
                    </div>
                  </div>
                  <span className="text-slate-600 font-medium">{item}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VIDEO_LESSONS.map(video => (
              <div key={video.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group">
                <div className="aspect-video bg-slate-200 relative">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={video.url} 
                    title={video.title} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{video.title}</h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuidesPage;

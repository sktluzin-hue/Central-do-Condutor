
import React, { useState } from 'react';
import { db } from '../services/db';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const users = db.getUsers();
      const user = users.find(u => u.email === email);
      if (user) {
        onLogin(user);
      } else {
        setError('Usuário não encontrado.');
      }
    } else {
      if (!name || !email || !password) {
        setError('Preencha todos os campos.');
        return;
      }
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
      };
      db.saveUser(newUser);
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-xl overflow-hidden">
        <div className="p-10">
          <div className="text-center mb-10">
            <img src="https://i.imgur.com/I4K5xg2.png" alt="Logo" className="w-24 h-24 object-contain mx-auto mb-4" />
            <h1 className="text-3xl font-black text-slate-900 mb-1">Central do Condutor</h1>
            <p className="text-slate-500 font-medium">Seu assistente inteligente</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium"
                  placeholder="Ex: João Silva"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl text-center">{error}</p>}

            <button
              type="submit"
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-[24px] transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              {isLogin ? 'Entrar Agora' : 'Criar minha Conta'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-400 font-bold hover:text-blue-600 transition-colors"
            >
              {isLogin ? 'Novo por aqui? Cadastre-se' : 'Já sou membro? Fazer login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

"use client";

import React, { useState, useEffect } from 'react';

// Define o tipo para os horários
type HorarioDisponivel = {
  id: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  disponivel: boolean;
};

export default function AgendamentoPage() {
  const [todosHorarios, setTodosHorarios] = useState<HorarioDisponivel[]>([]);
  const [isLoadingHorarios, setIsLoadingHorarios] = useState(true);
  const [dataSelecionada, setDataSelecionada] = useState("2025-06-16"); // Define data inicial com horários
  const [horarioSelecionado, setHorarioSelecionado] = useState<HorarioDisponivel | null>(null);
  const [nomeCliente, setNomeCliente] = useState('');
  const [telefoneCliente, setTelefoneCliente] = useState('');
  const [agendamentoConcluido, setAgendamentoConcluido] = useState(false);
  const [mensagemStatus, setMensagemStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para feedback de envio

  // Carrega os horários disponíveis via API quando o componente monta
  useEffect(() => {
    async function carregarHorarios() {
      setIsLoadingHorarios(true);
      try {
        const response = await fetch("/api/horarios");
        if (!response.ok) {
          throw new Error("Falha ao buscar horários");
        }
        const horarios = await response.json();
        setTodosHorarios(horarios);
        // DEBUG: Verificar dados recebidos da API
        console.log("Horários recebidos da API:", horarios);
      } catch (error: unknown) { // CORREÇÃO ESLint: Usando 'unknown'
        console.error("Erro ao carregar horários:", error);
        setMensagemStatus("Erro ao carregar horários disponíveis.");
      } finally {
        setIsLoadingHorarios(false);
      }
    }
    carregarHorarios();
  }, []);

  // Filtra os horários disponíveis para a data selecionada
  const horariosDoDia = todosHorarios.filter(
    slot => slot.data === dataSelecionada && slot.disponivel
  );

  // DEBUG: Ver o que está sendo filtrado
  console.log("Data Selecionada:", dataSelecionada);
  console.log("Todos Horários (Estado):", todosHorarios);
  console.log("Horários Filtrados para o Dia:", horariosDoDia);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDataSelecionada(event.target.value);
    setHorarioSelecionado(null); // Reseta o horário ao mudar a data
    setMensagemStatus(''); // Limpa mensagens de status
  };

  const handleAgendar = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!horarioSelecionado || !nomeCliente || !telefoneCliente) {
      setMensagemStatus("Por favor, selecione um horário e preencha seu nome e telefone.");
      return;
    }

    setIsSubmitting(true);
    setMensagemStatus('Processando agendamento...');

    try {
      const response = await fetch('/api/agendamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idSlot: horarioSelecionado.id,
          nomeCliente: nomeCliente,
          telefoneCliente: telefoneCliente,
        }),
      });

      const resultado = await response.json();

      if (!response.ok) {
        // Usa a mensagem de erro da API se disponível, senão uma genérica
        throw new Error(resultado.message || `Erro ${response.status}`);
      }

      setMensagemStatus(resultado.message);
      setAgendamentoConcluido(true);
      // Atualiza a lista de horários localmente para refletir a mudança
      setTodosHorarios(prevHorarios =>
        prevHorarios.map(h =>
          h.id === horarioSelecionado.id ? { ...h, disponivel: false } : h
        )
      );

    } catch (error: unknown) { // CORREÇÃO ESLint: Usando 'unknown' e verificando o tipo
      console.error("Erro ao criar agendamento:", error);
      if (error instanceof Error) {
        setMensagemStatus(`Falha ao agendar: ${error.message}`);
      } else {
        setMensagemStatus(`Falha ao agendar: Um erro desconhecido ocorreu.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (agendamentoConcluido) {
    return (
      <div className="bg-neutral-50 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <h2 className="text-3xl font-bold text-secondary-600 mb-4">Agendamento Realizado com Sucesso!</h2>
          <p className="text-neutral-700 text-lg">Seu horário para <span className="font-semibold">{horarioSelecionado?.data}</span> às <span className="font-semibold">{horarioSelecionado?.horaInicio}</span> foi confirmado.</p>
          <p className="text-neutral-600 mt-4">Entraremos em contato se necessário. Obrigado!</p>
          <button
            onClick={() => {
              setAgendamentoConcluido(false);
              setHorarioSelecionado(null);
              setNomeCliente('');
              setTelefoneCliente('');
              setMensagemStatus('');
            }}
            className="mt-8 px-6 py-3 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition-colors duration-300 shadow-md"
          >
            Agendar outro horário
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-neutral-900 text-center mb-10 leading-tight">Agende sua Consulta</h1>

        {/* Seleção de Data */}
        <div className="mb-8">
          <label htmlFor="date-select" className="block text-lg font-semibold text-neutral-700 mb-3">
            1. Selecione a Data:
          </label>
          <input
            type="date"
            id="date-select"
            value={dataSelecionada}
            onChange={handleDateChange}
            className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150 ease-in-out text-neutral-800"
          />
        </div>

        {/* Seleção de Horário */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-700 mb-3">2. Horários Disponíveis para {dataSelecionada}:</h2>
          {isLoadingHorarios && <p className="text-neutral-500 italic text-center">Carregando horários...</p>}
          {!isLoadingHorarios && horariosDoDia.length === 0 && (
             <p className="text-neutral-500 italic text-center">Não há horários disponíveis para esta data. Por favor, selecione outra.</p>
          )}
          {!isLoadingHorarios && horariosDoDia.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {horariosDoDia.map((horario) => (
                <button
                  key={horario.id}
                  onClick={() => setHorarioSelecionado(horario)}
                  disabled={!horario.disponivel}
                  className={`p-3 border rounded-lg text-center font-medium transition-all duration-200 shadow-sm
                    ${horarioSelecionado?.id === horario.id
                      ? 'bg-primary-600 text-white border-primary-700 shadow-md'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-primary-100 hover:text-primary-800 border-neutral-200'
                    }
                    disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed disabled:shadow-none
                  `}
                >
                  {horario.horaInicio}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Formulário de Dados do Cliente */}
        {horarioSelecionado && (
          <form onSubmit={handleAgendar} className="mt-10 border-t border-neutral-200 pt-8">
            <h2 className="text-lg font-semibold text-neutral-700 mb-4">3. Seus Dados para o Agendamento:</h2>
            <p className="mb-6 text-neutral-600">Você selecionou: <strong className="text-primary-700">{horarioSelecionado.data} às {horarioSelecionado.horaInicio}</strong></p>
            <div className="mb-4">
              <label htmlFor="nome" className="block text-sm font-medium text-neutral-700 mb-2">Nome Completo:</label>
              <input
                type="text"
                id="nome"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                required
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150 ease-in-out text-neutral-800"
                placeholder="Seu nome completo"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="telefone" className="block text-sm font-medium text-neutral-700 mb-2">Telefone (com DDD):</label>
              <input
                type="tel"
                id="telefone"
                value={telefoneCliente}
                onChange={(e) => setTelefoneCliente(e.target.value)}
                placeholder="(XX) XXXXX-XXXX"
                required
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150 ease-in-out text-neutral-800"
              />
            </div>
            {/* Exibe mensagem de status/erro */}
            {mensagemStatus &&
              <p className={`mb-4 text-base font-medium ${agendamentoConcluido ? 'text-secondary-600' : 'text-red-600'}`}>
                {mensagemStatus}
              </p>
            }
            <button
              type="submit"
              disabled={isSubmitting} // Desabilita enquanto envia
              className="w-full px-6 py-3 bg-secondary-600 text-white font-semibold rounded-full hover:bg-secondary-700 transition-colors duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Confirmando...' : 'Confirmar Agendamento'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

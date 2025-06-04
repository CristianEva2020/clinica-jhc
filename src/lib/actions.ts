"use server"; // Marca este módulo para rodar apenas no servidor

import fs from 'fs/promises';
import path from 'path';

// Tipos para nossos dados (podemos refinar depois)
type HorarioDisponivel = {
  id: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  disponivel: boolean;
};

type Agendamento = {
  idAgendamento: string;
  idSlot: string;
  dataHoraAgendamento: string;
  nomeCliente: string;
  telefoneCliente: string;
};

// Caminho para os arquivos JSON
const horariosPath = path.resolve(process.cwd(), 'src/data/horariosDisponiveis.json');
const agendamentosPath = path.resolve(process.cwd(), 'src/data/agendamentos.json');

// Função para LER todos os horários disponíveis
export async function getHorariosDisponiveis(): Promise<HorarioDisponivel[]> {
  try {
    const data = await fs.readFile(horariosPath, 'utf-8');
    return JSON.parse(data) as HorarioDisponivel[];
  } catch (error) {
    console.error("Erro ao ler horários:", error);
    return []; // Retorna vazio em caso de erro
  }
}

// Função para CRIAR um novo agendamento e ATUALIZAR o horário
export async function criarAgendamento(idSlot: string, nomeCliente: string, telefoneCliente: string): Promise<{ success: boolean; message: string }> {
  try {
    // Ler dados atuais
    const horarios = await getHorariosDisponiveis();
    const agendamentosData = await fs.readFile(agendamentosPath, 'utf-8');
    const agendamentos: Agendamento[] = JSON.parse(agendamentosData);

    // Encontrar o slot e verificar disponibilidade
    const slotIndex = horarios.findIndex(slot => slot.id === idSlot);
    if (slotIndex === -1 || !horarios[slotIndex].disponivel) {
      return { success: false, message: "Horário não encontrado ou já agendado." };
    }

    // Marcar slot como indisponível
    horarios[slotIndex].disponivel = false;

    // Criar novo agendamento
    const novoAgendamento: Agendamento = {
      idAgendamento: `ag-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      idSlot: idSlot,
      dataHoraAgendamento: new Date().toISOString(),
      nomeCliente: nomeCliente,
      telefoneCliente: telefoneCliente,
    };
    agendamentos.push(novoAgendamento);

    // Salvar as alterações nos arquivos JSON
    await fs.writeFile(horariosPath, JSON.stringify(horarios, null, 2));
    await fs.writeFile(agendamentosPath, JSON.stringify(agendamentos, null, 2));

    console.log("Novo agendamento salvo:", novoAgendamento);
    // Aqui poderíamos adicionar a lógica de notificação por e-mail

    return { success: true, message: "Agendamento realizado com sucesso!" };

  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return { success: false, message: "Ocorreu um erro ao tentar agendar." };
  }
}

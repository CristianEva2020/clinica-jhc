import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Tipos
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

const horariosPath = path.resolve(process.cwd(), 'src/data/horariosDisponiveis.json');
const agendamentosPath = path.resolve(process.cwd(), 'src/data/agendamentos.json');

// Handler para POST requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idSlot, nomeCliente, telefoneCliente } = body;

    if (!idSlot || !nomeCliente || !telefoneCliente) {
      return NextResponse.json({ message: "Dados incompletos." }, { status: 400 });
    }

    // Ler dados atuais
    const horariosData = await fs.readFile(horariosPath, 'utf-8');
    const horarios: HorarioDisponivel[] = JSON.parse(horariosData);
    const agendamentosData = await fs.readFile(agendamentosPath, 'utf-8');
    const agendamentos: Agendamento[] = JSON.parse(agendamentosData);

    // Encontrar o slot e verificar disponibilidade
    const slotIndex = horarios.findIndex(slot => slot.id === idSlot);
    if (slotIndex === -1 || !horarios[slotIndex].disponivel) {
      return NextResponse.json({ message: "Horário não encontrado ou já agendado." }, { status: 409 }); // 409 Conflict
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

    console.log("Novo agendamento salvo via API:", novoAgendamento);
    // Lógica de notificação pode vir aqui

    return NextResponse.json({ success: true, message: "Agendamento realizado com sucesso!" }, { status: 201 }); // 201 Created

  } catch (error) {
    console.error("Erro ao criar agendamento via API:", error);
    return NextResponse.json({ message: "Ocorreu um erro interno ao tentar agendar." }, { status: 500 });
  }
}

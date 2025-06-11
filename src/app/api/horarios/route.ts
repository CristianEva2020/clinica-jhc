import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Tipos (podemos mover para um arquivo compartilhado depois)
type HorarioDisponivel = {
  id: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  disponivel: boolean;
};

const horariosPath = path.resolve(process.cwd(), 'src/data/horariosDisponiveis.json');

// Handler para GET requests
export async function GET() {
  try {
    const data = await fs.readFile(horariosPath, 'utf-8');
    const horarios: HorarioDisponivel[] = JSON.parse(data);
    // Opcional: Filtrar apenas os disponíveis aqui se preferir
    // const horariosDisponiveis = horarios.filter(h => h.disponivel);
    return NextResponse.json(horarios); // Retorna todos, o frontend filtra por data/disponibilidade
  } catch (error) {
    console.error("Erro ao ler horários via API:", error);
    return NextResponse.json({ message: "Erro ao buscar horários." }, { status: 500 });
  }
}

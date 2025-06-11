import Image from 'next/image';
import Link from 'next/link'; // Adicione este import

export default function HomePage() {
  return (
    <div className="container mx-auto px-6 py-8">
      
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Bem-vindo à CLINICA JHC</h1>
        <p className="text-lg text-gray-600">Cuidando do seu sorriso com tecnologia e atenção.</p>
      </section>

      <section className="flex flex-col md:flex-row items-center justify-center mb-12 gap-8">
        <div className="w-auto h-auto p-4">
          <Image 
            src="/logo-clinica-jhc.jpeg" 
            alt="Logo CLINICA JHC"
            width={250} 
            height={100} 
            priority 
          /> 
        </div>
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Sobre a CLINICA JHC</h2>
          <p className="text-gray-600">
            Texto sobre a clínica, missão, valores, ou uma breve introdução...
          </p>
        </div>
      </section>

      {/* Nova Seção com Botão de Agendamento */}
      <section className="text-center my-16">
        <Link 
          href="/agendamento"
          className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 transition-colors duration-300 shadow-lg"
        >
          Seja Meu Paciente - Agende sua Consulta
        </Link>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Próximos Passos</h2>
        <p className="text-center text-gray-600">Implementaremos a seção de serviços detalhados, o sistema de agendamento e o blog em breve.</p>
      </section>

    </div> 
  );
}

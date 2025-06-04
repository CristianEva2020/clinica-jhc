import Link from 'next/link';
import { getSortedPostsData, PostData } from '@/lib/posts'; // Importa a função e o tipo

export default function BlogPage() {
  const allPostsData: PostData[] = getSortedPostsData(); // Busca os dados dos posts

  return (
    <div className="bg-neutral-50 py-16 px-4 sm:px-6 lg:px-8 min-h-screen"> {/* Fundo leve, padding responsivo, altura mínima */}
      <div className="max-w-4xl mx-auto"> {/* Container centralizado e mais largo */}
        <h1 className="text-5xl font-extrabold text-neutral-900 text-center mb-12 leading-tight">
          Nosso Blog de Saúde Bucal
        </h1>

        {allPostsData.length === 0 ? (
          <p className="text-center text-neutral-500 text-lg">Nenhum post encontrado no momento. Volte em breve!</p>
        ) : (
          <div className="space-y-10"> {/* Espaçamento maior entre os artigos */}
            {allPostsData.map(({ id, date, title, excerpt, slug }) => (
              <article
                key={id}
                className="bg-white p-8 rounded-xl shadow-xl border border-neutral-100
                           transform hover:scale-[1.02] transition duration-300 ease-in-out"
              > {/* Card moderno com sombra, bordas arredondadas e efeito hover */}
                <h2 className="text-3xl font-bold text-primary-700 mb-3">
                  <Link href={`/blog/${slug}`} className="hover:underline hover:text-primary-800">
                    {title}
                  </Link>
                </h2>
                <div className="text-base text-neutral-500 mb-4">
                  Publicado em: {new Date(date).toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  {excerpt}
                </p>
                <Link
                  href={`/blog/${slug}`}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full
                             shadow-sm text-white bg-primary-600 hover:bg-primary-700
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150 ease-in-out"
                >
                  Leia mais
                  <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

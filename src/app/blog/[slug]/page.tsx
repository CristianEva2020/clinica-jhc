import { getAllPostIds, getPostData, PostData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { ParsedUrlQuery } from 'querystring'; // Importar ParsedUrlQuery para tipagem

// Função para gerar os parâmetros estáticos (slugs) em tempo de build
export async function generateStaticParams() {
  const paths = getAllPostIds();
  // paths é [{ params: { slug: 'primeiro-post' } }, ...]
  return paths.map(p => ({ slug: p.params.slug }));
}

// Props para a página do post
type PostPageProps = {
  params: {
    slug: string;
  };
};

// Componente da página do post
export default async function PostPage({ params }: PostPageProps) {
  let postData: PostData;
  try {
    postData = await getPostData(params.slug);
  } catch (error: unknown) { // CORREÇÃO ESLint: Usando 'unknown'
    // Se getPostData der erro (ex: arquivo não encontrado), retorna 404
    console.error(`Erro ao buscar post ${params.slug}:`, error);
    notFound();
  }

  return (
    <article className="container mx-auto px-6 py-12 max-w-3xl bg-white shadow-lg rounded-lg my-8">
      <h1 className="text-4xl font-extrabold text-neutral-900 mb-4 leading-tight">
        {postData.title}
      </h1>
      <div className="text-neutral-500 text-sm mb-6">
        Publicado em: {new Date(postData.date).toLocaleDateString()}
      </div>

      {/* Renderiza o conteúdo HTML do post */}
      {/* Adicionamos classes do Tailwind para estilizar o HTML gerado */}
      <div
        className="prose prose-lg max-w-none
                   prose-headings:text-neutral-800 prose-p:text-neutral-700
                   prose-a:text-primary-600 hover:prose-a:text-primary-800
                   prose-strong:text-neutral-800 prose-ul:list-disc prose-ul:ml-6
                   prose-ol:list-decimal prose-ol:ml-6 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }}
      />
    </article>
  );
}

// Opcional: Gerar metadados dinâmicos para o <head>
export async function generateMetadata({ params }: PostPageProps) {
  try {
    const postData = await getPostData(params.slug);
    return {
      title: `${postData.title} | Blog Clínica JHC`,
      description: postData.excerpt,
    };
  } catch (error: unknown) { // CORREÇÃO ESLint: Usando 'unknown' e logando o erro
    console.error(`Erro ao gerar metadados para o slug ${params.slug}:`, error);
    return {
      title: "Post não encontrado | Blog Clínica JHC",
    };
  }
}

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'; // Para ler frontmatter
import { remark } from 'remark';   // Para processar markdown
import html from 'remark-html'; // Para converter para HTML

const postsDirectory = path.join(process.cwd(), 'src/posts');

export type PostData = {
  id: string; // O nome do arquivo sem .md
  title: string;
  date: string;
  excerpt: string;
  contentHtml?: string; // Conteúdo completo em HTML (opcional para listagem)
  slug: string;
};

// Função para buscar todos os posts (para a página de listagem)
export function getSortedPostsData(): PostData[] {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id (que também será o slug aqui)
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      title: matterResult.data.title || 'Sem Título',
      date: matterResult.data.date || 'Sem Data',
      excerpt: matterResult.data.excerpt || '',
      slug: id, // Definindo o slug aqui, igual ao ID do arquivo
    } as PostData;
  });

  // Sort posts by date (mais recentes primeiro)
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// Função para buscar os IDs (slugs) de todos os posts (para gerar rotas dinâmicas)
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  // Retorna um array como: [{ params: { slug: 'primeiro-post' } }, ...]
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ''), // Nome do parâmetro deve ser 'slug'
      },
    };
  });
}

// Função para buscar os dados de um post específico E seu conteúdo HTML
export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data com o id (que é o slug neste caso) e contentHtml
  return {
    id: slug, // O ID é o mesmo que o slug
    slug: slug,
    contentHtml,
    title: matterResult.data.title || 'Sem Título',
    date: matterResult.data.date || 'Sem Data',
    excerpt: matterResult.data.excerpt || '',
  };
}
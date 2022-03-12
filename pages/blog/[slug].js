import fs from 'fs';
import matter from 'gray-matter';
import { marked } from 'marked';
import Link from 'next/link';
import path from 'path';
import CategoryLabel from '../../components/CategoryLabel';
import Layout from '../../components/Layout';

export default function PostPage({
  frontmatter: {
    title,
    category,
    date,
    cover_image: coverImage,
    author,
    author_image: authorImage,
  }, content,
}) {
  return (
    <Layout title={title}>
      <Link href="/blog">Go Back</Link>
      <div className="w-full px-10 py-6 bg-white rounded-lg shadow-md mt-6">
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-5xl mb-7">{title}</h1>
          <CategoryLabel>{category}</CategoryLabel>
        </div>
        <img src={coverImage} alt="" className="w-full rounded" />

        <div className="flex justify-between items-center bg-gray-100 p2 my-2">
          <div className="flex items-center">
            <img src={authorImage} alt="" className="mx-4 w-10 object-cover rounded-full hidden sm:block" />
            <h4>{author}</h4>
          </div>
          <div className="mr-4">{date}</div>
        </div>

        <div className="blog-text mt-2">
          <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join('posts'));

  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace('.md', ''),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const markdownWithMeta = fs.readFileSync(path.join('posts', `${slug}.md`), 'utf-8');

  const { data: frontmatter, content } = matter(markdownWithMeta);

  return {
    props: {
      frontmatter,
      content,
    },
  };
}

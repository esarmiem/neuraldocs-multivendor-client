import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Copy } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  typewriter?: boolean;
}

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Preprocesa el markdown para asegurar que los bloques de código estén bien delimitados y no se mezclen con el texto
function preprocessMarkdown(content: string): string {
  // Corrige casos donde hay triple backtick seguido del lenguaje pero sin salto de línea
  let fixed = content.replace(/```(\w+)\s+/g, (match, lang) => `\n\`\`\`${lang}\n`);
  // Si hay bloques de código mal cerrados, los cierra
  const openBlocks = (fixed.match(/```/g) || []).length;
  if (openBlocks % 2 !== 0) {
    fixed += '\n```';
  }
  // Elimina espacios extra antes de los backticks
  fixed = fixed.replace(/\s*```/g, '\n```');
  // Asegura que los bloques de código estén separados del texto
  fixed = fixed.replace(/([^\n])\n```/g, '$1\n\n```');
  fixed = fixed.replace(/```(\w+)\n([^]*?)```/g, (match, lang, code) => {
    // Quita espacios extra al inicio y final del bloque de código
    return `\n\`\`\`${lang}\n${code.trim()}\n\`\`\``;
  });
  return fixed;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, typewriter = false }) => {
  const [copied, setCopied] = useState(false);

  // Detecta si el texto contiene Markdown
  const isPlainText = (text: string) => {
    return !(/[\n*#`]/.test(text));
  };

  const CodeBlock = ({ inline, className, children }: CodeBlockProps) => {
    const code = String(children ?? '').replace(/\n$/, '');

    if (inline) {
      return <code className="bg-[#f3e8ff] text-[#652678] px-1 rounded">{code}</code>;
    }

    return (
      <div className="my-4 w-full max-w-full">
        <div className="relative w-full max-w-full">
          <button
            onClick={() => {
              navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="absolute top-2 right-2 bg-[#d91ba2] text-white px-2 py-1 rounded flex items-center text-xs hover:bg-[#652678] transition z-10"
            style={{ maxWidth: '100%' }}
          >
            <Copy className="h-4 w-4 mr-1" />
            {copied ? '¡Copiado!' : 'Copiar'}
          </button>
          <pre className="bg-[#f3e8ff] border border-[#d91ba2] rounded-lg p-4 overflow-x-auto text-sm w-full max-w-full box-border">
            <code className={className + ' w-full max-w-full box-border'}>{code}</code>
          </pre>
        </div>
      </div>
    );
  };

  // Solo animar si es texto plano
  const shouldTypewriter = typewriter && isPlainText(content);
  const [displayed, setDisplayed] = useState(shouldTypewriter ? '' : preprocessMarkdown(content));
  React.useEffect(() => {
    if (!shouldTypewriter) {
      setDisplayed(preprocessMarkdown(content));
      return;
    }
    let i = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      setDisplayed((prev) => {
        if (i >= content.length) {
          clearInterval(interval);
          return prev;
        }
        const next = prev + content[i];
        i++;
        return next;
      });
    }, 15);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, shouldTypewriter]);

  return (
    <div className="prose max-w-full w-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code: CodeBlock,
          strong: ({ children }) => <strong className="text-[#d91ba2] font-semibold">{children}</strong>,
          h3: ({ children }) => <h3 className="text-lg font-bold text-[#652678] mt-4 mb-2">{children}</h3>,
          h4: ({ children }) => <h4 className="text-base font-bold text-[#d91ba2] mt-3 mb-1">{children}</h4>,
          li: ({ children }) => <li className="ml-4 list-disc">{children}</li>,
        }}
      >
        {displayed}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 
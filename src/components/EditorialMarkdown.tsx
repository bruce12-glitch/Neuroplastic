import Markdown from "react-markdown";

export function EditorialMarkdown({ children }: { children: string }) {
  return (
    <div className="essay-markdown">
      <Markdown
        skipHtml
        unwrapDisallowed
        allowedElements={["p", "strong", "em", "h3", "h4", "ul", "ol", "li", "blockquote", "a", "br"]}
        components={{
          a: ({ href, title, children }) => (
            <a href={href} title={title} target={href?.startsWith("#") ? undefined : "_blank"} rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}

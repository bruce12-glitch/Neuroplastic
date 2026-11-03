import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EditorialMarkdown } from "./EditorialMarkdown.tsx";

test("author lists, subheadings, bold terms, and italics render as readable article structure", () => {
  const html = renderToStaticMarkup(
    <EditorialMarkdown>{"### A symbolic transition\n\n- **Identification:** Becoming *like* a parent.\n- **Superego:** Internalized authority.\n\n## Additional author heading"}</EditorialMarkdown>
  );
  assert.match(html, /<h3>A symbolic transition<\/h3>/);
  assert.equal((html.match(/<li>/g) ?? []).length, 2);
  assert.match(html, /<strong>Identification:<\/strong>/);
  assert.match(html, /<em>like<\/em>/);
  assert.match(html, /<strong>Superego:<\/strong>/);
  assert.match(html, /Additional author heading/);
});

test("article markup does not render raw HTML, scripts, images, or unsafe link schemes", () => {
  const html = renderToStaticMarkup(
    <EditorialMarkdown>{'<script>alert("bad")</script>\n\n<img src=x onerror="alert(1)">\n\n[Unsafe](javascript:alert%281%29)\n\n[Reference](https://example.org/reading)'}</EditorialMarkdown>
  );
  assert.doesNotMatch(html, /<script|<img|onerror|javascript:/i);
  assert.match(html, /href="https:\/\/example\.org\/reading"/);
  assert.match(html, /rel="noopener noreferrer"/);
});

import { marked } from 'marked';

export function parseMarkdown(markdown) {
  var md = marked(markdown);
  const keys = {
    code: 'code-block'
  }
  for (const key in keys) {
    md = md.replace(new RegExp(`<${key}>`, 'g'), `<${keys[key]}>`)
    md = md.replace(new RegExp(`</${key}>`, 'g'), `</${keys[key]}>`)
  }
  return md
}
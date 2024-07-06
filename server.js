const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const port = 3001;

app.use(express.json());

app.get("/convert", (req, res) => {
  const markdown = req.query.markdown;
  if (!markdown) {
    res.status(400).send("No markdown provided");
    return;
  }
  const html = parseMarkdown(markdown);
  console.log(html)
  res.send(html);
});

const parseMarkdown = (markdownText) => {
  let html = markdownText
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
    .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/!\[([^\]]+)\]\(([^\)]+)\)/gim, '<img src="$2" alt="$1" />')
    .replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2">$1</a>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/---/gim, '<hr>')
    .replace(/~~(.*?)~~/gim, '<s>$1</s>')
    .replace(/^\s*([-*+] .*$(\n?))+/gim, (match) => {
     
      const items = match.split('\n').map(item => {
        if (item.trim()) {
          return `<li>${item.trim().substring(2)}</li>`;
        }
      }).join('');
      return `<ul>${items}</ul>`;
    })
    .replace(/^\s*(\d+\. .*$(\n?))+/gim, (match) => {
    
      const items = match.split('\n').map(item => {
        if (item.trim()) {
          return `<li>${item.trim().substring(3)}</li>`;
        }
      }).join('');
      return `<ol>${items}</ol>`;
    })
    .replace(/\n$/gim, '<br />')
    .replace(/^\s*$/gim, '');

  return html.trim();
};

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const fs = require('fs');
const path = require('path');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const AMAZON_ID = process.env.AMAZON_TRACKING_ID || '';
const RAKUTEN_ID = process.env.RAKUTEN_AFFILIATE_ID || '';

const KEYWORDS = [
  {kw:"\u6642\u77ed\u30ec\u30b7\u30d4 \u7c21\u5358 \u591c\u3054\u98ef",genre:"recipe"},
  {kw:"\u4f5c\u308a\u7f6e\u304d \u304a\u304b\u305a \u30ec\u30b7\u30d4",genre:"recipe"},
  {kw:"\u5305\u4e01 \u7814\u304e\u65b9 \u521d\u5fc3\u8005",genre:"kitchen"},
  {kw:"\u30d5\u30e9\u30a4\u30d1\u30f3 \u304a\u3059\u3059\u3081 \u7126\u3052\u306a\u3044",genre:"kitchen"},
  {kw:"\u30c0\u30a4\u30a8\u30c3\u30c8 \u4f4e\u30ab\u30ed\u30ea\u30fc \u30ec\u30b7\u30d4",genre:"diet"},
  {kw:"\u96fb\u6c17\u5727\u529b\u934b \u304a\u3059\u3059\u3081 \u30ec\u30b7\u30d4",genre:"kitchen"},
  {kw:"\u30b9\u30d1\u30a4\u30b9\u30ab\u30ec\u30fc \u4f5c\u308a\u65b9 \u672c\u683c",genre:"recipe"},
  {kw:"\u304a\u83d3\u5b50 \u7c21\u5358 \u30ec\u30b7\u30d4",genre:"sweets"},
  {kw:"\u51b7\u51cd\u4fdd\u5b58 \u65b9\u6cd5 \u98df\u6750\u5225",genre:"technique"},
  {kw:"\u6599\u7406 \u57fa\u672c \u5207\u308a\u65b9 \u7a2e\u985e",genre:"technique"}
];

const SYS = `あなたは料理・グルメ専門ライターです。読者目線で分かりやすく、SEOに強い記事を書きます。見出しはH2/H3を使ってください。文字数2000字以上。Markdown形式で出力。記事内でおすすめ商品を紹介する箇所には[AMAZON:商品名]と[RAKUTEN:商品名]を合計5箇所挿入してください。`;

function insertLinks(text) {
  text = text.replace(/\[AMAZON:([^\]]+)\]/g, (_, p) => {
    return `[🛒 ${p}をAmazonでチェック](https://www.amazon.co.jp/s?k=${encodeURIComponent(p)}&tag=${AMAZON_ID})`;
  });
  text = text.replace(/\[RAKUTEN:([^\]]+)\]/g, (_, p) => {
    return `[🛍 ${p}を楽天でチェック](https://search.rakuten.co.jp/search/mall/${encodeURIComponent(p)}/?rafcid=${RAKUTEN_ID})`;
  });
  return text;
}

function toSlug(kw) {
  return kw.replace(/[\s\u3000]+/g, '-').replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF-]/g, '') + '-' + Date.now();
}

async function generateArticle(kw, genre) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      system: SYS,
      messages: [{ role: 'user', content: `ジャンル：${genre}\nキーワード：「${kw}」\n\nSEO記事をMarkdownで書いてください。` }],
    }),
  });
  const data = await res.json();
  return data.content?.map(c => c.text || '').join('') || '';
}

async function main() {
  const contentDir = path.join(process.cwd(), 'content/blog');
  if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });

  const targets = KEYWORDS.sort(() => Math.random() - 0.5).slice(0, 5);

  for (const { kw, genre } of targets) {
    console.log(`生成中: ${kw}`);
    try {
      let text = await generateArticle(kw, genre);
      text = insertLinks(text);
      const slug = toSlug(kw);
      const content = `---\ntitle: "${kw}"\ndate: "${new Date().toISOString().split('T')[0]}"\ngenre: "${genre}"\ntags: [${genre}]\n---\n\n${text}\n`;
      fs.writeFileSync(path.join(contentDir, `${slug}.mdx`), content);
      console.log(`完了: ${slug}.mdx`);
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.error(`エラー: ${kw}`, e.message);
    }
  }
  console.log('全記事生成完了！');
}

main();

const axios = require("axios");
const { shell } = require("electron");

// 各指標のシンボル（SMTB取得の債券を除く）
const SYMBOLS = {
  sp500: "^GSPC",
  nasdaq: "^IXIC",
  nikkei: "^N225",
  shanghai: "000001.SS",
  btc: "BTC-USD",
  usdjpy: "JPY=X",
  eurusd: "EUR=X",
  us10y: "^TNX",
};

// SMTBから取得する債券のID
const BOND_IDS = {
  jp10y: "japan10",
  de10y: "germany10",
  cn10y: "china10",
};

function convertToHalfWidth(str) {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
}

// 値を更新する関数
function updateValue(elementId, value, previousValue, prevClose) {
  const element = document.getElementById(elementId);
  const changeElement = document.getElementById(`${elementId}-change`);
  const percentElement = document.getElementById(`${elementId}-percent`);
  if (!element) return;

  // 値の変化に応じてクラスを設定
  element.classList.remove("up", "down");
  if (previousValue) {
    if (value > previousValue) {
      element.classList.add("up");
    } else if (value < previousValue) {
      element.classList.add("down");
    }
  }

  // 値のフォーマット
  let formattedValue;
  if (elementId.includes("jpy") || elementId.includes("usd")) {
    formattedValue = Number(value).toFixed(3);
  } else if (elementId.includes("10y")) {
    formattedValue = Number(value).toFixed(3) + "%";
  } else {
    formattedValue = Number(value).toFixed(2);
  }

  // 前日比と騰落率の計算と表示
  if (prevClose && changeElement && percentElement) {
    const change = value - prevClose;
    const percentChange = (change / prevClose) * 100;

    let changePrefix = change >= 0 ? "+" : "";
    let formattedChange;
    if (elementId.includes("jpy") || elementId.includes("usd")) {
      formattedChange = changePrefix + change.toFixed(3);
    } else if (elementId.includes("10y")) {
      formattedChange = changePrefix + change.toFixed(3);
    } else {
      formattedChange = changePrefix + change.toFixed(2);
    }

    changeElement.textContent = formattedChange;
    percentElement.textContent = `${changePrefix}${percentChange.toFixed(2)}%`;

    // 変化量の要素にも同じクラスを適用
    changeElement.classList.remove("up", "down");
    percentElement.classList.remove("up", "down");
    if (change > 0) {
      changeElement.classList.add("up");
      percentElement.classList.add("up");
    } else if (change < 0) {
      changeElement.classList.add("down");
      percentElement.classList.add("down");
    }
  }

  element.textContent = formattedValue;
}

// 前回の値を保存するオブジェクト
let previousValues = {};

// 単一のシンボルのデータを取得する関数
async function fetchSymbolData(symbol) {
  try {
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
    if (response.data && response.data.chart && response.data.chart.result) {
      const result = response.data.chart.result[0];
      const price = result.meta.regularMarketPrice;
      const prevClose = result.meta.previousClose;
      return { price, prevClose };
    }
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return null;
  }
}

// SMTBから債券利回りを取得する関数
async function fetchBondData() {
  try {
    const response = await axios.get("https://fund.smtb.jp/smtbhp/qsearch.exe?F=market3");
    const html = response.data;
    const results = {};

    // 各債券のデータを抽出
    for (const [key, id] of Object.entries(BOND_IDS)) {
      // 利回りと前日比を抽出するための正規表現
      const valueRegex = new RegExp(`id="${id}"[\\s\\S]*?<span>(\\d+\\.\\d+)%<\\/span>`);
      const changeRegex = new RegExp(`id="${id}"[\\s\\S]*?<span class="mod-txt-nb[^"]*">([+-]?\\d+\\.\\d+)<\\/span>`);

      const valueMatch = html.match(valueRegex);
      const changeMatch = html.match(changeRegex);

      if (valueMatch && valueMatch[1]) {
        const value = parseFloat(valueMatch[1]);
        const change = changeMatch ? parseFloat(changeMatch[1]) : null;
        results[key] = { value, change };
      }
    }

    return results;
  } catch (error) {
    console.error("Error fetching bond data:", error);
    return null;
  }
}

// すべてのマーケットデータを取得する関数
async function fetchMarketData() {
  try {
    // Yahoo Financeのデータを取得
    for (const [elementId, symbol] of Object.entries(SYMBOLS)) {
      const data = await fetchSymbolData(symbol);
      if (data !== null) {
        updateValue(elementId, data.price, previousValues[elementId], data.prevClose);
        previousValues[elementId] = data.price;
      }
    }

    // 債券データを取得
    const bondData = await fetchBondData();
    if (bondData) {
      for (const [key, data] of Object.entries(bondData)) {
        if (data && data.value !== null) {
          // 債券データは前日比を含めて表示を更新
          updateValue(key, data.value, previousValues[key], data.value - (data.change || 0));
          previousValues[key] = data.value;
        }
      }
    }
  } catch (error) {
    console.error("Error fetching market data:", error);
  }
}

// 初期データ取得
fetchMarketData();

// グローバル変数として記事の配列とカレントインデックスを保持
let newsArticles = [];
let nikkeiArticles = [];
let currentArticleIndex = 0;

// 日経ニュースを取得する関数
async function fetchNikkeiNews() {
  try {
    const response = await axios.get("https://www.nikkei.com/news/category/");
    const html = response.data;

    // 記事を抽出
    const articlePattern = /<article[^>]*class="sokuhoCard_s1l4ik39[^>]*>[\s\S]*?<\/article>/g;
    const timePattern = /<time[^>]*dateTime="([^"]*)"[^>]*>([^<]*)<\/time>/;
    const titlePattern = /<a[^>]*href="([^"]*)"[^>]*class="titleLink_[^"]*"[^>]*>([^<]*)<\/a>/;

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    nikkeiArticles = [];
    let match;

    while ((match = articlePattern.exec(html)) !== null) {
      const articleHtml = match[0];
      const timeMatch = articleHtml.match(timePattern);
      const titleMatch = articleHtml.match(titlePattern);

      if (timeMatch && titleMatch) {
        const articleDate = new Date(timeMatch[1]);
        // 1時間以内の記事のみを抽出
        if (articleDate > oneHourAgo) {
          nikkeiArticles.push({
            url: "https://www.nikkei.com" + titleMatch[1],
            // 全角文字を半角に変換
            headline: convertToHalfWidth(titleMatch[2]),
            datetime: timeMatch[1],
            timeAgo: `${new Date(timeMatch[1]).toLocaleString()} JST`,
            source: "日経新聞",
          });
        }
      }
    }

    // 既存のニュース配列と結合して時系列順にソート
    newsArticles = [...newsArticles.filter((article) => article.source === "Bloomberg"), ...nikkeiArticles].sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
  } catch (error) {
    console.error("Error fetching Nikkei news:", error);
  }
}

// 次のニュースを表示する関数
function showNextNews() {
  const newsContainer = document.getElementById("news-container");
  if (!newsContainer || newsArticles.length === 0) return;

  // インデックスを更新（配列の最後まで行ったら最初に戻る）
  currentArticleIndex = (currentArticleIndex + 1) % newsArticles.length;

  // 現在の記事を表示
  displayCurrentArticle();
}

// 現在の記事を表示する関数
function displayCurrentArticle() {
  const newsContainer = document.getElementById("news-container");
  if (!newsContainer || newsArticles.length === 0) return;

  const article = newsArticles[currentArticleIndex];

  // フェードアウト効果を適用
  newsContainer.style.opacity = 0;

  setTimeout(() => {
    // 記事を更新
    newsContainer.innerHTML = `
      <div class="news-item">
        <a href="#" class="news-headline" data-url="${article.url}">${article.headline}</a>
        <div class="news-meta">
          <span class="news-source">${article.source}</span>
          ${article.timeAgo ? `<span>${article.timeAgo}</span>` : ""}
        </div>
      </div>
    `;

    // Add click event listener to the news headline
    const newsHeadline = newsContainer.querySelector(".news-headline");
    if (newsHeadline) {
      newsHeadline.addEventListener("click", (e) => {
        e.preventDefault();
        const url = e.target.dataset.url;
        if (url) {
          shell.openExternal(url);
        }
      });
    }

    // フェードイン効果を適用
    newsContainer.style.opacity = 1;
  }, 300); // 300msのフェード効果
}

// Bloombergニュースを取得して表示する関数
async function fetchBloombergNews() {
  try {
    const response = await axios.get("https://www.bloomberg.co.jp/");
    const html = response.data;

    // 記事を抽出するための正規表現パターン
    const latestNewsPattern = /<section[^>]*id="stories_right_rail_latest_news"[^>]*>[\s\S]*?<\/section>/;
    const articlePattern = /<article[^>]*class="story-list-story[^>]*>[\s\S]*?<\/article>/g;
    const headlinePattern = /<a[^>]*class="story-list-story__info__headline-link"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/;
    const authorPattern = /<span[^>]*class="story-list-story__info__byline"[^>]*>([^<]*)<\/span>/;
    const timePattern = /<time[^>]*datetime="([^"]*)"[^>]*>([^<]*)<\/time>/;

    // Bloomberg記事を格納する配列をリセット
    const bloombergArticles = [];
    let match;

    // 最新ニュースセクションを抽出
    const latestNewsMatch = html.match(latestNewsPattern);
    if (!latestNewsMatch) {
      console.error("Latest news section not found");
      return;
    }

    // 記事を抽出
    while ((match = articlePattern.exec(latestNewsMatch[0])) !== null) {
      const articleHtml = match[0];

      // ヘッドライン、URL、著者、時間を抽出
      const headlineMatch = articleHtml.match(headlinePattern);
      const authorMatch = articleHtml.match(authorPattern);
      const timeMatch = articleHtml.match(timePattern);

      if (headlineMatch) {
        bloombergArticles.push({
          url: "https://www.bloomberg.co.jp" + headlineMatch[1],
          headline: convertToHalfWidth(headlineMatch[2]),
          author: authorMatch ? authorMatch[1] : "",
          datetime: timeMatch ? timeMatch[1] : "",
          timeAgo: timeMatch ? `${new Date(timeMatch[2]).toLocaleString()} JST` : "",
          source: "Bloomberg",
        });
      }
    }

    // 日経ニュースを取得
    await fetchNikkeiNews();

    // Bloomberg記事と日経ニュースを結合して時系列順にソート
    newsArticles = [...bloombergArticles, ...nikkeiArticles].sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

    // 最初の記事を表示
    if (newsArticles.length > 0) {
      displayCurrentArticle();
    }
  } catch (error) {
    console.error("Error fetching news:", error);
  }
}

// 初期ニュース取得
fetchBloombergNews();

// 5秒ごとにニュースを切り替え
setInterval(showNextNews, 5000);

// 5分ごとにニュースを更新
setInterval(fetchBloombergNews, 300000);

// 1分ごとにマーケットデータを更新
setInterval(fetchMarketData, 60000);

// ドラッグ可能な領域の設定
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  body.style.webkitAppRegion = "drag";
});

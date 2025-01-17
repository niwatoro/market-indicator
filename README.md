# Market Indicator

リアルタイムで金融市場の指標を表示するデスクトップアプリケーション。

## 機能

- 主要な株価指数のリアルタイム表示
  - S&P 500
  - NASDAQ
  - 日経平均
  - 上海総合
  - FTSE 100

- 主要な国債利回りの表示
  - 米国10年国債
  - 日本10年国債
  - ドイツ10年国債
  - 英国10年国債
  - 中国10年国債

- 為替レートのリアルタイム表示
  - USD/JPY
  - EUR/USD
  - GBP/USD
  - USD/CNY

- その他の指標
  - ビットコイン (BTC/USD)
  - 金
  - 原油

- 最新のマーケットニュース
  - Bloomberg
  - 日経新聞

## データソース

- Yahoo Finance API: 株価指数、為替レート、商品価格
- 三井住友信託銀行: 日本、ドイツ、中国の国債利回り
- 松井証券: 英国国債利回り
- Bloomberg.co.jp: ニュース
- 日経新聞: ニュース

## 更新間隔

- マーケットデータ: 1分ごと
- ニュース: 5分ごと
- ニュース表示切替: 5秒ごと

## 開発環境のセットアップ

1. リポジトリのクローン:

```bash
git clone https://github.com/niwatoro/resident-market-indicator.git
cd market-indicator
```

2. 依存パッケージのインストール:

```bash
npm install
```

3. アプリケーションの起動:

```bash
npm start
```

## macOSでの注意点

macOSでビルドしたアプリが隠しファイルとして扱われることがあります。その場合は、以下のコマンドを実行して隠しフラグを解除してください：

```bash
chflags nohidden /path/to/your_app.app
```

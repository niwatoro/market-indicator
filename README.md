# 市場指標ビュワー

## 概要

デスクトップで常駐してリアルタイムにマーケットの指標を表示するElectronアプリケーションです。
複数の金融市場の指標をシンプルなインターフェースで一目で確認できます。

## 対応指標

### 株式指標

- S&P500
- NASDAQ
- 日経平均
- 上海総合

### 為替

- ドル円
- ユーロドル

### 金利

- 米国10年債
- 日本国債10年
- ドイツ国債10年
- 中国国債10年

### 暗号資産

- ビットコイン

### ニュース

- Bloomberg
- 日経新聞

## 技術スタック

- Electron: クロスプラットフォームデスクトップアプリケーションフレームワーク
- Node.js: JavaScriptランタイム
- Axios: HTTPクライアント
- electron-store: データ永続化

## 必要要件

- Node.js 16.0.0以上
- npm 7.0.0以上
- macOS 10.13以上（現在はmacOSのみ対応）

## インストール

1. リポジトリをクローン

```bash
git clone [repository-url]
cd market-indicator
```

2. 依存パッケージをインストール

```bash
npm install
```

## 使い方

### 開発モード

開発モードでアプリケーションを起動します：

```bash
npm start
```

### ビルド

配布用のアプリケーションをビルドします：

```bash
npm run make
```

ビルドされたアプリケーションは `release-builds` ディレクトリに生成されます。

## 開発

### 開発環境のセットアップ

1. 依存パッケージのインストール

```bash
npm install
```

2. 開発サーバーの起動

```bash
npm start
```

アプリケーションが起動し、ソースコードの変更は自動的に反映されます。

## トラブルシューティング

### MacOSでビルドしたアプリが隠しファイルになる場合

MacOSでビルドしたアプリケーションが隠しファイルとして扱われる場合は、以下のコマンドで隠しフラグを解除できます：

```bash
chflags nohidden /path/to/your_app.app
```

### その他の一般的な問題

1. アプリケーションが起動しない場合
   - Node.jsのバージョンが要件を満たしているか確認
   - `npm install` を再実行
   - 開発ツールを開いてエラーログを確認

2. データが表示されない場合
   - インターネット接続を確認
   - 開発ツールのコンソールでエラーを確認

## ライセンス

ISC License

## 貢献

1. Forkする
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

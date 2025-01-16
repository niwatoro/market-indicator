# 市場指標ビュワー

## 概要

デスクトップで常駐してマーケット指標を表示します。対応している指標は以下の通りです。

- 株式指数
  - S&P500
  - NASDAQ
  - 日経平均
  - 上海総合
- 為替
  - ドル円
  - ユーロドル
- 金利
  - 米国10年債
  - 日本10年債
  - ドイツ10年債
  - 中国10年債
- 暗号資産
  - ビットコイン
- ニュース
  - Bloomberg
  - 日経新聞

### 使い方

1. ライブラリをインストールします。

```bash
npm install
```

2. アプリケーションを起動します。

```bash
npm start
```

3. アプリをビルドします。

```bash
npm run make
```

## 備考

MacOSでビルドしたアプリが隠しファイルにされることがある。その場合は以下のコマンドを実行して隠しフラグを外すこと。

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

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

3. `main.js`の以下の行をコメントアウトします。

```main.js
require("electron-reload")(__dirname, {
  electron: path.join(__dirname, "node_modules", ".bin", "electron"),
});
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

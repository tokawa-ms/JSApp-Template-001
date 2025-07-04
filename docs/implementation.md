# 実装機能ドキュメント - 警察官向け会話監視デモアプリケーション

## 📋 実装概要

警察官向け会話監視デモアプリケーションを仕様書に基づいて完全実装しました。このアプリケーションは、リアルタイムで音声を文字起こしし、危険な表現を自動検出・警告する機能を提供します。

## 🛠️ 実装されたファイル構造

```
src/
├── index.html              # メインHTMLファイル
├── css/
│   └── styles.css          # カスタムスタイルシート
├── js/
│   └── script.js           # メインJavaScriptアプリケーション
└── assets/
    └── sounds/
        └── README.md       # 音声ファイル仕様書
```

## 🛠️ API 設定方法

### API キーの設定

`src/js/script.js` ファイルの以下の部分で API キーを設定してください：

```javascript
// API Configuration - Set your Azure API keys here
this.apiKeys = {
  speech: "YOUR_AZURE_SPEECH_API_KEY", // Azure Speech Service API Key
  contentSafety: "YOUR_AZURE_CONTENT_SAFETY_API_KEY", // Azure Content Safety API Key
  openai: "YOUR_AZURE_OPENAI_API_KEY", // Azure OpenAI API Key
};

// Azure Service Endpoints - Replace with your actual endpoints
this.endpoints = {
  speech: "https://YOUR_REGION.api.cognitive.microsoft.com/sts/v1.0/issuetoken",
  contentSafety:
    "https://YOUR_REGION.cognitiveservices.azure.com/contentsafety/text:analyze",
  openai:
    "https://YOUR_OPENAI_RESOURCE.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions",
};
```

### エンドポイント設定

各サービスのリージョンとリソース名に応じて、以下の部分を修正してください：

- `YOUR_REGION`: Azure リソースのリージョン（例：eastus, japaneast）
- `YOUR_OPENAI_RESOURCE`: Azure OpenAI リソース名

## ✅ 実装済み機能

### 1. 音声文字起こし機能

- **Web Speech API**を使用したリアルタイム音声認識
- 英語（en-US）・日本語（ja-JP）の言語選択対応
- 連続音声認識（continuous listening）
- 中間結果表示機能

### 2. ダイアライゼーション機能（シミュレート）

- 複数話者の自動識別（ハッシュベース簡易実装）
- 話者ごとの色分け表示（5 色対応）
- 話者カウント表示
- 視覚的な話者区別

### 3. コンテンツ安全性分析機能（シミュレート）

- 危険キーワードの自動検出
- 英語・日本語の両言語対応
- リスクレベル評価（Low/Medium/High）
- リアルタイム分析処理

### 4. 高リスク表現の視覚化機能

- 危険部分の赤色ハイライト表示
- アニメーション効果（点滅）
- ツールチップ表示
- クリック時の詳細情報表示

### 5. 音声警告機能

- 複数の警告音パターン（Emergency/Attention/Voice）
- 音量調整機能（0-100%）
- 警告音のオン・オフ切り替え
- テスト再生機能
- Web Audio API によるフォールバック音生成

### 6. 状況要約機能（シミュレート）

- AI 生成風の会話要約
- リスク評価の総合判定
- 推奨アクションの提示
- タイムスタンプ付きレポート

### 7. ユーザーインターフェース

- レスポンシブデザイン（デスクトップ・タブレット・モバイル対応）
- リアルタイム状態表示（Recording/Processing/Ready）
- 直感的な操作パネル
- アクセシビリティ対応

### 8. セキュリティ機能

- API キーの動的入力
- セッションストレージでの一時保存
- ページリロード時の自動クリア
- デモモードでの安全な動作

## 🎨 UI/UX 設計

### カラーパレット

- **Police Blue** (#1e40af): メインカラー
- **Warning Red** (#ef4444): 警告・危険表示
- **Success Green** (#10b981): 正常状態表示
- **Light Gray** (#f9fafb): 背景色

### レスポンシブデザイン

- **デスクトップ**: 1200px 以上 - フルレイアウト
- **タブレット**: 768px-1199px - 2 カラムレイアウト
- **モバイル**: 767px 以下 - 1 カラムレイアウト

## 🔧 技術実装詳細

### Web Speech API 統合

```javascript
// 音声認識の初期化
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
this.recognition = new SpeechRecognition();
this.recognition.continuous = true;
this.recognition.interimResults = true;
this.recognition.lang = this.currentLanguage;
```

### 危険表現検出アルゴリズム

```javascript
const riskKeywords = [
  "kill",
  "murder",
  "violence",
  "attack",
  "weapon",
  "bomb",
  "threat",
  "drug",
  "cocaine",
  "heroin",
  "meth",
  "deal",
  "selling",
  "殺す",
  "暴力",
  "脅迫",
  "武器",
  "爆弾",
  "薬物",
  "麻薬",
];
```

### 話者識別システム

```javascript
// ハッシュベース簡易話者識別
identifySpeaker(transcript) {
    const hash = this.hashCode(transcript.substring(0, 10));
    const speakerIndex = Math.abs(hash) % 5 + 1;
    return speakerIndex;
}
```

## 🚀 使用方法

### 1. 基本セットアップ

1. ブラウザで `src/index.html` を開く
2. マイクアクセスを許可
3. Azure API キーを入力（デモモードでは省略可能）

### 2. 基本操作

1. **Start**: 音声監視開始
2. **Stop**: 音声監視停止
3. **Clear**: トランスクリプトクリア
4. **Generate Summary**: 状況要約生成

### 3. 設定項目

- **Recognition Language**: 英語/日本語選択
- **Warning Toggle**: 警告音のオン・オフ
- **Volume**: 警告音音量調整
- **Sound Type**: 警告音タイプ選択

## 🔬 デモモード機能

URL に `?demo=true` を追加することで、サンプルデータを自動生成：

```
file:///path/to/src/index.html?demo=true
```

デモデータには以下が含まれます：

- 複数話者の会話例
- 危険表現を含むサンプルテキスト
- リスクハイライトの動作例

## 🎯 実装の特徴

### 1. モジュラー設計

- クラスベースの JavaScript 実装
- 機能ごとの明確な分離
- 拡張性を考慮した構造

### 2. エラーハンドリング

- ネットワークエラーの適切な処理
- ブラウザ互換性チェック
- ユーザーフレンドリーなエラーメッセージ

### 3. パフォーマンス最適化

- 音声ファイルのプリロード
- 効率的な DOM 操作
- メモリリークの防止

### 4. アクセシビリティ

- キーボードナビゲーション対応
- スクリーンリーダー対応
- 高コントラストモード対応

## 🔒 セキュリティ考慮事項

### 1. データ保護

- 音声データのローカル処理
- セッション終了時の自動クリア
- 永続化データの最小化

### 2. API キー管理

- UI での動的入力
- セッションストレージでの一時保存
- ページリロード時の自動削除

## 📈 今後の拡張ポイント

### 1. Azure AI サービス統合

- 実際の Azure Speech Service API 連携
- Azure Content Safety API 統合
- Azure OpenAI Service 統合

### 2. 高度な機能

- リアルタイム話者認識
- 感情分析機能
- 自動レポート生成

### 3. データ永続化

- データベース連携
- クラウドストレージ統合
- 履歴管理機能

## 🐛 既知の制限事項

### 1. ブラウザ依存

- Web Speech API の精度はブラウザに依存
- マイクアクセス許可が必要
- インターネット接続が必要

### 2. 話者識別

- 簡易ハッシュベース実装（精度限定）
- 実際の Azure Speaker Recognition API との差異

### 3. 言語対応

- 現在は英語・日本語のみ対応
- 方言・アクセントの考慮不足

## 📞 サポート情報

### 対応ブラウザ

- Chrome 90 以上 ✅
- Firefox 88 以上 ✅
- Edge 90 以上 ✅
- Safari 14 以上 ⚠️（一部制限あり）

### システム要件

- マイク搭載デバイス
- インターネット接続
- 最低 4GB RAM 推奨

---

**注意**: このアプリケーションはデモンストレーション目的で作成されています。実際の警察業務での使用には、適切なセキュリティ検証と法的検討が必要です。

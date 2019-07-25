## 第二回

### first
- サジェスト機能とはどういうものか調べる
- JavaScriptでCookieを扱う方法を調べる
- CookieとlocalStrageの違いをしる

### サジェスト機能とは
- inputタグに紐ずいたdatalistを作成し、その中にoptionタグを格納するとそれっぽいものができると知る
- まずはCookieに保存せず入力したテキストがoptionタグに生成されるように実装
  - 検索したテキストをhystoryKeywords配列に格納
  - 永遠と格納されるのを防ぐ為、制限をかける
  - hystoryKeywordsに格納された数分optionタグを生成
- 検索ボタンをクリック→hystoryKeywordsに格納→optionタグを生成→画像を取得

## Cookie
- kye=valueの形式でdocument.cookieに値を渡すとcookieに保存できると知る
- Cookieには様々なopitonがあることを知る
  - 今回すぐに破棄したかったので、`max-age=60`(1分だけ保存)を使用
- hystoryKeywordsは配列で格納している為、値をcookie用に整形し、新たな配列を作成
- 配列に格納された数だけCookieに格納するループ関数を作成
- 画面を表示した際にCookieにあるデータをoptionタグに生成する関数を作成

## 工夫
- 直近の検索したワードが１番上に来るように設定

## 残追加機能
- 同一ワードが検索された場合Cookieに保存されないようにする
- APIから画像を取って来る際完了するまでLoadingを表示する

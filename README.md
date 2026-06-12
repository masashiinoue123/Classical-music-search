# ①課題名
クラシック音楽検索Webアプリ

## ②課題内容（どんな作品か）
iTunes Search APIを利用して、クラシック音楽を検索できるWebアプリを制作しました。  
検索キーワードを入力し、作曲者・演奏者・曲名のいずれかを指定して検索できます。  
検索結果では、ジャケット画像、曲名、アーティスト名、アルバム名、再生時間を表示し、試聴ボタンから30秒プレビュー再生ができるようにしました。さらに、iTunesの作品ページへ移動できるリンクも設置しています。

## ③アプリのデプロイURL
https://masashiinoue123.github.io/Classical-music-search/

## ④アプリのログイン用IDまたはPassword（ある場合）
なし

## ⑤工夫した点・こだわった点
- Windows環境でも扱いやすいように、XcodeではなくHTML / CSS / JavaScriptでWebアプリとして実装した点
- 検索対象を「すべて / 作曲者 / 演奏者 / 曲名」で切り替えられるようにした点
- 国別ストアを切り替えられるようにして、検索結果の違いも楽しめるようにした点
- APIの検索結果からクラシック音楽のみを抽出して、目的に合った結果が見やすくなるようにした点
- 試聴ボタンとiTunesリンクを付けて、検索だけで終わらず実際に音楽へ触れられる導線を作った点
- 背景やカードデザインを工夫し、シンプルながら見やすいUIにした点

## ⑥難しかった点・次回トライしたいこと（又は機能）
- iTunes Search APIをブラウザから扱う際に、通常のfetchではなくJSONPで対応する必要があり、その仕組みの理解が難しかったです
- APIの検索結果にクラシック以外の楽曲も混ざるため、クラシックだけを抽出する条件の調整が難しかったです
- 次回は以下の機能を追加したいです
  - お気に入り保存機能
  - 検索履歴の保存
  - 並び替え機能
  - レスポンシブ対応の強化
  - デプロイしてスマホでも使いやすい形にする

## ⑦フリー項目（感想、シェアしたいこと等なんでも）
- [感想]
  APIを使ったアプリ開発は初めてだったので難しかったですが、検索したデータが画面に表示されたときは達成感がありました。  
  また、Windows環境でも工夫すればAPIを使ったWebアプリを作れることが分かり、学びになりました。  
  今後はデータ保存やUI改善にも挑戦して、より使いやすいアプリにしていきたいです。

- [参考記事]
  - Apple iTunes Search API  
    https://performance-partners.apple.com/search-api
  - Apple iTunes Search API Archive Documentation  
    https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/Searching.html
  - MDN Web Docs Fetch API  
    https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

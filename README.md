# eml-wrapp-sv
目標→emlauncherで列挙されるアプリのうち、プロジェクト上必要な「最新ビルドのアプリ」だけリストアップしたい。

方法→任意のemlauncher APIにアクセスし、アクセス都度短時間有効なインストールトークンを発行しリストアップする。


## install
要node.js。インストール後currentで
``
npm install
``

``
node app.js -p [ポート番号]
``
等で起動。

``
config/default.yaml
``
でemlauncher関連の各種設定をおこなう。

## emlauncher側対応
プレフィクス

``
[PUB]
``

のあるタグのついたアプリがリストアップ対象となる。

``
ex)
[PUB]HOGEAPP_DEV_IOS
``

同名が重複した場合、最新のものが有効になる。すなわち、CI(jenkinsとか)で配信対象にしたいビルドジョブに上記ルールに基づく設定をすれば、同名の最新のアプリがリストアップ対象となる。

## アクセス例
``
http://localhost:8080/site
``

``
http://localhost:8080/site?pub=[設定したタグ名]
``

## 今後対応

###パスワード設定
DL時任意のパスワードを入力しないとDLできないようにする。

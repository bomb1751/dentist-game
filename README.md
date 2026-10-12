# 小小遊樂園

給幼兒使用的手機版小遊戲入口。純 HTML、CSS、JavaScript，沒有登入、後端或資料儲存。

## 線上遊玩

首頁：https://bomb1751.github.io/dentist-game/

小小牙醫診所：https://bomb1751.github.io/dentist-game/games/dentist/

## 專案結構與新增遊戲

- `index.html`、`home.css`：入口首頁與排版。
- `home.js`：遊戲清單，新增遊戲時在 `games` 陣列加入名稱、介紹、連結和插圖。
- `games/dentist/index.html`：牙醫遊戲頁面。
- `styles.css`、`game.js`：牙醫遊戲外觀與互動。
- `images/`：首頁的遊戲插圖。

下一款遊戲可放在 `games/<遊戲名稱>/index.html`，並提供回到 `../../index.html` 的連結。完成後加入首頁清單即可。

## 牙醫遊戲操作

每位病人有兩顆需要治療的牙齒，問題獨立隨機抽選，可以重複。每顆牙齒保留自己的治療進度，兩顆全部治好才完成回合。

- 刷牙：拖曳牙刷來回刷遍整顆黃牙。
- 夾菜渣：夾住菜渣，拖曳到垃圾桶後放開；放錯位置會回到牙齒上。
- 補牙：清除全部黑色蛀牙，再用填補器把藍色洞洞補白。
- 支援滑鼠與手機觸控。

## 本機開啟

在此資料夾執行：

```bash
python3 -m http.server 8080
```

前往 `http://localhost:8080`。也可以直接開啟 `index.html`；直接用檔案方式開啟時，遊戲連結需開啟 `games/dentist/index.html`。

## GitHub Pages

網站使用 `main` 分支根目錄部署。提交更新到 `main` 後，GitHub Pages 會自動重新發布。所有連結皆使用相對路徑，支援 repository 子路徑。

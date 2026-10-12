# 小小遊樂園

給幼兒使用的手機版小遊戲入口。純 HTML、CSS、JavaScript，沒有登入、後端或資料儲存。

## 線上遊玩

首頁：https://bomb1751.github.io/dentist-game/

小小牙醫診所：https://bomb1751.github.io/dentist-game/games/dentist/

小小造型師：https://bomb1751.github.io/dentist-game/games/stylist/

## 專案結構與新增遊戲

- `index.html`、`home.css`：入口首頁與排版。
- `home.js`：遊戲清單，新增遊戲時在 `games` 陣列加入名稱、介紹、連結和插圖。
- `games/dentist/index.html`：牙醫遊戲頁面。
- `styles.css`、`game.js`：牙醫遊戲外觀與互動。
- `images/`：首頁的遊戲插圖。

下一款遊戲可放在 `games/<遊戲名稱>/index.html`，並提供回到 `../../index.html` 的連結。完成後加入首頁清單即可。

## 造型遊戲操作

- 八個主分類：臉形、頭髮、眉毛、眼睛、鼻子、嘴巴、耳朵及穿著。穿著分為衣服、褲子與套裝；吊帶褲、吊帶短褲與運動套裝位於套裝分頁。
- 各分類提供多種樣式及預設色票，也可用自選顏色。套裝顏色同時套用到整套服裝，分開搭配時衣服與褲子可獨立調色。
- 手機更換五官時會放大看臉，挑衣服時看全身，也可手動切換預覽。
- 可隨機搭配、重新開始，或下載 720 × 1020 的 PNG 圖片。
- 造型使用 localStorage 保留在同一個瀏覽器；瀏覽器不允許儲存時仍可遊玩。
- 所有角色與服裝都由 SVG 元件組成，無外部圖片或帳號需求。
- 程式與排版位於 `games/stylist/`，首頁插圖位於 `images/stylist.svg`。

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

// Add a card here when a new game is ready to play.
const games = [
  {
    title: '小小牙醫診所',
    category: '生活練習 · 動手照顧',
    description: '刷刷黃牙、夾走菜渣，再把蛀牙補好。今天換你當小醫生！',
    href: 'games/dentist/',
    image: 'images/dentist.svg',
    action: '開始看診',
    mode: '拖曳遊玩 · 手機也能玩',
  },
  {title:'小小看診室',category:'溫柔照顧 · 扮演醫生',description:'量耳溫、看耳朵和喉嚨、聽診，再陪小病人完成照顧。',href:'games/doctor/',image:'images/doctor.svg?v=19',action:'開始看診',mode:'五種情境 · 拖曳操作'},
  {
    title:'小小廚師', category:'動手製作 · 美味創作',
    description:'做披薩、疊蛋糕夾心，再自由裝飾。手機橫放也能輕鬆拖曳料理！',
    href:'games/chef/', image:'images/chef.svg?v=11', action:'開始料理', mode:'拖曳食材 · 支援橫放',
  },
  {
    title:'寵物洗澡店', category:'溫柔照顧 · 泡泡時光',
    description:'搓掉髒污、沖掉泡泡、吹乾毛毛，再自由搭配頭飾、眼鏡和領巾。',
    href:'games/pet-bath/', image:'images/pet-bath.svg?v=18', action:'開始洗澡', mode:'動手清洗 · 九位小客人',
  },
  {
    title: '小小造型師',
    category: '自由創作 · 色彩搭配',
    description: '換臉形、變髮型，搭配五官和衣服。創作一個屬於你的角色！',
    href: 'games/stylist/',
    image: 'images/stylist.svg',
    action: '開始搭配',
    mode: '自由換裝 · 可以存成圖片',
  },
  {title:'三車道小車手',category:'反應挑戰 · 左右閃躲',description:'左右換道避開車輛，挑戰能撐幾秒！最高紀錄保留在本次分頁。',href:'games/traffic/',image:'images/traffic.svg',action:'開始出發',mode:'鍵盤 / 觸控 · 挑戰紀錄'}
];
const list = document.querySelector('#gamesList');
for (const game of games) {
  const card = document.createElement('a'); card.className = 'game-card'; card.href = game.href;
  const picture = document.createElement('div'); picture.className = 'card-picture';
  const image = document.createElement('img'); image.src = game.image; image.alt = ''; image.width = 540; image.height = 300;
  const badge = document.createElement('span'); badge.className = 'play-badge'; badge.textContent = '可以玩了';
  picture.append(image, badge);
  const content = document.createElement('div'); content.className = 'card-content';
  const category = document.createElement('span'); category.className = 'card-category'; category.textContent = game.category;
  const title = document.createElement('h3'); title.textContent = game.title;
  const description = document.createElement('p'); description.textContent = game.description;
  const bottom = document.createElement('div'); bottom.className = 'card-bottom';
  const mode = document.createElement('span'); mode.className = 'card-mode'; mode.textContent = game.mode;
  const action = document.createElement('span'); action.className = 'card-action'; action.textContent = game.action;
  const arrow = document.createElement('span'); arrow.textContent = '→'; arrow.setAttribute('aria-hidden', 'true'); action.append(arrow);
  bottom.append(mode, action); content.append(category, title, description, bottom); card.append(picture, content); list.append(card);
}

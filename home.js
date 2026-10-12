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
  },  {
    title: '小小造型師',
    category: '自由創作 · 色彩搭配',
    description: '換臉形、變髮型，搭配五官和衣服。創作一個屬於你的角色！',
    href: 'games/stylist/',
    image: 'images/stylist.svg',
    action: '開始搭配',
    mode: '自由換裝 · 可以存成圖片',
  },
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

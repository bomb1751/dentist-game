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
  },  {
    title:'小小廚師', category:'動手製作 · 美味創作',
    description:'做披薩、疊漢堡、裝飾蛋糕。自由搭配，也能照客人的小訂單做料理！',
    href:'games/chef/', image:'images/chef.svg', action:'開始料理', mode:'拖曳食材 · 三種料理',
  },
  {
    title:'寵物洗澡店', category:'溫柔照顧 · 泡泡時光',
    description:'搓掉髒污、沖掉泡泡、吹乾毛毛，再幫小動物戴上漂亮蝴蝶結。',
    href:'games/pet-bath/', image:'images/pet-bath.svg', action:'開始洗澡', mode:'動手清洗 · 三位小客人',
  },
  {
    title:'我的小房間', category:'空間佈置 · 自由創作',
    description:'搬動家具、換個樣子，挑牆壁和地板的配色。佈置你的小天地！',
    href:'games/room/', image:'images/room.svg', action:'開始佈置', mode:'自由擺放 · 可以存成圖片',
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

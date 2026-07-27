(() => {
  const app = document.getElementById('app');
  const screens = [...document.querySelectorAll('.screen')];
  const navButtons = [...document.querySelectorAll('[data-nav]')];
  let previousScreen = 'home';

  const stockData = {
    NVDA: { company: 'NVIDIA Corporation', price: '181.42', change: '+4.10 (+2.31%)', overview: 'NVIDIA is being monitored because its trend, sector strength, and relative volume align with your preferred swing-trading profile.' },
    QQQ: { company: 'Invesco QQQ Trust', price: '456.21', change: '+4.02 (+0.89%)', overview: 'QQQ is showing broad technology strength and is useful as both a trade setup and confirmation for individual technology positions.' },
    AAPL: { company: 'Apple Inc.', price: '214.62', change: '+2.14 (+1.01%)', overview: 'Apple is showing continuation strength, but Atlas would still require volume confirmation before treating the move as actionable.' }
  };

  function showScreen(name, updateNav = true) {
    const current = screens.find(screen => screen.classList.contains('active'));
    if (current && current.dataset.screen !== 'stock') previousScreen = current.dataset.screen;

    screens.forEach(screen => screen.classList.toggle('active', screen.dataset.screen === name));
    navButtons.forEach(button => {
      button.classList.toggle('active', updateNav && button.dataset.nav === name);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navButtons.forEach(button => {
    button.addEventListener('click', () => showScreen(button.dataset.nav));
  });

  document.querySelectorAll('[data-tab-group]').forEach(group => {
    const buttons = [...group.querySelectorAll('[data-tab]')];
    const screen = group.closest('.screen');

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        buttons.forEach(item => item.classList.toggle('active', item === button));
        screen.querySelectorAll('.tab-panel').forEach(panel => {
          panel.classList.toggle('active', panel.dataset.panel === button.dataset.tab);
        });
      });
    });
  });

  document.querySelectorAll('[data-stock]').forEach(button => {
    button.addEventListener('click', () => {
      const ticker = button.dataset.stock;
      const data = stockData[ticker] || stockData.NVDA;
      document.getElementById('stock-title').textContent = ticker;
      document.getElementById('stock-company').textContent = data.company;
      document.getElementById('stock-price').textContent = data.price;
      document.getElementById('stock-change').textContent = data.change;
      document.getElementById('stock-overview').textContent = data.overview;
      showScreen('stock', false);
    });
  });

  document.querySelector('[data-action="back"]').addEventListener('click', () => showScreen(previousScreen));
  document.querySelector('[data-action="ask-stock"]').addEventListener('click', () => showScreen('atlas'));
  document.querySelector('[data-action="view-focus"]').addEventListener('click', () => showScreen('markets'));

  const contextMessages = {
    AAPL: 'AAPL is showing steady relative strength, but it is approaching short-term resistance.',
    MSFT: 'MSFT remains above VWAP with orderly volume. Confirmation is still preferred.',
    NVDA: 'NVDA has the strongest momentum in this sample, though price is somewhat extended.',
    TSLA: 'TSLA is lagging the market and requires stronger evidence before a bullish setup.',
    AMD: 'AMD is benefiting from semiconductor strength but has less clean structure than NVDA.',
    GOOGL: 'GOOGL is constructive, but volume confirmation is limited.',
    META: 'META is participating in technology strength without leading it.',
    XOM: 'XOM is weak relative to the broader market and energy sector.'
  };

  document.querySelectorAll('[data-symbol-context]').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('heatmap-context').textContent = contextMessages[button.dataset.symbolContext];
    });
  });

  const chatWindow = document.getElementById('chat-window');
  const atlasInput = document.getElementById('atlas-input');
  const sendButton = document.getElementById('send-atlas');

  function atlasReply(text) {
    const lower = text.toLowerCase();
    if (lower.includes('level')) return 'For NVDA, the important levels are:\n\n• Confirmation: $183.10\n• Invalidation: $178.20\n• First objective: $188.60\n• Secondary objective: $194.25\n\nThe levels are useful only if your risk remains appropriate.';
    if (lower.includes('news')) return 'The current news backdrop supports semiconductor sentiment, but it does not replace confirmation. Atlas treats news as context—not as a reason to chase price.';
    if (lower.includes('chart')) return 'The chart is constructive: price remains above VWAP and the broader trend is intact. Momentum has slowed near resistance, so waiting protects entry quality.';
    if (lower.includes('buy') || lower.includes('entry')) return 'I would not treat this as an automatic entry. Confirmation above $183.10 would provide a cleaner decision point. No trade is also a valid outcome.';
    return 'I would frame the decision by identifying the thesis, the invalidation level, and whether the possible reward justifies the risk. Atlas evaluates; you decide.';
  }

  function addChatMessage(text, role) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.textContent = text;
    chatWindow.appendChild(div);
    div.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  function sendMessage(text) {
    const clean = text.trim();
    if (!clean) return;
    addChatMessage(clean, 'user');
    atlasInput.value = '';
    window.setTimeout(() => addChatMessage(atlasReply(clean), 'atlas'), 250);
  }

  sendButton.addEventListener('click', () => sendMessage(atlasInput.value));
  atlasInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') sendMessage(atlasInput.value);
  });
  document.querySelectorAll('[data-prompt]').forEach(button => {
    button.addEventListener('click', () => sendMessage(button.dataset.prompt));
  });

  document.getElementById('full-reflection').addEventListener('click', event => {
    const details = document.getElementById('reflection-details');
    details.classList.toggle('hidden');
    event.currentTarget.textContent = details.classList.contains('hidden') ? 'View Full Report' : 'Hide Full Report';
  });
})();


// Build 0.3 opening experience
const welcomeScreen = document.getElementById('welcome-screen');
const enterTerminal = document.getElementById('enter-terminal');

if (enterTerminal && welcomeScreen) {
  enterTerminal.addEventListener('click', () => {
    welcomeScreen.classList.add('closed');
  });
}

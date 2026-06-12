const keywordInput = document.getElementById('keywordInput');
const targetSelect = document.getElementById('targetSelect');
const countrySelect = document.getElementById('countrySelect');
const limitSelect = document.getElementById('limitSelect');
const searchButton = document.getElementById('searchButton');
const statusMessage = document.getElementById('statusMessage');
const resultsContainer = document.getElementById('resultsContainer');
const resultsMeta = document.getElementById('resultsMeta');
const previewPlayer = document.getElementById('previewPlayer');

const targetAttributeMap = {
  all: null,
  composer: 'composerTerm',
  artist: 'artistTerm',
  song: 'songTerm'
};

const countryNameMap = {
  JP: '日本',
  US: 'アメリカ',
  DE: 'ドイツ',
  GB: 'イギリス',
  FR: 'フランス',
  IT: 'イタリア'
};

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.style.color = isError ? '#fecdd3' : '#a7b4c9';
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDuration(trackTimeMillis) {
  if (!trackTimeMillis) return '--:--';
  const totalSeconds = Math.floor(trackTimeMillis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function isClassicalTrack(item) {
  const genre = (item.primaryGenreName || '').toLowerCase();
  return genre.includes('classical') || genre.includes('クラシック');
}

function createSearchUrl(keyword, target, country, limit, callbackName) {
  const params = new URLSearchParams({
    term: keyword,
    media: 'music',
    entity: 'song',
    country,
    lang: 'ja_jp',
    version: '2',
    limit: String(limit),
    callback: callbackName
  });

  const attribute = targetAttributeMap[target];
  if (attribute) {
    params.set('attribute', attribute);
  }

  return `https://itunes.apple.com/search?${params.toString()}`;
}

function fetchJsonp(urlTemplate) {
  return new Promise((resolve, reject) => {
    const callbackName = `itunesJsonpCallback_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const script = document.createElement('script');
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('検索がタイムアウトしました。'));
    }, 15000);

    function cleanup() {
      clearTimeout(timeout);
      if (script.parentNode) script.parentNode.removeChild(script);
      delete window[callbackName];
    }

    window[callbackName] = (data) => {
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error('APIの読み込みに失敗しました。'));
    };

    script.src = urlTemplate.replace('__CALLBACK__', callbackName);
    document.body.appendChild(script);
  });
}

function renderResults(items) {
  if (!items.length) {
    resultsContainer.innerHTML = `
      <div class="empty">
        <h3>該当するクラシック楽曲が見つかりませんでした</h3>
        <p>別の作曲者名や曲名で試してください。</p>
      </div>
    `;
    return;
  }

  resultsContainer.innerHTML = items.map((item) => {
    const artwork = item.artworkUrl100 || item.artworkUrl60 || 'https://placehold.co/300x300/0f172a/e5eefb?text=No+Art';
    const trackName = escapeHtml(item.trackName || '曲名不明');
    const artistName = escapeHtml(item.artistName || 'アーティスト不明');
    const collectionName = escapeHtml(item.collectionName || 'アルバム不明');
    const genre = escapeHtml(item.primaryGenreName || 'ジャンル不明');
    const duration = formatDuration(item.trackTimeMillis);
    const previewUrl = item.previewUrl || '';
    const trackViewUrl = item.trackViewUrl || '#';

    return `
      <article class="card">
        <div class="card-top">
          <img class="cover" src="${escapeHtml(artwork)}" alt="${trackName}" loading="lazy" referrerpolicy="no-referrer" />
          <div>
            <h3>${trackName}</h3>
            <p class="meta-line"><strong>アーティスト:</strong> ${artistName}</p>
            <p class="meta-line"><strong>アルバム:</strong> ${collectionName}</p>
            <div class="tags">
              <span class="tag">${genre}</span>
              <span class="tag">${duration}</span>
              <span class="tag">${escapeHtml(item.country || 'Store')}</span>
            </div>
          </div>
        </div>
        <div class="card-actions">
          ${previewUrl ? `<button class="secondary-btn" data-preview="${escapeHtml(previewUrl)}" data-title="${trackName}">試聴</button>` : ''}
          <a class="link-btn" href="${escapeHtml(trackViewUrl)}" target="_blank" rel="noopener noreferrer">iTunesで開く</a>
        </div>
      </article>
    `;
  }).join('');
}

async function searchMusic() {
  const keyword = keywordInput.value.trim();
  const target = targetSelect.value;
  const country = countrySelect.value;
  const limit = Number(limitSelect.value);

  if (!keyword) {
    setStatus('検索キーワードを入力してください。', true);
    resultsContainer.innerHTML = '';
    resultsMeta.classList.add('hidden');
    return;
  }

  searchButton.disabled = true;
  searchButton.textContent = '検索中...';
  resultsContainer.innerHTML = '';
  resultsMeta.classList.add('hidden');
  setStatus('Apple の iTunes Search API に問い合わせています...');

  try {
    const tempUrl = createSearchUrl(keyword, target, country, limit, '__CALLBACK__');
    const data = await fetchJsonp(tempUrl);
    const allItems = Array.isArray(data.results) ? data.results : [];
    const classicalItems = allItems.filter(isClassicalTrack);

    setStatus(`検索完了: ${classicalItems.length} 件のクラシック楽曲を表示中`);
    resultsMeta.classList.remove('hidden');
    resultsMeta.innerHTML = `
      <strong>${escapeHtml(keyword)}</strong> / ${escapeHtml(targetSelect.options[targetSelect.selectedIndex].text)} / ${escapeHtml(countryNameMap[country] || country)}
      <br />API取得件数 ${allItems.length} 件のうち、クラシック判定 ${classicalItems.length} 件を表示しています。
    `;

    renderResults(classicalItems);
  } catch (error) {
    console.error(error);
    setStatus(`エラー: ${error.message}`, true);
    resultsContainer.innerHTML = `
      <div class="error">
        <h3>検索に失敗しました</h3>
        <p>${escapeHtml(error.message)}</p>
      </div>
    `;
  } finally {
    searchButton.disabled = false;
    searchButton.textContent = '検索';
  }
}

searchButton.addEventListener('click', searchMusic);
keywordInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchMusic();
  }
});

document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    keywordInput.value = chip.dataset.keyword || '';
    searchMusic();
  });
});

resultsContainer.addEventListener('click', (event) => {
  const button = event.target.closest('[data-preview]');
  if (!button) return;

  const previewUrl = button.getAttribute('data-preview');
  const title = button.getAttribute('data-title') || '試聴';
  if (!previewUrl) return;

  previewPlayer.src = previewUrl;
  previewPlayer.play().catch((error) => {
    console.error(error);
    setStatus('試聴の再生に失敗しました。ブラウザの自動再生制限を確認してください。', true);
  });
  setStatus(`試聴中: ${title}`);
});

searchMusic();

// API origin: same-origin reverse proxy by default; override with ?api=https://your-mempool-host
const params = new URLSearchParams(location.search);
const API = (params.get('api') || 'https://mempool.space/api').replace(/\/$/, '');
const $ = id => document.getElementById(id);
const fmt = n => Number(n).toLocaleString('it-IT');
async function api(path) {
  const response = await fetch(`${API}${path}`, {headers:{'Accept':'application/json'},cache:'no-store'});
  if (!response.ok) throw new Error(`API ${response.status} su ${path}`);
  return response.json();
}
function setText(id, value) { $(id).textContent = value; }
async function load() {
  $('refresh').classList.add('loading');
  try {
    const [tip, fees, mempool, blocks, hashrate] = await Promise.all([
      api('/blocks/tip/height'), api('/v1/fees/recommended'), api('/mempool'), api('/blocks'), api('/v1/mining/hashrate/1m')
    ]);
    setText('height', fmt(tip));
    setText('tx-count', fmt(mempool.count));
    setText('mempool-size', fmt(mempool.count));
    setText('fee', fmt(fees.fastestFee));
    setText('fee-fast', fmt(fees.fastestFee));
    setText('fee-mid', fmt(fees.halfHourFee));
    setText('fee-slow', fmt(fees.hourFee));
    const hs = hashrate.currentHashrate || hashrate.hashrates?.at(-1)?.avgHashrate;
    setText('hashrate', hs ? `${(hs/1e18).toFixed(1)} EH/s` : 'N/D');
    const age = blocks?.[0]?.timestamp ? Math.max(0, Math.floor((Date.now()/1000-blocks[0].timestamp)/60)) : null;
    setText('block-age', age === null ? 'Blocco recente' : age < 1 ? 'Appena minato' : `${age} min fa`);
    $('block-track').innerHTML = (blocks || []).slice(0,5).map(b => `<div class="block-card"><b>#${fmt(b.height)}</b><small>${b.tx_count ? fmt(b.tx_count)+' transazioni' : 'Blocco confermato'}</small><small class="block-fee">${b.size ? (b.size/1e6).toFixed(2)+' MB' : 'Bitcoin mainnet'}</small><small>${b.timestamp ? new Date(b.timestamp*1000).toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'}) : ''}</small></div>`).join('');
    setText('connection-label', 'API raggiungibile');
    setText('flow-status', 'Aggiornamento automatico');
    setText('updated', `Aggiornato: ${new Date().toLocaleTimeString('it-IT')}`);
    $('notice').className = 'notice';
    setText('notice', `Dati aggiornati dalla sorgente API: ${API}`);
  } catch (err) {
    $('notice').className = 'notice error';
    setText('notice', `Impossibile leggere l'API (${err.message}). Controlla la connessione o configura ?api=URL_API.`);
    setText('connection-label', 'API non raggiungibile');
    setText('flow-status', 'Connessione non disponibile');
  } finally { $('refresh').classList.remove('loading'); }
}
function search() {
  const q = $('search').value.trim();
  if (!q) return;
  // Route to the configured explorer's search page; API origin is not an explorer URL.
  const host = API.replace(/\/api$/, '');
  window.open(`${host}/search?query=${encodeURIComponent(q)}`, '_blank', 'noopener,noreferrer');
}
$('refresh').addEventListener('click', load);
$('search-btn').addEventListener('click', search);
$('search').addEventListener('keydown', e => { if (e.key === 'Enter') search(); });
load(); setInterval(load, 60000);

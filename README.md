# Mempool Neon — UmbrelOS

Interfaccia web community, scura e futuristica, per consultare i principali indicatori Bitcoin. È un **frontend separato**: non sostituisce il backend/indexer ufficiale di Mempool e non contiene un nodo Bitcoin.

## Funzioni del prototipo
- Ultima altezza, transazioni in mempool, stima hashrate e fee.
- Blocchi recenti e scorciatoie per l'esplorazione.
- Aggiornamento automatico ogni 60 secondi.
- Layout responsive per desktop, tablet e smartphone.
- API configurabile tramite parametro `?api=`.

## Avvio rapido su UmbrelOS / Portainer
1. Carica questa cartella su un tuo repository GitHub.
2. Su UmbrelOS apri Portainer e crea uno Stack usando il `docker-compose.yml` del repository, oppure clona il repository sul server e lancia `docker compose up -d --build`.
3. Apri `http://IP_DEL_SERVER:8097`.

Il Compose è pensato per testare la UI tramite Portainer/Docker. Per integrarla come app nativa nell'App Store di Umbrel servono anche il manifest e il proxy richiesti dal framework della versione di UmbrelOS in uso.

## Origine dati
Per impostazione predefinita, il frontend legge `https://mempool.space/api`. Per usare un'istanza Mempool tua, apri:

`http://IP_DEL_SERVER:8097/?api=http://HOST_API:PORT/api`

L'URL deve puntare all'API compatibile con Mempool e deve essere raggiungibile dal browser dell'utente. Se il browser blocca richieste cross-origin (CORS), configura un reverse proxy same-origin e usa `/api` come percorso relativo. Non esporre pubblicamente l'API o il server senza autenticazione/protezione adeguata.

> Nota: il parametro API serve per leggere dati; per la ricerca, il prototipo apre la pagina di ricerca dell'host corrispondente. Verifica che l'host configurato esponga anche le pagine web dell'explorer.

## File da modificare
- `index.html`: struttura e testi dell'interfaccia.
- `styles.css`: tutta la grafica — colori, layout, animazioni, card e responsive.
- `app.js`: caricamento API, aggiornamento dati e ricerca.
- `Dockerfile`, `nginx.conf`, `docker-compose.yml`: packaging e avvio su UmbrelOS.

## Sviluppo locale
Apri `index.html` nel browser. Per testare le chiamate API senza limitazioni `file://`, avvia un web server statico, ad esempio `python3 -m http.server 8097`, e visita `http://localhost:8097`.

## Licenza e attribuzione
Questo repository è un concept indipendente di interfaccia. Mempool è un progetto separato: https://github.com/mempool/mempool. Non usare logo o marchi in modo da suggerire approvazione ufficiale. Se incorpori o modifichi codice dal repository Mempool, rispetta la sua licenza AGPL-3.0 e conserva gli avvisi richiesti. Questo prototipo non copia il codice sorgente ufficiale.

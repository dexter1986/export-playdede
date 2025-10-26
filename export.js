javascript: (function () {
  /*********************************************************************************************
    V1
    Abrir la web de Playdede
    
    Introducir como url -> javascript:import('https://cdn.jsdelivr.net/gh/dexter1986/export-playdede@latest/export.js');

    Cuidado por que es posible que se borre el principio javascript: debes introducirlo a mano javascript: y luego pegar

    import('https://cdn.jsdelivr.net/gh/dexter1986/export-playdede@latest/export.js');

    Aparecerá un nuevo punto de menú llamado "Descargar CSV" pulsa en él para ver el menú de descargas

  ***********************************************************************************************/


  var delimiter_csv = ';'; /* delimitador para el csv: '\t' => tabulacion, ',' => comilla, ';' => punto y coma.*/

  function getCapitulos() {
    // Mostrar diálogo de selección
    const selectionDialog = `
        <div id="capitulosSelection" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: Arial, sans-serif;
        ">
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 0 30px rgba(0,0,0,0.4);
                min-width: 400px;
                max-width: 90%;
                max-height: 90%;
                overflow-y: auto;
            ">
                <h3 style="margin-top: 0; color: #333;">📺 Seleccionar series/animes para exportar capítulos</h3>
                
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #555; margin-bottom: 10px;">🎬 Series</h4>
                    <label style="display: block; margin: 8px 0;">
                        <input type="checkbox" id="serie_sig" checked> Series que sigo
                    </label>
                    <label style="display: block; margin: 8px 0;">
                        <input type="checkbox" id="serie_pend"> Series pendientes
                    </label>
                    <label style="display: block; margin: 8px 0;">
                        <input type="checkbox" id="serie_fav"> Series favoritas
                    </label>
                    <label style="display: block; margin: 8px 0;">
                        <input type="checkbox" id="serie_vis"> Series vistas
                    </label>
                </div>
                
                <div style="margin-bottom: 25px;">
                    <h4 style="color: #555; margin-bottom: 10px;">🎌 Animes</h4>
                    <label style="display: block; margin: 8px 0;">
                        <input type="checkbox" id="anime_sig" checked> Animes que sigo
                    </label>
                    <label style="display: block; margin: 8px 0;">
                        <input type="checkbox" id="anime_pend"> Animes pendientes
                    </label>
                    <label style="display: block; margin: 8px 0;">
                        <input type="checkbox" id="anime_fav"> Animes favoritos
                    </label>
                    <label style="display: block; margin: 8px 0;">
                        <input type="checkbox" id="anime_vis"> Animes vistos
                    </label>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button id="cancelCapitulos" style="
                        padding: 10px 20px;
                        background: #6c757d;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    ">Cancelar</button>
                    <button id="confirmCapitulos" style="
                        padding: 10px 20px;
                        background: #28a745;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    ">Exportar Capítulos</button>
                </div>
            </div>
        </div>
    `;

    // Insertar el diálogo en el DOM
    const dialogContainer = document.createElement('div');
    dialogContainer.innerHTML = selectionDialog;
    document.body.appendChild(dialogContainer);

    // Event listeners para los botones
    document.getElementById('cancelCapitulos').addEventListener('click', function () {
      document.body.removeChild(dialogContainer);
    });

    document.getElementById('confirmCapitulos').addEventListener('click', function () {
      // Obtener selecciones
      const selections = {
        serie_sig: document.getElementById('serie_sig').checked,
        serie_pend: document.getElementById('serie_pend').checked,
        serie_fav: document.getElementById('serie_fav').checked,
        serie_vis: document.getElementById('serie_vis').checked,
        anime_sig: document.getElementById('anime_sig').checked,
        anime_pend: document.getElementById('anime_pend').checked,
        anime_fav: document.getElementById('anime_fav').checked,
        anime_vis: document.getElementById('anime_vis').checked
      };

      // Verificar que al menos una opción esté seleccionada
      const hasSelection = Object.values(selections).some(selected => selected);

      if (!hasSelection) {
        alert('❌ Por favor selecciona al menos una opción');
        return;
      }

      // Remover el diálogo
      document.body.removeChild(dialogContainer);

      // Iniciar la exportación con las selecciones
      getCapitulosDetailed(selections);
    });
  }

  async function getCapitulosDetailed(selections) {
    console.log("Iniciando exportación de capítulos...", selections);
    showLoading("Exportando capítulos... Esto puede tomar varios minutos");

    try {
      const allSeries = [];
      const promises = [];

      // Agregar promesas según las selecciones
      if (selections.serie_sig) {
        promises.push(fetchUserData('serie', 'sig'));
      }
      if (selections.serie_pend) {
        promises.push(fetchUserData('serie', 'pend'));
      }
      if (selections.serie_fav) {
        promises.push(fetchUserData('serie', 'fav'));
      }
      if (selections.serie_vis) {
        promises.push(fetchUserData('serie', 'vis'));
      }
      if (selections.anime_sig) {
        promises.push(fetchUserData('anime', 'sig'));
      }
      if (selections.anime_pend) {
        promises.push(fetchUserData('anime', 'pend'));
      }
      if (selections.anime_fav) {
        promises.push(fetchUserData('anime', 'fav'));
      }
      if (selections.anime_vis) {
        promises.push(fetchUserData('anime', 'vis'));
      }

      // Ejecutar todas las promesas seleccionadas
      const results = await Promise.allSettled(promises);

      // Procesar resultados
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allSeries.push(...result.value);
        } else {
          console.error(`❌ Error en una de las peticiones:`, result.reason);
        }
      });

      // Eliminar duplicados por URL
      const uniqueSeries = allSeries.filter((serie, index, self) =>
        index === self.findIndex(s => s.serie_url === serie.serie_url)
      );

      console.log(`📺 Encontradas ${uniqueSeries.length} series/animes únicos, buscando capítulos...`);

      // Mostrar resumen de lo que se va a procesar
      const selectedTypes = [];
      if (selections.serie_sig) selectedTypes.push("Series que sigo");
      if (selections.serie_pend) selectedTypes.push("Series pendientes");
      if (selections.serie_fav) selectedTypes.push("Series favoritas");
      if (selections.serie_vis) selectedTypes.push("Series vistas");
      if (selections.anime_sig) selectedTypes.push("Animes que sigo");
      if (selections.anime_pend) selectedTypes.push("Animes pendientes");
      if (selections.anime_fav) selectedTypes.push("Animes favoritos");
      if (selections.anime_vis) selectedTypes.push("Animes vistos");

      console.log(`📋 Procesando: ${selectedTypes.join(', ')}`);

      // Si no hay series, mostrar mensaje y terminar
      if (uniqueSeries.length === 0) {
        hideLoading();
        alert("ℹ️ No se encontraron series/animes con los criterios seleccionados");
        return;
      }

      // Ahora obtener capítulos de cada serie/anime
      const allCapitulos = [];

      // Procesar en lotes
      const batchSize = 3;
      for (let i = 0; i < uniqueSeries.length; i += batchSize) {
        const batch = uniqueSeries.slice(i, i + batchSize);
        const batchNumber = Math.floor(i / batchSize) + 1;
        const totalBatches = Math.ceil(uniqueSeries.length / batchSize);

        // Actualizar mensaje de loading
        const loadingElement = document.getElementById('loadingOverlay');
        if (loadingElement) {
          const messageElement = loadingElement.querySelector('div > div:nth-child(2)');
          if (messageElement) {
            messageElement.textContent = `Exportando capítulos... Lote ${batchNumber} de ${totalBatches} (${i + 1}-${Math.min(i + batchSize, uniqueSeries.length)} de ${uniqueSeries.length})`;
          }
        }

        console.log(`📋 Procesando lote ${batchNumber} de ${totalBatches} (${i + 1} a ${Math.min(i + batchSize, uniqueSeries.length)})`);

        const batchPromises = batch.map(async (serie, index) => {
          console.log(`🔍 Buscando capítulos en: ${serie.name}`);
          const capitulos = await fetchCapitulosFromSerie(serie.serie_url);

          // Agregar información adicional
          const capitulosConInfo = capitulos.map(cap => ({
            ...cap,
            serie_genres: serie.genres,
            serie_rating: serie.rating,
            serie_release_date: serie.release_date,
            tipo: serie.type || 'serie' // Agregar tipo (serie/anime)
          }));

          const capitulosVistos = capitulos.filter(cap => cap.visto);

          console.log(`✅ ${serie.name}: ${capitulos.length} capítulos (${capitulosVistos.length} vistos)`);

          return capitulosConInfo;
        });

        const batchResults = await Promise.allSettled(batchPromises);

        batchResults.forEach(result => {
          if (result.status === 'fulfilled') {
            allCapitulos.push(...result.value);
          } else {
            console.error('❌ Error en lote:', result.reason);
          }
        });

        // Pausa entre lotes
        if (i + batchSize < uniqueSeries.length) {
          console.log('⏳ Esperando 2 segundos antes del siguiente lote...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Crear CSV con los capítulos
      createCsvCapitulos(allCapitulos, 'capitulos');
      hideLoading();

      // Mostrar estadísticas finales
      const totalVistos = allCapitulos.filter(cap => cap.visto).length;
      const totalTemporadas = [...new Set(allCapitulos.map(cap => cap.temporada_completa))].length;
      const seriesConCapitulos = [...new Set(allCapitulos.map(cap => cap.serie_name))].length;

      alert(`✅ CSV de capítulos exportado correctamente!\n\n📊 Estadísticas:\n• ${allCapitulos.length} capítulos totales\n• ${totalVistos} capítulos vistos\n• ${totalTemporadas} temporadas\n• ${seriesConCapitulos} series/animes con capítulos\n• ${uniqueSeries.length} series/animes procesados`);

    } catch (error) {
      console.error('Error general:', error);
      hideLoading();
      alert("❌ Error al exportar capítulos: " + error.message);
    }
  }

  async function getPelis() {
    console.log("Películas\n");
    showLoading("Exportando películas...");

    try {
      const results = await Promise.allSettled([
        fetchUserData('movie', 'fav'),
        fetchUserData('movie', 'pend'),
        fetchUserData('movie', 'vis')
      ]);

      const allPelis = [];
      const types = ['favorita', 'pendiente', 'vista'];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const pelis = result.value.map(item => ({
            name: item.name,
            genres: item.genres,
            id_thetvbb: item.id_thetvbb,
            type: types[index],
          }));
          allPelis.push(...pelis);
          console.log(`${types[index]} procesadas:`, pelis.length, 'películas');
        } else {
          console.error(`Error en ${types[index]}:`, result.reason);
        }
      });

      createCsv(allPelis, 'pelis');
      hideLoading();
      alert(`✅ CSV de películas exportado correctamente!\nTotal: ${allPelis.length} películas`);

    } catch (error) {
      console.error('Error general:', error);
      hideLoading();
      alert("❌ Error al exportar el CSV: " + error.message);
    }
  }

  async function getSeries() {
    console.log("Series\n");
    showLoading("Exportando Series...");

    try {
      const results = await Promise.allSettled([
        fetchUserData('serie', 'fav'),
        fetchUserData('serie', 'sig'),
        fetchUserData('serie', 'pend'),
        fetchUserData('serie', 'vis')
      ]);

      const allSeries = [];
      const types = ['favorita', 'siguiendo', 'pendiente', 'vista'];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const series = result.value.map(item => ({
            name: item.name,
            genres: item.genres,
            id_thetvbb: item.id_thetvbb,
            type: types[index],
          }));
          allSeries.push(...series);
          console.log(`${types[index]} procesadas:`, series.length, 'series');
        } else {
          console.error(`Error en ${types[index]}:`, result.reason);
        }
      });

      createCsv(allSeries, 'series');
      hideLoading();
      alert(`✅ CSV de series exportado correctamente!\nTotal: ${allSeries.length} series`);

    } catch (error) {
      console.error('Error general:', error);
      hideLoading();
      alert("❌ Error al exportar el CSV: " + error.message);
    }
  }

  async function getAnimes() {
    console.log("Animes\n");
    showLoading("Exportando animes...");

    try {
      const results = await Promise.allSettled([
        fetchUserData('anime', 'fav'),
        fetchUserData('anime', 'sig'),
        fetchUserData('anime', 'pend'),
        fetchUserData('anime', 'vis')
      ]);

      const allAnimes = [];
      const types = ['favorita', 'siguiendo', 'pendiente', 'vista'];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const animes = result.value.map(item => ({
            name: item.name,
            genres: item.genres,
            id_thetvbb: item.id_thetvbb,
            type: types[index],
          }));
          allAnimes.push(...animes);
          console.log(`${types[index]} procesadas:`, animes.length, 'animes');
        } else {
          console.error(`Error en ${types[index]}:`, result.reason);
        }
      });

      createCsv(allAnimes, 'animes');
      hideLoading();
      alert(`✅ CSV de animes exportado correctamente!\nTotal: ${allAnimes.length} animes`);

    } catch (error) {
      console.error('Error general:', error);
      hideLoading();
      alert("❌ Error al exportar el CSV: " + error.message);
    }
  }


  async function getListas() {

    console.log("Listas\n");

    return console.log("Listas, Nada que exportar: Pendiente de realizar la programación para exportar listas.\n");

    try {
      const results = await Promise.allSettled([
        fetchUserData('listas', 'publ'),
        fetchUserData('listas', 'priv'),
        fetchUserData('listas', 'fav')
      ]);

      const allPelis = [];
      const types = ['publica', 'privada', 'favorita'];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const pelis = result.value.map(item => ({
            name: item.name,
            id_thetvbb: item.id_thetvbb,
            type: types[index],
          }));
          allPelis.push(...pelis);
          console.log(`${types[index]} procesadas:`, pelis);
        } else {
          console.error(`Error en ${types[index]}:`, result.reason);
        }
      });

      createCsv(allPelis, 'pelis');

    } catch (error) {
      console.error('Error general:', error);
    }

  }

  function isValidNumericId(id) {
    if (!id || id.trim() === '') return false;
    return /^\d+$/.test(id);
  }

  function parseDataFromHTML(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const articles = doc.querySelectorAll('article.item');

    const elementos = [];

    articles.forEach(article => {
      const nameElement = article.querySelector('.data h3');
      const name = nameElement ? nameElement.textContent.trim() : '';

      const linkElement = article.querySelector('a[href]');
      let id_thetvbb = '';
      let serieUrl = '';

      if (linkElement) {
        const href = linkElement.getAttribute('href');
        serieUrl = href;

        const lastUnderscoreIndex = href.lastIndexOf('_');
        if (lastUnderscoreIndex !== -1) {
          let extractedId = href.substring(lastUnderscoreIndex + 1);
          if (extractedId.includes('/')) {
            extractedId = extractedId.split('/')[0];
          }

          if (isValidNumericId(extractedId)) {
            id_thetvbb = extractedId;
          }
        }
      }

      const posterElement = article.querySelector('.poster img');
      const posterUrl = posterElement ? posterElement.getAttribute('src') : '';

      const dateElement = article.querySelector('.data p');
      const date = dateElement ? dateElement.textContent.trim() : '';

      const genresElement = article.querySelector('.data span');
      const genres = genresElement ? genresElement.textContent.trim() : '';

      const ratingElement = article.querySelector('.nota span');
      let rating = '';
      if (ratingElement) {
        const ratingText = ratingElement.textContent.trim();
        const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
        rating = ratingMatch ? ratingMatch[1] : '';
      }

      if (name) {
        elementos.push({
          name: name,
          genres: genres,
          id_thetvbb: id_thetvbb,
          poster_url: posterUrl,
          release_date: date,
          rating: rating,
          serie_url: serieUrl
        });
      }
    });

    return elementos;
  }
  function extractUsername() {

    let username = '';

    const linkElement = document.querySelector('.uPerfil a[href]');
    if (linkElement) {
      const href = linkElement.getAttribute('href');
      const match = href.match(/\/user\/([^\/]+)/);
      if (match && match[1]) {
        username = match[1];
      }
    }

    return username;
  }

  async function fetchUserData(tipo, subtipo, page = 1, allResults = []) {
    const formData = new FormData();
    const usuario = extractUsername();

    const data = {
      '_method': 'items',
      'page': page.toString(),
      'type': tipo,
      'username': usuario,
      'subtype': subtipo,
      'async': 'true',
      'ajaxName': 'profile',
      'slug': 'user',
      'identifier': ''
    };

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const headers = {
      "accept": "*/*",
      "accept-language": "es-ES,es;q=0.9",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Google Chrome\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1"
    };

    try {
      const response = await fetch("https://playdede.club/ajax.php", {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: headers,
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const currentPageResults = parseDataFromHTML(result.render);

      allResults = [...allResults, ...currentPageResults];

      const nextPage = getNextPageNumber(result.render);

      if (nextPage && nextPage > page) {
        console.log(`📄 Cargando página ${nextPage} de ${tipo} ${subtipo}...`);
        return await fetchUserData(tipo, subtipo, nextPage, allResults);
      } else {
        console.log(`✅ ${tipo} ${subtipo}: ${allResults.length} elementos encontrados en ${page} página(s)`);
        return allResults;
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async function fetchCapitulosFromSerie(serieUrl) {
    try {
      // Construir la URL completa
      const fullUrl = serieUrl.startsWith('http') ? serieUrl : `https://playdede.club/${serieUrl}`;

      console.log(`🔍 Obteniendo capítulos de: ${fullUrl}`);

      const response = await fetch(fullUrl, {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "es-ES,es;q=0.9",
          "Cache-Control": "no-cache",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const htmlContent = await response.text();
      const capitulos = parseCapitulosFromHTML(htmlContent, serieUrl);

      console.log(`✅ Encontrados ${capitulos.length} capítulos`);
      return capitulos;

    } catch (error) {
      console.error('❌ Error fetching capitulos:', error);
      return [];
    }
  }

  function parseCapitulosFromHTML(htmlString, serieUrl) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const capitulos = [];

    // Extraer el nombre de la serie del título de la página
    const serieName = doc.querySelector('h1') ? doc.querySelector('h1').textContent.trim() : extractSerieNameFromUrl(serieUrl);

    // Buscar todas las temporadas
    const seasonElements = doc.querySelectorAll('#seasons .clickSeason');

    // Si no hay temporadas visibles, buscar en la primera temporada (que está activa)
    if (seasonElements.length === 0) {
      // Procesar la temporada activa
      processTemporada(doc, '1', serieName, serieUrl, capitulos);
    } else {
      // Procesar cada temporada
      seasonElements.forEach(seasonElement => {
        const seasonNumber = seasonElement.getAttribute('data-season');
        processTemporada(doc, seasonNumber, serieName, serieUrl, capitulos);
      });
    }

    return capitulos;
  }

  function processTemporada(doc, seasonNumber, serieName, serieUrl, capitulos) {

    const seasonContainer = doc.querySelector(`.se-c[data-season="${seasonNumber}"]`);

    if (!seasonContainer) return;

    const episodioElements = seasonContainer.querySelectorAll('li[class*="mark-"]');

    episodioElements.forEach(episodio => {

      const linkElement = episodio.querySelector('a[href]');
      const capituloUrl = linkElement ? linkElement.getAttribute('href') : '';

      const titleElement = episodio.querySelector('.epst');
      const title = titleElement ? titleElement.textContent.trim() : '';

      const numberElement = episodio.querySelector('.numerando');
      const numberText = numberElement ? numberElement.textContent.trim() : '';

      const dateElement = episodio.querySelector('.date');
      const date = dateElement ? dateElement.textContent.trim() : '';

      const imageElement = episodio.querySelector('.imagen img');
      const imageUrl = imageElement ? imageElement.getAttribute('src') : '';

      const vistoElement = episodio.querySelector('.markEpisode');
      let visto = false;
      if (vistoElement) {
        const vistoText = vistoElement.textContent.trim();
        visto = vistoText.includes('Visto');
      }

      let temporadaNum = seasonNumber;
      let episodioNum = '';
      let numeroCompleto = '';

      if (numberText) {
        const match = numberText.match(/(\d+)\s*-\s*(\d+)/);
        if (match) {
          temporadaNum = match[1];
          episodioNum = match[2];
          numeroCompleto = `${temporadaNum}x${episodioNum.padStart(2, '0')}`;
        } else {
          numeroCompleto = numberText;
        }
      } else {
        numeroCompleto = `${temporadaNum}x${episodioNum.padStart(2, '0')}`;
      }

      const episodioId = episodio.getAttribute('class') ?
        episodio.getAttribute('class').match(/mark-(\d+)/) : null;

      capitulos.push({
        serie_name: serieName,
        serie_url: serieUrl,
        temporada: temporadaNum,
        episodio: episodioNum,
        capitulo_title: title,
        capitulo_number: numeroCompleto,
        capitulo_url: capituloUrl,
        fecha_emision: date,
        imagen_url: imageUrl,
        visto: visto,
        episodio_id: episodioId ? episodioId[1] : '',
        temporada_completa: `${serieName} - T${temporadaNum}`,
        numero_original: numberText
      });
    });
  }

  function extractSerieNameFromUrl(url) {
    const match = url.match(/\/([^\/]+)\/?$/);
    return match ? match[1].replace(/-/g, ' ').replace(/_/g, ' ') : 'Serie Desconocida';
  }

  function getNextPageNumber(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const paginationDiv = doc.querySelector('.pagPlaydede');
    if (!paginationDiv) return null;

    const nextPageLinks = paginationDiv.querySelectorAll('a[data-ajax="profile"]');

    for (let link of nextPageLinks) {
      const linkText = link.textContent.trim();
      if (linkText.includes('Pagina Siguiente')) {
        const bElement = link.querySelector('b');
        if (bElement) {
          const nextPage = parseInt(bElement.textContent.trim());
          return isNaN(nextPage) ? null : nextPage;
        }
      }
    }

    return null;
  }


  function createCsv(data, fileName) {
    let csvHeader = ["Title", "Genres", "IdThetvbb", "Type"];
    let csv2 = [];

    data.forEach((element, index) => {
      if (element.name && element.name.includes(';')) {
        console.log(`⚠️  Título con ";" encontrado [${index}]:`, element.name);
      }

      let csv_temp = {
        "name": element.name,
        "genres": element.genres,
        "id_thetvbb": element.id_thetvbb,
        "type": element.type
      };

      csv2.push(csv_temp);
    });

    console.log(`CSV ${fileName}: ${csv2.length} elementos, ${csv2.filter(x => x.name && x.name.includes(';')).length} con ";"`);
    export_csv(csvHeader, csv2, delimiter_csv, fileName);
  }

  function createCsvCapitulos(data, fileName) {
    let csvHeader = ["Serie", "Capítulo", "Número", "Visto",];
    let csv2 = [];

    data.forEach((element, index) => {
      let csv_temp = {
        "serie": element.serie_name || element.serie,
        "capitulo": element.capitulo_title,
        "numero": element.capitulo_number,
        "visto": element.visto ? "Sí" : "No"
      };

      csv2.push(csv_temp);
    });

    console.log(`CSV ${fileName}: ${csv2.length} capítulos procesados`);
    export_csv(csvHeader, csv2, delimiter_csv, fileName);
  }

  function escapeCsvField(field, delimiter) {
    if (field === null || field === undefined) return '';

    const stringField = String(field);

    if (stringField.includes(delimiter) ||
      stringField.includes('"') ||
      stringField.includes('\n') ||
      stringField.includes('\r')) {
      return '"' + stringField.replace(/"/g, '""') + '"';
    }

    return stringField;
  }

  function export_csv(arrayHeader, arrayData, delimiter, fileName) {
    let header = arrayHeader.map(field => escapeCsvField(field, delimiter)).join(delimiter) + '\n';
    let csv = header;

    arrayData.forEach(obj => {
      let row = Object.keys(obj).map(key => escapeCsvField(obj[key], delimiter));
      csv += row.join(delimiter) + "\n";
    });

    // AGREGAR BOM UTF-8 para Excel
    const BOM = '\uFEFF';
    let csvData = new Blob([BOM + csv], {
      type: 'text/csv; charset=utf-8'
    });

    let csvUrl = URL.createObjectURL(csvData);

    let hiddenElement = document.createElement('a');
    hiddenElement.href = csvUrl;
    hiddenElement.target = '_blank';
    hiddenElement.download = fileName + '.csv';
    hiddenElement.click();
  }

  function showLoading(message = "Cargando datos...") {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loadingOverlay';
    loadingDiv.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      font-family: Arial, sans-serif;
    ">
      <div style="
        background: white;
        padding: 40px;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 0 30px rgba(0,0,0,0.4);
        min-width: 300px;
      ">
        <div style="
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        "></div>
        <div style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 10px;">${message}</div>
        <div style="font-size: 14px; color: #666;">No cierres esta página</div>
      </div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
    document.body.appendChild(loadingDiv);
  }

  function hideLoading() {
    const loadingDiv = document.getElementById('loadingOverlay');
    if (loadingDiv) {
      loadingDiv.remove();
    }
  }



  var descarga_li = document.createElement("div");
  descarga_li.classList.add("uPerfil");
  descarga_li.innerHTML =
    '<li class="menu-item menu-item-type-custom menu-item-object-custom "> \
  <div class="btn dropdown-toggle" data-toggle="dropdown" id="dropdownBtn"> \
    <span class="uPerfil">Descargar CSV<i class="fa fa-download" aria-hidden="true"></i></span> \
  </div>\
<ul class="dropdown-menu pull-right descargar hidden" style="background: #010101;"> \
     <li> \
        <a class="csv-link" data-action="series">Series</a> \
    </li> \
    <li> \
        <a class="csv-link" data-action="animes">Animes</a> \
    </li> \
    <li> \
        <a class="csv-link" data-action="pelis">Películas</a> \
    </li> \
    <li> \
        <a class="csv-link" data-action="capitulos">Capítulos</a> \
    </li> \
  </ul> \
  </li>';

  var descarga_li_mobile = document.createElement("li");
  let classes = "menu-item menu-item-type-custom menu-item-object-custom".split(' ');

  descarga_li_mobile.classList.add(...classes);
  descarga_li_mobile.innerHTML =
    '<div class="btn dropdown-toggle" data-toggle="dropdown" id="dropdownBtn"> \
    <a>Descargar CSV<i class="fa fa-download" aria-hidden="true"></i></a> \
  </div>\
<ul class="dropdown-menu pull-right descargar hidden" style="background: #010101;"> \
    <li> \
        <a class="csv-link" data-action="series">Series</a> \
    </li> \
    <li> \
        <a class="csv-link" data-action="animes">Animes</a> \
    </li> \
    <li> \
        <a class="csv-link" data-action="pelis">Películas</a> \
    </li> \
    <li> \
        <a class="csv-link" data-action="capitulos">Capítulos</a> \
    </li> \
  </ul>';

  const style = document.createElement('style');
  style.textContent = `
  .hidden { display: none !important; }
  .visible { display: block !important; }
  .dropdown-menu { 
    position: absolute; 
    background: white; 
    border: 1px solid #ccc; 
    z-index: 1000; 
    list-style: none; 
    padding: 0; 
    margin: 0; 
  }
  .dropdown-menu li a { 
    display: block; 
    padding: 8px 12px; 
    text-decoration: none; 
    color: #333; 
    cursor: pointer; 
  }
  .dropdown-menu li a:hover { 
    background: #f5f5f5;
    color: #000000ff !important;
  }
`;
  document.head.appendChild(style);


  const dropdownBtn = descarga_li.querySelector('#dropdownBtn');
  const dropdownMenu = descarga_li.querySelector('.dropdown-menu');

  dropdownBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    dropdownMenu.classList.toggle('hidden');
    dropdownMenu.classList.toggle('visible');
  });


  document.addEventListener('click', function () {
    dropdownMenu.classList.add('hidden');
    dropdownMenu.classList.remove('visible');
  });

  dropdownMenu.addEventListener('click', function (e) {
    e.stopPropagation();
  });




  /* Agregar event listeners a los enlaces del menú */
  dropdownMenu.addEventListener('click', function (e) {
    e.stopPropagation();

    const target = e.target;
    if (target.classList.contains('csv-link')) {
      const action = target.getAttribute('data-action');

      switch (action) {
        case 'series':
          getSeries();
          break;
        case 'animes':
          getAnimes();
          break;
        case 'pelis':
          getPelis();
          break;
        case 'capitulos':
          getCapitulos();
          break;
      }

      /* Cerrar el menú después de hacer clic */
      dropdownMenu.classList.add('hidden');
      dropdownMenu.classList.remove('visible');
    }
  });

  document.getElementsByClassName('main-header')[0].appendChild(descarga_li);


  const dropdownBtnMobile = descarga_li_mobile.querySelector('#dropdownBtn');
  const dropdownMenuMobile = descarga_li_mobile.querySelector('.dropdown-menu');

  dropdownBtnMobile.addEventListener('click', function (e) {
    e.stopPropagation();
    dropdownMenuMobile.classList.toggle('hidden');
    dropdownMenuMobile.classList.toggle('visible');
  });


  document.addEventListener('click', function () {
    dropdownMenuMobile.classList.add('hidden');
    dropdownMenuMobile.classList.remove('visible');
  });

  dropdownMenuMobile.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  /* Agregar event listeners a los enlaces del menú */
  dropdownMenuMobile.addEventListener('click', function (e) {
    e.stopPropagation();

    const target = e.target;
    if (target.classList.contains('csv-link')) {
      const action = target.getAttribute('data-action');

      switch (action) {
        case 'series':
          getSeries();
          break;
        case 'animes':
          getAnimes();
          break;
        case 'pelis':
          getPelis();
          break;
        case 'capitulos':
          getCapitulos();
          break;
      }

      /* Cerrar el menú después de hacer clic*/
      dropdownMenuMobile.classList.add('hidden');
      dropdownMenuMobile.classList.remove('visible');
    }
  });

  document.getElementsByClassName('main-header')[1].appendChild(descarga_li_mobile);

  console.log('✅ Script de exportación listo');
  alert('✅ Script de exportación cargado');
})();

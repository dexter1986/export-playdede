javascript:(function () {
  /*********************************************************************************************
  
    Abrir la web de Playdede y pulsa f12 y "consola" pegáis todo este código y le dais a enter
  
    Aparecerá un nuevo menú a la derecha de tu usuario llamado "Descargar CSV" pulsa en él para ver el menú de descargas
  
    Hasta que no termine un comando no ejecutar el siguiente, cada uno genera un csv diferente.
  
  ***********************************************************************************************/


  var delimiter_csv = ';'; /* delimitador para el csv: '\t' => tabulacion, ',' => comilla, ';' => punto y coma.*/

  var series = [], pelis = [], capitulos = [], temporadas = [], listas_creadas = [], listas_siguiendo = [];


  function getCapitulos() {
    return console.log("Capitulos, Nada que exportar: Pendiente de realizar la programación para exportar capitulos.\n");

    var r = confirm("Exportar el CSV de Capítulos.\nLa página se quedará congelada mientras se procesa.\nPulsa aceptar para proceder");
    if (r == true) {
      let capitulos_series_favorites;
      let capitulos_series_following;
      let capitulos_series_pending;
      let capitulos_series_seen;



      console.log("Capítulos");

      capitulos_series_favorites = parser.parseFromString(getContenido(url_series_favorites), "text/html").querySelectorAll('.media-container');
      createData(capitulos_series_favorites, "favorita", "capitulos");


      capitulos_series_following = parser.parseFromString(getContenido(url_series_following), "text/html").querySelectorAll('.media-container');
      createData(capitulos_series_following, "siguiendo", "capitulos");


      capitulos_series_pending = parser.parseFromString(getContenido(url_series_pending), "text/html").querySelectorAll('.media-container');
      createData(capitulos_series_pending, "pendiente", "capitulos");


      capitulos_series_seen = parser.parseFromString(getContenido(url_series_seen), "text/html").querySelectorAll('.media-container');
      createData(capitulos_series_seen, "vista", "capitulos");


      createCsvCapitulos(capitulos, name = 'capitulos');
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

      if (linkElement) {
        const href = linkElement.getAttribute('href');
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
          rating: rating
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

    // Verificar datos problemáticos
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
        <a class="csv-link" data-action="capitulos">Capítulos (PENDIENTE)</a> \
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
        <a class="csv-link" data-action="capitulos">Capítulos (PENDIENTE)</a> \
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

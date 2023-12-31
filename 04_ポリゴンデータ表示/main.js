const map = new maplibregl.Map({
  container: 'map',
  center: [136.884639, 35.16137769], // 中心座標
  zoom: 12, // ズームレベル
  style: {
    // スタイル仕様のバージョン番号。8を指定する
    version: 8,
    // データソース
    sources: {
      // OpenStreetMap
      'osm-tile': {
        // ソースの種類。vector、raster、raster-dem、geojson、image、video のいずれか
        type: 'raster',
        // タイルソースのURL
        tiles: ['https://tile.openstreetmap.jp/styles/osm-bright-ja/{z}/{x}/{y}.png'],
        // タイルの解像度。単位はピクセル、デフォルトは512
        tileSize: 256,
        // データの帰属
        attribution: "地図の出典：<a href='https://www.openstreetmap.org/copyright' target='_blank'>© OpenStreetMap contributors</a>",
      },
      // 名古屋市の景観資源データ
      'landscape-point': {
        type: 'geojson',
        // GeoJSONファイルのURL
        data: './data/landscape.geojson',
        attribution: "データの出典：<a href='https://maps.pref.aichi.jp/opendata.html' target='_blank'>愛知県オープンデータカタログ</a>",
      },
      // 愛知県の自動車専用道路データ
      'road-line': {
        type: 'geojson',
        data: './data/road.geojson',
      },
      // 愛知県の駅前広場データ
      'square-polygon': {
        type: 'geojson',
        data: './data/square.geojson',
      },
    },
    // 表示するレイヤ
    layers: [
      // 背景地図としてOpenStreetMapのラスタタイルを追加
      {
        // 一意のレイヤID
        id: 'osm-layer',
        // レイヤの種類。background、fill、line、symbol、raster、circle、fill-extrusion、heatmap、hillshade のいずれか
        type: 'raster',
        // データソースの指定
        source: 'osm-tile',
      },
      // 名古屋市の景観資源のポイントデータを追加
      {
        id: 'point-layer',
        type: 'circle',
        source: 'landscape-point',
        paint: {
          // 丸の半径。単位はピクセル。
          'circle-radius': 10,
          // 丸の色
          'circle-color': '#3887be',
        },
      },
      // 愛知県の自動車専用道路のラインデータを追加
      {
        id: 'line-layer',
        type: 'line',
        source: 'road-line',
        paint: {
          // ラインの色
          'line-color': '#717375',
          // ラインの幅
          'line-width': 5,
        },
      },
      // 愛知県の駅前広場のポリゴンデータを追加
      {
        id: 'polygon-layer',
        type: 'fill',
        source: 'square-polygon',
        paint: {
          // 塗りつぶしの色
          'fill-color': '#4db56a',
          // 塗りつぶしの透明度。0になるほど透明に、1になるほど不透明になる
          'fill-opacity': 0.8,
          // 枠の色
          'fill-outline-color': '#000000',
        },
      },
    ],
  },
});

// ポイントクリック時にポップアップを表示する
map.on('click', 'point-layer', function (e) {
  var coordinates = e.features[0].geometry.coordinates.slice();
  var name = e.features[0].properties.タイトル;

  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }
  // ポップアップを表示する
  new maplibregl.Popup({
    offset: 10, // ポップアップの位置
    closeButton: false, // 閉じるボタンの表示
  })
    .setLngLat(coordinates)
    .setHTML(name)
    .addTo(map);
});

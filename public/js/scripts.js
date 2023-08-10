import { normalizeLongitude } from "./meteo/long_normalize.js";
import { meteo_chart } from "./meteo/meteo_charts.js";
import { airQualityFetchProcess } from "./airQualityFetchProcess.js";

 
let labels = [];
export let coordinates = [];

export function createNode(element) {
    return document.createElement(element);
}
export function append(parent, el) {
    return parent.appendChild(el);
}

function airQualityFetch(){
    fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coordinates[0]}&longitude=${coordinates[1]}&hourly=pm10,pm2_5`)
    .then(response => response.json())
    .then(function(data) {airQualityFetchProcess(data)});
}

function onMapButtonListener(){
    document.addEventListener('click', function() {
        let button = document.getElementById('mapButtonHtml');
        button.addEventListener('click', function() {
            airQualityFetch();    
            meteo_chart ()
            map.setView([coordinates[0], coordinates[1]], 10);
        });
    });
}

function clearForm() {
    let dateTimeDiv = document.getElementById("air-pollution-dateTime");
    let pm2_5Div = document.getElementById("air-pollution-pm2_5");
    let pm10Div = document.getElementById("air-pollution-pm10");

    dateTimeDiv.innerHTML = '';
    pm2_5Div.innerHTML = '';
    pm10Div.innerHTML = '';

    coordinates = [];

    map.setView([0, 0], 1);
    map.removeLayer(marker);
    markerCount = 0;
    
    document.getElementById("city").value = null;
}

document.getElementById("clearbutton").addEventListener('click', () => clearForm())



function addLabels(coordinates) {
    

  if (coordinates[0] > 0 && coordinates[0] < 90) {
    labels.push("с.ш.");
  } else {
    labels.push("ю.ш.");
  }

  if (coordinates[1] > 0 && coordinates[1] <= 180 ||coordinates[1] > 360 && coordinates[1] <= 520 ||coordinates[1] < -180 && coordinates[1] >= -360 ) {
    labels.push("в.д.");
  } else {
    labels.push("з.д.");
  }
  
    return labels;
}

export const air_pollution_dateTime_div= document.getElementById('air-pollution-dateTime');
export const air_pollution_pm2_5_div= document.getElementById('air-pollution-pm2_5')
export const air_pollution_pm10_div= document.getElementById('air-pollution-pm10')


let map = L.map('map', {center: [0, 0], zoom: 1})
let marker = L.marker([], {draggable:true});
let markerCount = 0;
let mapButtonHtml = '<button id="mapButtonHtml">Запросить данные по координатам</button>';
let baseLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let layers = {
    'OpenStreetMaps': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    'Wikimapia': new L.tileLayer('http://{s}{hash}.wikimapia.org/?x={x}&y={y}&zoom={z}&r=7071412&type=&lng=1', {hash: function (data) {return data.x % 4 + (data.y % 4) *4;}, subdomains : 'i' , maxZoom: 20}),
    'Спутник': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
}
let overlays = {
    'PM<sub>2.5</sub> + PM<sub>10</sub>': L.tileLayer('https://osm.airvisual.net/pm25_layer/{z}/{x}/{y}.webp', {
        use_norm : true,
        arrow_step : 16,
        attribution: '<div style="font-family: Arial,sans-serif; font-size: 10px; padding: 0; float: right; margin-bottom: 30px; border-width: 0px; margin-right: 10px; width: 370px; height: 27px;"><div>Содержание вредных частиц</div><div style="display: flex; -webkit-box-align: center; align-items: center; padding: 2pt 4pt; background-color: #fff; border-radius: 4pt; box-shadow: 0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24); transition: box-shadow .1s ease-out,-webkit-box-shadow .1s ease-out; -webkit-box-pack: justify; justify-content: space-between; font-size: 10px; margin-bottom: 0;"><div style="width: 360px;"><div style="box-sizing: border-box; display: flex; width: 100%; -webkit-box-pack: justify; justify-content: space-between;"><div><br>Норма</div><div>Незначительное<br>превышение</div><div>Выше<br>среднего</div><div><br>Высокое</div><div>Очень<br>высокое</div><div><br>Опасное</div></div><div class="horizontal-gradient-line" style="width: 360px; background: linear-gradient(to right, rgba(255, 255, 0, 0), rgb(156, 216, 78), rgb(250, 207, 57), rgb(249, 144, 73), rgb(246, 94, 95), rgb(160, 112, 182), rgb(160, 106, 123), rgb(116, 74, 87));-webkit-text-size-adjust: 100%;-webkit-box-direction: normal; box-sizing: border-box; border-radius: 4pt; height: 4px; opacity: .9; width: 360px; border-left: 1px solid #f2f2f2; border-bottom: 1px solid #f2f2f2;"></div></div></div></div>'}
    ),
}
L.control.layers(layers, overlays).addTo(map);

//если мы запрашиваем данные по карте
map.on ('click', function(e) {
    // Проверка количества установленных маркеров
    if (markerCount < 1) {
        // Создание маркера и добавление его на карту
        coordinates = [e.latlng.lat, e.latlng.lng];
        coordinates = coordinates.map(function(coordinates) {
            return coordinates.toFixed(5);
        });
        labels = addLabels(coordinates)
        marker = L.marker(coordinates).addTo(map);
        marker.bindPopup(`Широта: ${Math. abs(coordinates[0])}° ${labels[0]}<br>Долгота: ${Math. abs(normalizeLongitude(coordinates[1]))}° ${labels[1]}` + mapButtonHtml).openPopup();
        markerCount++;
        onMapButtonListener();
    } else {
        marker.setLatLng(e.latlng);
        coordinates = [e.latlng.lat, e.latlng.lng];
        coordinates = coordinates.map(function(coordinates) {
            return coordinates.toFixed(5);
        });
        labels = addLabels(coordinates)
        marker.bindPopup(`Широта: ${Math. abs(coordinates[0])}° ${labels[0]}<br>Долгота: ${Math. abs(normalizeLongitude(coordinates[1]))}° ${labels[1]}` + mapButtonHtml).openPopup();
        onMapButtonListener()
        
    }
})

//если мы запрашиваем данные по названию населенного пункта
document.getElementById("city_selec_form").addEventListener("submit", function(event) {
    event.preventDefault(); // Отменяем отправку формы
    
    let place_name = document.getElementById("city").value;

    const API_KEY_YANDEX = '85eaff1b-ef9e-4c11-89bc-ca01d1ae43de'
    const API_URL_GEO_DATA = `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY_YANDEX}&geocode=${place_name}&format=json`
    fetch(API_URL_GEO_DATA)
        .then(response => response.json())
        .then(function(data_yandex){
            coordinates = (data_yandex.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos).split(' ')
            coordinates = [coordinates[1], coordinates[0]] 
            airQualityFetch();  
            meteo_chart ()
            
            map.setView([coordinates[0], coordinates[1]], 10);
            
            marker = L.marker([coordinates[0], coordinates[1]])
                .bindPopup(`${place_name}`.toUpperCase())
                .addTo(map);

            })
        })  
        
        
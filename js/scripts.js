function createNode(element) {
    return document.createElement(element);
}
function append(parent, el) {
    return parent.appendChild(el);
}

function airQualityFetch(){
    fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coordinates[0]}&longitude=${coordinates[1]}&hourly=pm10,pm2_5`)
    .then(response => response.json())
    .then(function(data) {
        // переменная с временем/датой
        let air_pollution_dateTime = data.hourly.time
        // переменная с частицами pm2,5
        let air_pollution_pm2_5 = data.hourly.pm2_5
        // переменная с частицами pm10
        let air_pollution_pm10 = data.hourly.pm10
       
        // Блок таблицы
        // передаем отформатированные время и дату в таблицу
        for (let i = 0; i < air_pollution_dateTime.length; i++) {
            //console.log(`${air_pollution.pm2_5[i]} : ${air_pollution.pm10[i]} : ${air_pollution.time[i]}`)
            air_pollution_dateTime[i]= new Date (air_pollution_dateTime[i])
            const formattedDate = air_pollution_dateTime[i].toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });            
            let p = createNode('p');
            let hr = createNode('hr')
            p.innerHTML = `${formattedDate} `;                
            append(air_pollution_dateTime_div, p);
            append(air_pollution_dateTime_div, hr);
            }

        // преедаем данные по частицам pm2,5 в таблицу    
        for (let i = 0; i < air_pollution_pm2_5.length; i++) {
            let p = createNode('p');
            let hr = createNode('hr')
            p.innerHTML = `${air_pollution_pm2_5[i]} `;                
            append(air_pollution_pm2_5_div, p);
            append(air_pollution_pm2_5_div, hr);
            }

        // преедаем данные по частицам pm10 в таблицу
        for (let i = 0; i < air_pollution_pm10.length; i++) {
            let p = createNode('p');
            let hr = createNode('hr')
            p.innerHTML = `${air_pollution_pm10[i]} `;                
            append(air_pollution_pm10_div, p);
            append(air_pollution_pm10_div, hr);
            }
            
//Блок дэшборда
    //Первый график
        // Готовим исходную переменную с временем и датой, получаем числа для первого графика
        let chart1_dateSetArrey = [];
        let uniqueDates = {}; // объект для отслеживания уникальных дат
        // for (let i = 0; i < air_pollution_dateTime.length; i++) {
        for (let i = 0; i < 72; i++) {
            air_pollution_dateTime[i] = new Date(air_pollution_dateTime[i]);
            const day = air_pollution_dateTime[i].getDate();
            const month = air_pollution_dateTime[i].getMonth() + 1;
            //собираем число в формате "дд.мм"
            const formattedDate = air_pollution_dateTime[i].toLocaleString('ru', { weekday: 'short', day: 'numeric', month: 'long' });
            // Проверяем, была ли уже встречена эта дата
            if (!uniqueDates[formattedDate]) {
                chart1_dateSetArrey.push(formattedDate);
                uniqueDates[formattedDate] = true; // отмечаем дату как встреченную
            }
        }
        
        //готовим массив со средними значениями на каждуйю дату для частиц 2,5pm
        let blockSize = 24; // данные за 24 часа
        let averages_pm2_5 = [];

        for (let i = 0; i < air_pollution_pm2_5.length; i += blockSize) {
            let sum_pm2_5 = 0;
            let count_pm2_5 = 0;
            var minValue = null;

            for (var j = i; j < i + blockSize && j < air_pollution_pm2_5.length; j++) {
                if (air_pollution_pm2_5[j] !== null && air_pollution_pm2_5[j] !== 0) {
                sum_pm2_5 += air_pollution_pm2_5[j];
                count_pm2_5++;
            
                    if (minValue === null || air_pollution_pm2_5[j] < minValue) {
                        minValue = air_pollution_pm2_5[j];
                    }
                }
            }
            
            if (count_pm2_5 > 0) {
                let average_pm2_5 = sum_pm2_5 / count_pm2_5;
            
                if (average_pm2_5 < minValue) {
                    averages_pm2_5.push(minValue);
                } else {
                    averages_pm2_5.push(average_pm2_5);
                }
            }
        }                  
        
        //готовим массив со средними значениями на каждуйю дату для частиц 10pm
        let averages_pm10 = [];

        for (let i = 0; i < air_pollution_pm10.length; i += blockSize) {
            let sum_pm10 = 0;
            let count_pm10 = 0;
            var minValue = null;

            for (var j = i; j < i + blockSize && j < air_pollution_pm10.length; j++) {
                if (air_pollution_pm10[j] !== null && air_pollution_pm10[j] !== 0) {
                sum_pm10 += air_pollution_pm10[j];
                count_pm10++;
            
                    if (minValue === null || air_pollution_pm10[j] < minValue) {
                        minValue = air_pollution_pm10[j];
                    }
                }
            }
            
            if (count_pm10 > 0) {
                let average_pm10 = sum_pm10 / count_pm10;
            
                if (average_pm10 < minValue) {
                    averages_pm10.push(minValue);
                } else {
                    averages_pm10.push(average_pm10);
                }
            }
        }

        // Собираем дата-сет для первого графика
        const chart1_data = {
            labels: chart1_dateSetArrey,
            datasets: [{
                type: 'bar',
                  label: 'pm2,5',
                  data: averages_pm2_5,
                  borderColor: 'rgb(255, 99, 132)',
                  backgroundColor: 'rgba(255, 99, 132, 0.2)'
            }, {
                type: 'bar',
                  label: 'pm10',
                  data: averages_pm10,
                  borderColor: 'rgb(15, 99, 132)',
                  backgroundColor: 'rgba(15, 99, 132, 0.2)'
            }]
        };
        
    //Второй график
        // Готовим исходную переменную с временем и датой, получаем числа для первого графика
        let chart2_dateSetArrey = [];
        // for (let i = 0; i < air_pollution_dateTime.length; i++) {
        for (let i = 0; i < 72; i++) {
            air_pollution_dateTime[i] = new Date(air_pollution_dateTime[i]);
            const day = air_pollution_dateTime[i].getDate();
            const month = air_pollution_dateTime[i].getMonth() + 1;
            const hour = air_pollution_dateTime[i].getHours();
            //собираем число в формате "ЧЧ дд.мм"
            const formattedDate = hour.toString().padStart(2, "0") + ":00,\n" + day.toString().padStart(2, "0") + "." + month.toString().padStart(2, "0");
            
            chart2_dateSetArrey.push(formattedDate);
               
            }
        
        // Собираем дата-сет для второго графика
        const chart2_data = {
            labels: chart2_dateSetArrey,
            datasets: [{
                type: 'line',
                label: 'pm2,5',
                data: air_pollution_pm2_5,
                fill: false,
                borderColor: 'rgb(54, 162, 235)'
            }, {
                type: 'line',
                label: 'pm10',
                data: air_pollution_pm10,
                borderColor: 'rgb(54, 162, 11)'
            }]
          };

        Chart.defaults.font.size = 14;
        Chart.defaults.color = '#000';

        // инициализируем графики
        new Chart(ctx1, {
            type: 'bar',
            data: chart1_data,
            options: {
                plugins: {
                    title: {
                        display: true,
                        color:'rgb (0, 0, 0)',
                        font: {
                            size: 20
                        },
                        text: 'Среднесуточное содержание частиц в воздухе'
                    },
                    legend: {
                        labels: {
                            font: {
                                family: 'Arial',
                                size: 16
                                
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                        }
                    }
                }
            });

        new Chart(ctx2, {
            type: 'line',
            data: chart2_data,
            options: {
                plugins: {
                    title: {
                        display: true,
                        color:'rgb (0, 0, 0)',
                        font: {
                            size: 20
                        },
                        text: 'Динамика изменения содержания частиц в воздухе'
                    },
                    legend: {
                        labels: {
                            font: {
                                family: 'Arial',
                                size: 16
                                
                            }
                        }
                    }
                    },
                scales: {
                    y: {
                        beginAtZero: true,
                        
                        },
                    x:{
                        offset: 100,
                        ticks: {
                            // maxTicksLimit: 5, // шаг оси х для поного пакета данных
                            maxTicksLimit: 6, // шаг оси х для  пакета данных на 3е суток

                        }
                    },
                }
            }})
            
        });
}

function onMapButtonListener(){
    document.addEventListener('click', function() {
        let button = document.getElementById('mapButtonHtml');
        button.addEventListener('click', function() {
            airQualityFetch()    
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

    ctx1.remove();
    ctx2.remove();
    ctx1 = ctx1.getContext('2d');
    ctx1.clearRect(0, 0, 800, 400);
    ctx2 = ctx2.getContext('2d');
    ctx2.clearRect(0, 0, 800, 400);
    ctx1 = createNode('canvas');
    ctx1.setAttribute('id', 'Chart1');
    ctx1.setAttribute('class', 'chart_canvas');
    append(chart1_div, ctx1);
    ctx2 = createNode('canvas');
    ctx2.setAttribute('id', 'Chart2');
    ctx2.setAttribute('class', 'chart_canvas');
    append(chart2_div, ctx2);
    
    map.setView([0, 0], 1);
    map.removeLayer(marker);
    markerCount = 0;

}

const air_pollution_dateTime_div= document.getElementById('air-pollution-dateTime');
const air_pollution_pm2_5_div= document.getElementById('air-pollution-pm2_5')
const air_pollution_pm10_div= document.getElementById('air-pollution-pm10')
let ctx1 = document.getElementById('Chart1');
let ctx2 = document.getElementById('Chart2');
const chart1_div = document.getElementById('chart1-div');
const chart2_div = document.getElementById('chart2-div');
let coordinates = [];
let map = L.map('map', {center: [0, 0], zoom: 1})
let marker = L.marker([], {draggable:true});
let markerCount = 0;
let mapButtonHtml = '<button id="mapButtonHtml">Запросить данные по координатам</button>';
let baseLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let layers = {
    'OpenStreetMaps': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    'Wikimapia': new L.tileLayer('http://{s}{hash}.wikimapia.org/?x={x}&y={y}&zoom={z}&r=7071412&type=&lng=1', {hash: function (data) {return data.x % 4 + (data.y % 4) *4;}, subdomains : 'i' , maxZoom: 20}),
    'Спутник': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
    'Подложка': L.tileLayer('https://server.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}')
}
let overlays = {
    'PM<sub>2.5</sub> + PM<sub>10</sub>': L.tileLayer('https://osm.airvisual.net/pm25_layer/{z}/{x}/{y}.webp', {
        use_norm : true,
        arrow_step : 16,
        attribution: '<div style="font-family: Arial,sans-serif; font-size: 10px; padding: 0; float: right; margin-bottom: 30px; border-width: 0px; margin-right: 10px; width: 370px; height: 27px;"><div>Содержание вредных частиц</div><div style="display: flex; -webkit-box-align: center; align-items: center; padding: 2pt 4pt; background-color: #fff; border-radius: 4pt; box-shadow: 0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24); transition: box-shadow .1s ease-out,-webkit-box-shadow .1s ease-out; -webkit-box-pack: justify; justify-content: space-between; font-size: 10px; margin-bottom: 0;"><div style="width: 360px;"><div style="box-sizing: border-box; display: flex; width: 100%; -webkit-box-pack: justify; justify-content: space-between;"><div><br>Норма</div><div>Незначительное<br>превышение</div><div>Выше<br>среднего</div><div><br>Высокое</div><div>Очень<br>высокое</div><div><br>Опасное</div></div><div class="horizontal-gradient-line" style="width: 360px; background: linear-gradient(to right, rgba(255, 255, 0, 0), rgb(156, 216, 78), rgb(250, 207, 57), rgb(249, 144, 73), rgb(246, 94, 95), rgb(160, 112, 182), rgb(160, 106, 123), rgb(116, 74, 87));-webkit-text-size-adjust: 100%;-webkit-box-direction: normal; box-sizing: border-box; border-radius: 4pt; height: 4px; opacity: .9; width: 360px; border-left: 1px solid #f2f2f2; border-bottom: 1px solid #f2f2f2;"></div></div></div></div>'}
    ),
    'NO<sub>2</sub>': L.tileLayer('https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/8514f17c4e9ab6baa55141d43703e691-ddfb898bae16f9da573e14d8b23ad52e/tiles/{z}/{x}/{y}',{
        opacity:0.4,
        attribution: '<div style="font-family: Arial,sans-serif; font-size: 10px; padding: 0; float: right; margin-bottom: 30px; border-width: 0px; margin-right: 10px; width: 370px; height: 27px;"><div>Содержание вредных частиц</div><div style="display: flex; -webkit-box-align: center; align-items: center; padding: 2pt 4pt; background-color: #fff; border-radius: 4pt; box-shadow: 0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24); transition: box-shadow .1s ease-out,-webkit-box-shadow .1s ease-out; -webkit-box-pack: justify; justify-content: space-between; font-size: 10px; margin-bottom: 0;"><div style="width: 360px;"><div style="box-sizing: border-box; display: flex; width: 100%; -webkit-box-pack: justify; justify-content: space-between;"><div><br>Норма</div><div>Незначительное<br>превышение</div><div>Выше<br>среднего</div><div><br>Высокое</div><div>Очень<br>высокое</div><div><br>Опасное</div></div><div class="horizontal-gradient-line" style="width: 360px; background: linear-gradient(to right, rgba(255, 255, 0, 0), rgb(132, 140, 255), rgb(24, 5, 249), rgb(131, 62, 134), rgb(254, 126, 0), rgb(211, 3, 0), rgb(122, 2, 2), rgb(61, 3, 3));-webkit-text-size-adjust: 100%;-webkit-box-direction: normal; box-sizing: border-box; border-radius: 4pt; height: 4px; opacity: .9; width: 360px; border-left: 1px solid #f2f2f2; border-bottom: 1px solid #f2f2f2;"></div></div></div></div>'
    }),
}
L.control.layers(layers, overlays).addTo(map);

map.on ('click', function(e) {
    // Проверка количества установленных маркеров
    if (markerCount < 1) {
        // Создание маркера и добавление его на карту
        coordinates = [e.latlng.lat, e.latlng.lng]
        marker = L.marker(coordinates).addTo(map);
        marker.bindPopup(`${coordinates}`.toUpperCase() + mapButtonHtml).openPopup();
        markerCount++;
        console.log(coordinates)
        onMapButtonListener()

    } else {
        marker.setLatLng(e.latlng);
        coordinates = [e.latlng.lat, e.latlng.lng]
        marker.bindPopup(`${coordinates}`.toUpperCase() + mapButtonHtml).openPopup();
        console.log(coordinates)
        onMapButtonListener()
    }
})

//в переменную place_name передать название любого города
document.getElementById("city_selec_form").addEventListener("submit", function(event) {
    event.preventDefault(); // Отменяем отправку формы
    
    let place_name = document.getElementById("city").value;

    const API_KEY_YANDEX = '85eaff1b-ef9e-4c11-89bc-ca01d1ae43de'
    const API_URL_GEO_DATA = `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY_YANDEX}&geocode=${place_name}&format=json`
    fetch(API_URL_GEO_DATA)
        .then(response => response.json())
        .then(function(data_yandex){
            coordinates = (data_yandex.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos).split(' ') 
            fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coordinates[1]}&longitude=${coordinates[0]}&hourly=pm10,pm2_5`)
                .then(response => response.json())
                .then(function(data) {
                    // переменная с временем/датой
                    let air_pollution_dateTime = data.hourly.time
                    // переменная с частицами pm2,5
                    let air_pollution_pm2_5 = data.hourly.pm2_5
                    // переменная с частицами pm10
                    let air_pollution_pm10 = data.hourly.pm10
                   
                    // Блок таблицы
                    // передаем отформатированные время и дату в таблицу
                    for (let i = 0; i < air_pollution_dateTime.length; i++) {
                        air_pollution_dateTime[i]= new Date (air_pollution_dateTime[i])
                        const formattedDate = air_pollution_dateTime[i].toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });            
                        let p = createNode('p');
                        let hr = createNode('hr')
                        p.innerHTML = `${formattedDate} `;                
                        append(air_pollution_dateTime_div, p);
                        append(air_pollution_dateTime_div, hr);
                        }

                    // преедаем данные по частицам pm2,5 в таблицу    
                    for (let i = 0; i < air_pollution_pm2_5.length; i++) {
                        let p = createNode('p');
                        let hr = createNode('hr')
                        p.innerHTML = `${air_pollution_pm2_5[i]} `;                
                        append(air_pollution_pm2_5_div, p);
                        append(air_pollution_pm2_5_div, hr);
                        }

                    // преедаем данные по частицам pm10 в таблицу
                    for (let i = 0; i < air_pollution_pm10.length; i++) {
                        let p = createNode('p');
                        let hr = createNode('hr')
                        p.innerHTML = `${air_pollution_pm10[i]} `;                
                        append(air_pollution_pm10_div, p);
                        append(air_pollution_pm10_div, hr);
                        }
                        
            //Блок дэшборда
                //Первый график
                    // Готовим исходную переменную с временем и датой, получаем числа для первого графика
                    let chart1_dateSetArrey = [];
                    let uniqueDates = {}; // объект для отслеживания уникальных дат
                    for (let i = 0; i < 72; i++) {
                        air_pollution_dateTime[i] = new Date(air_pollution_dateTime[i]);
                        const day = air_pollution_dateTime[i].getDate();
                        const month = air_pollution_dateTime[i].getMonth() + 1;
                        //собираем число в формате "дд.мм"
                        const formattedDate = air_pollution_dateTime[i].toLocaleString('ru', { weekday: 'short', day: 'numeric', month: 'long' });
                        // Проверяем, была ли уже встречена эта дата
                        if (!uniqueDates[formattedDate]) {
                            chart1_dateSetArrey.push(formattedDate);
                            uniqueDates[formattedDate] = true; // отмечаем дату как встреченную
                        }
                    }
                    
                    //готовим массив со средними значениями на каждуйю дату для частиц 2,5pm
                    let blockSize = 24; // данные за 24 часа
                    let averages_pm2_5 = [];

                    for (let i = 0; i < air_pollution_pm2_5.length; i += blockSize) {
                        let sum_pm2_5 = 0;
                        let count_pm2_5 = 0;
                        var minValue = null;

                        for (var j = i; j < i + blockSize && j < air_pollution_pm2_5.length; j++) {
                            if (air_pollution_pm2_5[j] !== null && air_pollution_pm2_5[j] !== 0) {
                            sum_pm2_5 += air_pollution_pm2_5[j];
                            count_pm2_5++;
                        
                                if (minValue === null || air_pollution_pm2_5[j] < minValue) {
                                    minValue = air_pollution_pm2_5[j];
                                }
                            }
                        }
                        
                        if (count_pm2_5 > 0) {
                            let average_pm2_5 = sum_pm2_5 / count_pm2_5;
                        
                            if (average_pm2_5 < minValue) {
                                averages_pm2_5.push(minValue);
                            } else {
                                averages_pm2_5.push(average_pm2_5);
                            }
                        }
                    }                  
                    
                    //готовим массив со средними значениями на каждуйю дату для частиц 10pm
                    let averages_pm10 = [];

                    for (let i = 0; i < air_pollution_pm10.length; i += blockSize) {
                        let sum_pm10 = 0;
                        let count_pm10 = 0;
                        var minValue = null;

                        for (var j = i; j < i + blockSize && j < air_pollution_pm10.length; j++) {
                            if (air_pollution_pm10[j] !== null && air_pollution_pm10[j] !== 0) {
                            sum_pm10 += air_pollution_pm10[j];
                            count_pm10++;
                        
                                if (minValue === null || air_pollution_pm10[j] < minValue) {
                                    minValue = air_pollution_pm10[j];
                                }
                            }
                        }
                        
                        if (count_pm10 > 0) {
                            let average_pm10 = sum_pm10 / count_pm10;
                        
                            if (average_pm10 < minValue) {
                                averages_pm10.push(minValue);
                            } else {
                                averages_pm10.push(average_pm10);
                            }
                        }
                    }

                    // Собираем дата-сет для первого графика
                    const chart1_data = {
                        labels: chart1_dateSetArrey,
                        datasets: [{
                            type: 'bar',
                              label: 'pm2,5',
                              data: averages_pm2_5,
                              borderColor: 'rgb(255, 99, 132)',
                              backgroundColor: 'rgba(255, 99, 132, 0.2)'
                        }, {
                            type: 'bar',
                              label: 'pm10',
                              data: averages_pm10,
                              borderColor: 'rgb(15, 99, 132)',
                              backgroundColor: 'rgba(15, 99, 132, 0.2)'
                        }]
                    };
                    
                //Второй график
                    // Готовим исходную переменную с временем и датой, получаем числа для первого графика
                    let chart2_dateSetArrey = [];
                    for (let i = 0; i < 72; i++) {
                        air_pollution_dateTime[i] = new Date(air_pollution_dateTime[i]);
                        const day = air_pollution_dateTime[i].getDate();
                        const month = air_pollution_dateTime[i].getMonth() + 1;
                        const hour = air_pollution_dateTime[i].getHours();
                        //собираем число в формате "ЧЧ дд.мм"
                        const formattedDate = hour.toString().padStart(2, "0") + ":00,\n" + day.toString().padStart(2, "0") + "." + month.toString().padStart(2, "0");
                        
                        chart2_dateSetArrey.push(formattedDate);
                           
                        }
                    
                    // Собираем дата-сет для второго графика
                    const chart2_data = {
                        labels: chart2_dateSetArrey,
                        datasets: [{
                            type: 'line',
                            label: 'pm2,5',
                            data: air_pollution_pm2_5,
                            fill: false,
                            borderColor: 'rgb(54, 162, 235)'
                        }, {
                            type: 'line',
                            label: 'pm10',
                            data: air_pollution_pm10,
                            borderColor: 'rgb(54, 162, 11)'
                        }]
                      };

                    Chart.defaults.font.size = 14;
                    Chart.defaults.color = '#000';
  
                    // инициализируем графики
                    new Chart(ctx1, {
                        type: 'bar',
                        data: chart1_data,
                        options: {
                            plugins: {
                                title: {
                                    display: true,
                                    color:'rgb (0, 0, 0)',
                                    font: {
                                        size: 20
                                    },
                                    text: 'Среднесуточное содержание частиц в воздухе'
                                },
                                legend: {
                                    labels: {
                                        font: {
                                            family: 'Arial',
                                            size: 16
                                            
                                        }
                                    }
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true
                                    }
                                }
                            }
                        });

                    new Chart(ctx2, {
                        type: 'line',
                        data: chart2_data,
                        options: {
                            plugins: {
                                title: {
                                    display: true,
                                    color:'rgb (0, 0, 0)',
                                    font: {
                                        size: 20
                                    },
                                    text: 'Динамика изменения содержания частиц в воздухе'
                                },
                                legend: {
                                    labels: {
                                        font: {
                                            family: 'Arial',
                                            size: 16
                                            
                                        }
                                    }
                                }
                                },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    
                                    },
                                x:{
                                    offset: 100,
                                    ticks: {
                                        maxTicksLimit: 6, // шаг оси х для  пакета данных на 3е суток

                                    }
                                },
                            }
                        }})
                        
                    });
            
            map.setView([coordinates[1], coordinates[0]], 10);
            
            marker = L.marker([coordinates[1], coordinates[0]])
                .bindPopup(`${place_name}`.toUpperCase())
                .addTo(map);
            

            })
        })  

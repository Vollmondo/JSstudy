function createNode(element) {
    return document.createElement(element);
}
function append(parent, el) {
    return parent.appendChild(el);
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

}



//const div = document.getElementById('air-pollution');
const air_pollution_dateTime_div= document.getElementById('air-pollution-dateTime');
const air_pollution_pm2_5_div= document.getElementById('air-pollution-pm2_5')
const air_pollution_pm10_div= document.getElementById('air-pollution-pm10')
let ctx1 = document.getElementById('Chart1');
let ctx2 = document.getElementById('Chart2');
const chart1_div = document.getElementById('chart1-div');
const chart2_div = document.getElementById('chart2-div');
let map = L.map('map', {center: [0, 0], zoom: 1})
let marker = L.marker([], {draggable:true});
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

//в переменную place_name передать название любого города
document.getElementById("city_selec_form").addEventListener("submit", function(event) {
    event.preventDefault(); // Отменяем отправку формы
    
    let place_name = document.getElementById("city").value;
    //console.log(place_name)
    const API_KEY_YANDEX = '85eaff1b-ef9e-4c11-89bc-ca01d1ae43de'
    const API_URL_GEO_DATA = `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY_YANDEX}&geocode=${place_name}&format=json`
    fetch(API_URL_GEO_DATA)
        .then(response => response.json())
        //.then(response => console.log(response.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos))
        .then(function(data_yandex){
            let coordinates = (data_yandex.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos).split(' ')
            //console.log(coordinates)
            
            const API_OPEN_METEO = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coordinates[1]}&longitude=${coordinates[0]}&hourly=pm10,pm2_5`
            fetch(API_OPEN_METEO)
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

            map.setView([coordinates[1], coordinates[0]], 10);
            
            marker = L.marker([coordinates[1], coordinates[0]])
                .bindPopup(`${place_name}`.toUpperCase())
                .addTo(map);
            

            })
        })  

        /*.catch(function(error) {
            console.log(error);
        });*/

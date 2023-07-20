/*
1. В файле scripts.js 
```
const API_KEY_YANDEX = '85eaff1b-ef9e-4c11-89bc-ca01d1ae43de'
const API_URL_GEO_DATA = `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY_YANDEX}&geocode=${place_name}&format=json`

const API_OPEN_METEO = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coordinates[0]}&longitude=${coordinates[1]}&hourly=pm10,pm2_5`
```
Используя url API: 
для получение координат (fetch) города API_URL_GEO_DATA - в переменную place_name передать название любого города.
получить координаты широты и долготы в ответе, которые расположены в объекте 
data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos

Разделить их на отдельные параметры, используя метод работы с созданием массива из строки 
(точнее посмотрите документацию по методам работы с массивом, который подойдет)

И только при наличии данных координат сделать fetch  запрос по url API_URL_GEO_DATA, 
в запрос которого нужно передать полученые ранее координаты широты и долготы.
// “широта, долгота” — Lat, Lng

Результат полученной информации о загрязнении (время : количество частиц pm10 : количество частиц pm2_5) 
вывести в браузере на странице, используя подход создания тегов (createNode) из лекционного материала.
```
*/

function createNode(element) {
    return document.createElement(element);
}
function append(parent, el) {
    return parent.appendChild(el);
}

const div = document.getElementById('air-pollution');
const air_pollution_dateTime_div= document.getElementById('air_pollution_dateTime');
const air_pollution_pm2_5_div= document.getElementById('air_pollution_pm2_5')



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
            console.log(coordinates)
            const API_OPEN_METEO = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coordinates[1]}&longitude=${coordinates[0]}&hourly=pm10,pm2_5`
            fetch(API_OPEN_METEO)
            .then(response => response.json())
            .then(function(data) {
                //let air_pollution = data.hourly;
                let air_pollution_dateTime = data.hourly.time
                return air_pollution_dateTime.map(function(air_pollution_dateTime_el){
                    let p = createNode('p');
                    let hr = createNode('hr')
                    p.innerHTML = `${air_pollution_dateTime_el} `;                
                    append(air_pollution_dateTime_div, p);
                    append(air_pollution_dateTime_div, hr);
                });
                let air_pollution_pm2_5 = data.hourly.pm2_5
                return air_pollution_pm2_5.map(function(air_pollution_pm2_5_el){
                    let p = createNode('p');
                    let hr = createNode('hr')
                    p.innerHTML = `${air_pollution_pm2_5_el} `;                
                    append(air_pollution_pm2_5_div, p);
                    append(air_pollution_pm2_5_div, hr);
                });
            })
        })
    })
                /*//for (let i = 0; i < air_pollution.pm2_5.length; i++) {
                    //console.log(`${air_pollution.pm2_5[i]} : ${air_pollution.pm10[i]} : ${air_pollution.time[i]}`)
                    //let li = createNode('li');
                    let p = createNode('p');
                    let hr = createNode('hr')
                    //p.innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${air_pollution.time[i]} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${air_pollution.pm2_5[i]} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${air_pollution.pm10[i] ? air_pollution.pm10[i] : " "}`;                
                    append(div, p);
                    append(div, hr);
                }})
        
                  
            
        
        .catch(function(error) {
            console.log(error);
        });
  });

})


/*
    
        fetch(API_OPEN_METEO)
        .then(resp_meteo => resp_meteo.json())
        //.then(resp_meteo => console.log(resp_meteo.hourly.time))
        //.then(resp_meteo => console.log(resp_meteo.hourly.pm10))
        //.then(resp_meteo => console.log(resp_meteo.hourly.pm2_5))
        .then(resp_meteo  => resp_meteo.hourly.time.map(time => {
            const time_html = document.getElementById('time_html')
            let li = document.createElement('li')
            let span = document.createElement('span')
            span.innerHTML = ${time}
            li.appendChild(span)
            time_html.appendChild(li)
            return resp_meteo
        }))
        return resp_city
    })
*/
//import { normalizeLongitude } from "./meteo/long_normalize.js";

let meteo_data = [];

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
            meteo_chart ()
            map.setView([coordinates[0], coordinates[1]], 10);
        });
    });
}

function meteo_chart(){
    
    Highcharts.setOptions({
        lang: {
            months: [
                'Января', 'Февраля', 'Марта', 'Апреля',
                'Мая', 'Июня', 'Июля', 'Августа',
                'Сентября', 'Октября', 'Ноября', 'Декабря'
            ],
            weekdays: [
                'Вс', 'Пн', 'Вт', 'Ср',
                'Чт', 'Пт', 'Сб'
            ]
        }
    });
    Meteogram.dictionary = {
        clearsky: {
            symbol: '01',
            text: 'Ясно'
        },
        fair: {
            symbol: '02',
            text: 'Малооблачно'
        },
        partlycloudy: {
            symbol: '03',
            text: 'Облачно'
        },
        cloudy: {
            symbol: '04',
            text: 'Пасмурно'
        },
        lightrainshowers: {
            symbol: '40',
            text: 'Легкие&nbsp;ливневые&nbsp;дожди'
        },
        rainshowers: {
            symbol: '05',
            text: 'Ливневые&nbsp;дожди'
        },
        heavyrainshowers: {
            symbol: '41',
            text: 'Сильный&nbsp;ливень'
        },
        lightrainshowersandthunder: {
            symbol: '24',
            text: 'Легкий&nbsp;ливень&nbsp;с&nbsp;грозой'
        },
        rainshowersandthunder: {
            symbol: '06',
            text: 'Ливень&nbsp;с&nbsp;грозой'
        },
        heavyrainshowersandthunder: {
            symbol: '25',
            text: 'Сильный&nbsp;ливень&nbsp;с&nbsp;грозой'
        },
        lightsleetshowers: {
            symbol: '42',
            text: 'Легкий&nbsp;ливень&nbsp;с&nbsp;мокрым&nbsp;снегом'
        },
        sleetshowers: {
            symbol: '07',
            text: 'Ливень&nbsp;с&nbsp;мокрым&nbsp;снегом'
        },
        heavysleetshowers: {
            symbol: '43',
            text: 'Сильный&nbsp;ливень&nbsp;с&nbsp;мокрым&nbsp;снегом'
        },
        lightsleetshowersandthunder: {
            symbol: '26',
            text: 'Легкий&nbsp;ливень<br>с&nbsp;мокрым&nbsp;снегом&nbsp;и&nbsp;грозой'
        },
        sleetshowersandthunder: {
            symbol: '20',
            text: 'Ливень&nbsp;с&nbsp;мокрым&nbsp;снегом<br>и&nbsp;грозой'
        },
        heavysleetshowersandthunder: {
            symbol: '27',
            text: 'Сильный&nbsp;ливень&nbsp;с&nbsp;мокрым&nbsp;снегом<br>и&nbsp;грозой'
        },
        lightsnowshowers: {
            symbol: '44',
            text: 'Легкий&nbsp;снегопад'
        },
        snowshowers: {
            symbol: '08',
            text: 'Снегопад'
        },
        heavysnowshowers: {
            symbol: '45',
            text: 'Сильный&nbsp;снегопад'
        },
        lightsnowshowersandthunder: {
            symbol: '28',
            text: 'Легкий&nbsp;снегопад&nbsp;с&nbsp;грозой'
        },
        snowshowersandthunder: {
            symbol: '21',
            text: 'Снегопад&nbsp;с&nbsp;грозой'
        },
        heavysnowshowersandthunder: {
            symbol: '29',
            text: 'Сильный&nbsp;снегопад&nbsp;с&nbsp;грозой'
        },
        lightrain: {
            symbol: '46',
            text: 'Легкий&nbsp;дождь'
        },
        rain: {
            symbol: '09',
            text: 'Дождь'
        },
        heavyrain: {
            symbol: '10',
            text: 'Сильный&nbsp;дождь'
        },
        lightrainandthunder: {
            symbol: '30',
            text: 'Легкий&nbsp;дождь&nbsp;с&nbsp;грозой'
        },
        rainandthunder: {
            symbol: '22',
            text: 'Дождь&nbsp;с&nbsp;грозой'
        },
        heavyrainandthunder: {
            symbol: '11',
            text: 'Сильный&nbsp;дождь&nbsp;с&nbsp;грозой'
        },
        lightsleet: {
            symbol: '47',
            text: 'Легкий&nbsp;мокрый&nbsp;снег'
        },
        sleet: {
            symbol: '12',
            text: 'Мокрый&nbsp;снег'
        },
        heavysleet: {
            symbol: '48',
            text: 'Сильный&nbsp;мокрый&nbsp;снег'
        },
        lightsleetandthunder: {
            symbol: '31',
            text: 'Легкий&nbsp;мокрый&nbsp;снег&nbsp;с&nbsp;грозой'
        },
        sleetandthunder: {
            symbol: '23',
            text: 'Мокрый&nbsp;снег&nbsp;с&nbsp;грозой'
        },
        heavysleetandthunder: {
            symbol: '32',
            text: 'Сильный&nbsp;мокрый&nbsp;снег&nbsp;с&nbsp;грозой'
        },
        lightsnow: {
            symbol: '49',
            text: 'Легкий&nbsp;снег'
        },
        snow: {
            symbol: '13',
            text: 'Снег'
        },
        heavysnow: {
            symbol: '50',
            text: 'Сильный&nbsp;снег'
        },
        lightsnowandthunder: {
            symbol: '33',
            text: 'Легкий&nbsp;снег&nbsp;с&nbsp;грозой'
        },
        snowandthunder: {
            symbol: '14',
            text: 'Снег&nbsp;с&nbsp;грозой'
        },
        heavysnowandthunder: {
            symbol: '34',
            text: 'Силный&nbsp;снег&nbsp;с&nbsp;грозой'
        },
        fog: {
            symbol: '15',
            text: 'Туман'
        }
    };
    function Meteogram(json, meteo) {
        // Parallel arrays for the chart data, these are populated as the JSON file
        // is loaded
        this.symbols = [];
        this.precipitations = [];
        this.precipitationsError = []; // Only for some data sets
        this.winds = [];
        this.temperatures = [];
        this.pressures = [];

        // Initialize
        this.json = json;
        this.meteo = meteo;

        // Run
        this.parseYrData();
    }
    
    Meteogram.prototype.drawWeatherSymbols = function (chart) {
        meteo_data = chart.series[0].data
        meteo_data.forEach((point, i) => {
            if (this.resolution > 36e5 || i % 2 === 0) {

                const [symbol, specifier] = this.symbols[i].split('_'),
                    icon = Meteogram.dictionary[symbol].symbol +
                        ({ day: 'd', night: 'n' }[specifier] || '');

                if (Meteogram.dictionary[symbol]) {
                    chart.renderer
                        .image(
                            'https://cdn.jsdelivr.net/gh/nrkno/yr-weather-symbols' +
                                `@8.0.1/dist/svg/${icon}.svg`,
                            point.plotX + chart.plotLeft - 8,
                            point.plotY + chart.plotTop - 30,
                            30,
                            30
                        )
                        .attr({
                            zIndex: 5
                        })
                        .add();
                } else {
                    console.log(symbol);
                }
            }
        });
        return meteo_data
    };
    

    Meteogram.prototype.drawBlocksForWindArrows = function (chart) {
        const xAxis = chart.xAxis[0];

        for (
            let pos = xAxis.min, max = xAxis.max, i = 0;
            pos <= max + 36e5; pos += 36e5,
            i += 1
        ) {

            // Get the X position
            const isLast = pos === max + 36e5,
                x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);

            // Draw the vertical dividers and ticks
            const isLong = this.resolution > 36e5 ?
                pos % this.resolution === 0 :
                i % 2 === 0;

            chart.renderer
                .path([
                    'M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
                    'L', x, chart.plotTop + chart.plotHeight + 32,
                    'Z',
                ])
                .attr({
                    stroke: chart.options.chart.plotBorderColor,
                    'stroke-width': 1
                })
                .add();
        }

        // Center items in block
        chart.get('windbarbs').markerGroup.attr({
            translateX: chart.get('windbarbs').markerGroup.translateX + 8
        });

    };


    /**
     * Build and return the Highcharts options structure
     */
    Meteogram.prototype.getChartOptions = function () {
        return {
            chart: {
                renderTo: this.meteo,
                marginBottom: 70,
                marginRight: 50,
                marginTop: 70,
                plotBorderWidth: 1,
                height: 350,
                backgroundColor: '#ffffff',
                alignTicks: false,
                scrollablePlotArea: {
                    minWidth: 720
                }
            },

            defs: {
                patterns: [{
                    id: 'precipitation-error',
                    path: {
                        d: [
                            'M', 3.3, 0, 'L', -6.7, 10,
                            'M', 6.7, 0, 'L', -3.3, 10,
                            'M', 10, 0, 'L', 0, 10,
                            'M', 13.3, 0, 'L', 3.3, 10,
                            'M', 16.7, 0, 'L', 6.7, 10
                        ].join(' '),
                        stroke: '#68CFE8',
                        strokeWidth: 1
                    }
                }]
            },

            title: {
                text: ' ',
                align: 'left',
                style: {
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                }
            },

            

            tooltip: {
                shared: true,
                useHTML: true,
                headerFormat:
                    '<small>{point.x:%A, %e %B, %H:%M} - {point.point.to:%H:%M}</small><br>' +
                    '<b>{point.point.symbolName}</b><br>'

            },

            xAxis: [{ // Bottom X axis
                type: 'datetime',
                tickInterval: 2 * 36e5, // two hours
                minorTickInterval: 36e5, // one hour
                tickLength: 0,
                gridLineWidth: 1,
                gridLineColor: 'rgba(128, 128, 128, 0.1)',
                startOnTick: false,
                endOnTick: false,
                minPadding: 0,
                maxPadding: 0,
                offset: 30,
                showLastLabel: true,
                labels: {
                    format: '{value:%H}',
                },
                crosshair: true
            }, { // Top X axis
                linkedTo: 0,
                type: 'datetime',
                tickInterval: 24 * 3600 * 1000,
                labels: {
                    format: '{value:<span style="font-size: 18px; font-weight: bold">%A</span> %e %B }',
                    align: 'left',
                    x: 10,
                    y: 10
                },
                opposite: true,
                tickLength: 30,
                gridLineWidth: 1
            }],
            

            yAxis: [{ // temperature axis
                title: {
                    text: null
                },
                labels: {
                    format: '{value}°',
                    style: {
                        fontSize: '10px'
                    },
                    x: -3
                },
                plotLines: [{ // zero plane
                    value: 0,
                    color: '#BBBBBB',
                    width: 1,
                    zIndex: 2
                }],
                maxPadding: 0.3,
                minRange: 8,
                tickInterval: 1,
                gridLineColor: 'rgba(128, 128, 128, 0.1)'

            }, { // precipitation axis
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                },
                gridLineWidth: 0,
                tickLength: 0,
                minRange: 10,
                min: 0

            }, { // Air pressure
                allowDecimals: false,
                title: { // Title on top of axis
                    text: 'кПа',
                    offset: 0,
                    align: 'high',
                    rotation: 0,
                    style: {
                        fontSize: '10px',
                        color: Highcharts.getOptions().colors[2]
                    },
                    textAlign: 'left',
                    x: 3
                },
                labels: {
                    style: {
                        fontSize: '8px',
                        color: Highcharts.getOptions().colors[2]
                    },
                    y: 2,
                    x: 3
                },
                gridLineWidth: 0,
                opposite: true,
                showLastLabel: false
            }],

            legend: {
                enabled: false
            },

            plotOptions: {
                series: {
                    pointPlacement: 'between'
                }
            },


            series: [{
                name: 'Температура',
                data: this.temperatures,
                type: 'spline',
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                },
                tooltip: {
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                        '{series.name}: <b>{point.y}°C</b><br/>'
                },
                zIndex: 1,
                color: '#FF3333',
                negativeColor: '#48AFE8'
            }, {
                name: 'Осадки',
                data: this.precipitationsError,
                type: 'column',
                color: 'url(#precipitation-error)',
                yAxis: 1,
                groupPadding: 0,
                pointPadding: 0,
                tooltip: {
                    valueSuffix: ' мм',
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                        '{series.name}: <b>{point.minvalue} мм - {point.maxvalue} мм</b><br/>'
                },
                grouping: false,
                dataLabels: {
                    enabled: this.hasPrecipitationError,
                    filter: {
                        operator: '>',
                        property: 'maxValue',
                        value: 0
                    },
                    style: {
                        fontSize: '8px',
                        color: 'gray'
                    }
                }
            }, {
                name: 'Осадки',
                data: this.precipitations,
                type: 'column',
                color: '#68CFE8',
                yAxis: 1,
                groupPadding: 0,
                pointPadding: 0,
                grouping: false,
                dataLabels: {
                    enabled: !this.hasPrecipitationError,
                    filter: {
                        operator: '>',
                        property: 'y',
                        value: 0
                    },
                    style: {
                        fontSize: '8px',
                        color: '#666'
                    }
                },
                tooltip: {
                    valueSuffix: ' мм'
                }
            }, {
                name: 'Атмосферное&nbsp;давление',
                color: Highcharts.getOptions().colors[2],
                data: this.pressures,
                marker: {
                    enabled: false
                },
                shadow: false,
                tooltip: {
                    valueSuffix: ' кПа'
                },
                dashStyle: 'shortdot',
                yAxis: 2
            }, {
                name: 'Ветер',
                type: 'windbarb',
                id: 'windbarbs',
                color: Highcharts.getOptions().colors[1],
                lineWidth: 1.5,
                data: this.winds,
                vectorLength: 18,
                yOffset: -15,
                tooltip: {
                    valueSuffix: ' м/с'
                }
            }]
        };
    };

    /**
     * Post-process the chart from the callback function, the second argument
     * Highcharts.Chart.
     */
    Meteogram.prototype.onChartLoad = function (chart) {

        this.drawWeatherSymbols(chart);
        this.drawBlocksForWindArrows(chart);

    };

    /**
     * Create the chart. This function is called async when the data file is loaded
     * and parsed.
     */
    Meteogram.prototype.createChart = function () {
        this.chart = new Highcharts.Chart(this.getChartOptions(), chart => {
            this.onChartLoad(chart);
        });

    };
    
    Meteogram.prototype.error = function () {
        document.getElementById('loading').innerHTML =
            '<i class="fa fa-frown-o"></i> Failed loading data, please try again later';
    };

    /**
     * Handle the data. This part of the code is not Highcharts specific, but deals
     * with yr.no's specific data format
     */
    Meteogram.prototype.parseYrData = function () {
    
        let pointStart;

        if (!this.json) {
            return this.error();
        }

        // Loop over hourly (or 6-hourly) forecasts
        this.json.properties.timeseries.forEach((node, i) => {
            const timezone = 18000000;
            const x = Date.parse(node.time) + timezone;
            const nextHours = node.data.next_1_hours || node.data.next_6_hours;
            const symbolCode = nextHours && nextHours.summary.symbol_code;
            const to = node.data.next_1_hours ? x + 36e5 : x + 6 * 36e5;
            
            if (to > pointStart + 68 * 36e5 ) {
                return;
            }

            // Populate the parallel arrays
            this.symbols.push(nextHours.summary.symbol_code);

            this.temperatures.push({
                x,
                y: node.data.instant.details.air_temperature,
                // custom options used in the tooltip formatter
                to,
                symbolName: Meteogram.dictionary[
                    symbolCode.replace(/_(day|night)$/, '')
                ].text
            });

            this.precipitations.push({
                x,
                y: nextHours.details.precipitation_amount
            });

            if (i % 2 === 0) {
                this.winds.push({
                    x,
                    value: node.data.instant.details.wind_speed,
                    direction: node.data.instant.details.wind_from_direction
                });
            }

            this.pressures.push({
                x,
                y: node.data.instant.details.air_pressure_at_sea_level
            });

            if (i === 0) {
                pointStart = (x + to) / 2;
            }
        });

        // Create the chart when the data is loaded
        this.createChart();
    };
 
    location.hash = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${coordinates[1]}&lon=${coordinates[0]}`;

    const url = location.hash.substr(1);
    Highcharts.ajax({
        url,
        dataType: 'json',
        success: json => {
            window.meteogram = new Meteogram(json, 'meteo');
        },
        error: Meteogram.prototype.error,
        headers: {
            'Content-Type': 'text/plain'
        }
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
    
    coordinates = [];

    map.setView([0, 0], 1);
    map.removeLayer(marker);
    markerCount = 0;
    meteo_data = [];
    let meteoDiv = document.getElementById("meteo");
    meteoDiv.innerHTML = '';
    document.getElementById("city").value = null;
}

function addLabels(coordinates) {
    let labels = [];

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

/* function normalizeLongitude(longitude) {
    var normalizedLongitude = longitude % 360;
    if (normalizedLongitude > 180) {
      normalizedLongitude -= 360;
    } else if (normalizedLongitude < -180) {
      normalizedLongitude += 360;
    }
    return normalizedLongitude;
  } */

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
    //'Подложка': L.tileLayer('https://server.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}')
}
let overlays = {
    'PM<sub>2.5</sub> + PM<sub>10</sub>': L.tileLayer('https://osm.airvisual.net/pm25_layer/{z}/{x}/{y}.webp', {
        use_norm : true,
        arrow_step : 16,
        attribution: '<div style="font-family: Arial,sans-serif; font-size: 10px; padding: 0; float: right; margin-bottom: 30px; border-width: 0px; margin-right: 10px; width: 370px; height: 27px;"><div>Содержание вредных частиц</div><div style="display: flex; -webkit-box-align: center; align-items: center; padding: 2pt 4pt; background-color: #fff; border-radius: 4pt; box-shadow: 0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24); transition: box-shadow .1s ease-out,-webkit-box-shadow .1s ease-out; -webkit-box-pack: justify; justify-content: space-between; font-size: 10px; margin-bottom: 0;"><div style="width: 360px;"><div style="box-sizing: border-box; display: flex; width: 100%; -webkit-box-pack: justify; justify-content: space-between;"><div><br>Норма</div><div>Незначительное<br>превышение</div><div>Выше<br>среднего</div><div><br>Высокое</div><div>Очень<br>высокое</div><div><br>Опасное</div></div><div class="horizontal-gradient-line" style="width: 360px; background: linear-gradient(to right, rgba(255, 255, 0, 0), rgb(156, 216, 78), rgb(250, 207, 57), rgb(249, 144, 73), rgb(246, 94, 95), rgb(160, 112, 182), rgb(160, 106, 123), rgb(116, 74, 87));-webkit-text-size-adjust: 100%;-webkit-box-direction: normal; box-sizing: border-box; border-radius: 4pt; height: 4px; opacity: .9; width: 360px; border-left: 1px solid #f2f2f2; border-bottom: 1px solid #f2f2f2;"></div></div></div></div>'}
    ),
    /*'NO<sub>2</sub>': L.tileLayer('https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/8514f17c4e9ab6baa55141d43703e691-ddfb898bae16f9da573e14d8b23ad52e/tiles/{z}/{x}/{y}',{
        opacity:0.4,
        attribution: '<div style="font-family: Arial,sans-serif; font-size: 10px; padding: 0; float: right; margin-bottom: 30px; border-width: 0px; margin-right: 10px; width: 370px; height: 27px;"><div>Содержание вредных частиц</div><div style="display: flex; -webkit-box-align: center; align-items: center; padding: 2pt 4pt; background-color: #fff; border-radius: 4pt; box-shadow: 0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24); transition: box-shadow .1s ease-out,-webkit-box-shadow .1s ease-out; -webkit-box-pack: justify; justify-content: space-between; font-size: 10px; margin-bottom: 0;"><div style="width: 360px;"><div style="box-sizing: border-box; display: flex; width: 100%; -webkit-box-pack: justify; justify-content: space-between;"><div><br>Норма</div><div>Незначительное<br>превышение</div><div>Выше<br>среднего</div><div><br>Высокое</div><div>Очень<br>высокое</div><div><br>Опасное</div></div><div class="horizontal-gradient-line" style="width: 360px; background: linear-gradient(to right, rgba(255, 255, 0, 0), rgb(132, 140, 255), rgb(24, 5, 249), rgb(131, 62, 134), rgb(254, 126, 0), rgb(211, 3, 0), rgb(122, 2, 2), rgb(61, 3, 3));-webkit-text-size-adjust: 100%;-webkit-box-direction: normal; box-sizing: border-box; border-radius: 4pt; height: 4px; opacity: .9; width: 360px; border-left: 1px solid #f2f2f2; border-bottom: 1px solid #f2f2f2;"></div></div></div></div>'
    }),*/
}
L.control.layers(layers, overlays).addTo(map);

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
        onMapButtonListener()
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
            coordinates = [coordinates[1], coordinates[0]] 
            meteo_chart ()
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
            
            map.setView([coordinates[0], coordinates[1]], 10);
            
            marker = L.marker([coordinates[0], coordinates[1]])
                .bindPopup(`${place_name}`.toUpperCase())
                .addTo(map);
            })
        })  
        
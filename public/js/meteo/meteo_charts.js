import { coordinates } from "../scripts.js";

let meteo_data = [];


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

    meteo_data = [];
    let meteoDiv = document.getElementById("meteo");
    meteoDiv.innerHTML = '';
}

document.getElementById("clearbutton").addEventListener('click', () => clearForm())


export {meteo_chart}
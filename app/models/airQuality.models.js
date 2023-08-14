// Определение модели данных
const airQualityData = {
    date: '',
    pm2_5: '',
    pm10: '',
  };
  
  // Получение значений из тегов <p> и заполнение модели
  const dateElements = document.getElementsByClassName('air-pollution-dateTime');
  const pm2_5Elements = document.getElementsByClassName('air-pollution-pm2_5');
  const pm10Elements = document.getElementsByClassName('air-pollution-pm10');
  
  if (dateElements.length > 0) {
    airQualityData.dateElements = dateElements[0].textContent;
  }
  
  if (pm2_5Elements.length > 0) {
    airQualityData.pm2_5Elements = pm2_5Elements[0].textContent;
  }
  
  if (pm10Elements.length > 0) {
    airQualityData.pm10Elements = pm10Elements[0].textContent;
  }
  
  // Заполните остальные поля модели
  
  // Отправка данных пост запросом на сервер
  axios.post('/api/data', airQualityData)
    .then(response => {
      // Обработка успешного ответа от сервера
      console.log(response.data);
    })
    .catch(error => {
      // Обработка ошибки при отправке запроса
      console.error(error);
    });
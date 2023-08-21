(function() {
  const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const user_name = document.getElementById("user_name").value;
  const user_pass = document.getElementById("user_pass").value;
  const user_auth_data = {
      user_name: user_name,
      user_pass: user_pass
  };
  
  const jsonData = JSON.stringify(user_auth_data);
  console.log(jsonData)

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user_auth_data)
  })
  .then(response => response.json())
  .then(data => {
    // Обработка ответа от сервера
    console.log(data);
  })
  .catch(error => {
    // Обработка ошибок
    console.error(error);
  });

  document.querySelector(".cube").style.transform = 'rotateX(90deg) translateZ(-110px)';

  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 300;
  canvas.height = 345;
  const x = canvas.width / 2;
  const y = canvas.height / 2;

  const radius = 100;
  const endPercent = 102;
  let curPerc = 0;
  const circ = Math.PI * 2;
  const quart = Math.PI / 2;
  const green = '#17BD96'

  context.lineWidth = 5;
  context.fillStyle = green;
  context.strokeStyle = green;

  function animate(current) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.arc(x, y, radius, -(quart), ((circ) * current) - quart, false);
    context.stroke();
    curPerc+=2;
    if (curPerc < endPercent) {
      requestAnimationFrame(function() {
        animate(curPerc / 100);
      });
    } else {
      document.querySelector("#fill").classList.add("animate");
    }
  }

  setTimeout(animate, 1000);
});

window.addEventListener('webkitAnimationEnd', function(event) { 
  document.querySelector(".success").style.opacity = 1;
});
  
  

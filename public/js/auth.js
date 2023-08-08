(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
  })();
  
  $('#loginForm').submit(function(e) {
    e.preventDefault();
    $(".cube").css({
      transform: 'rotateX(90deg) translateZ(-110px)'
    });
  
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 345;
    var x = canvas.width / 2;
    var y = canvas.height / 2;
  
    var radius = 100;
    var endPercent = 102;
    var curPerc = 0;
    var circ = Math.PI * 2;
    var quart = Math.PI / 2;
    var green = '#17BD96'
    
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
        $("#fill").addClass("animate");
      }
    }
    
    setTimeout(animate, 1000);
  });
  
  window.addEventListener('webkitAnimationEnd', function(event) { 
    $(".success").css({'opacity': 1})
  });

  /*var user_name = document.getElementById("user_name").value;
  var user_pass = document.getElementById("user_pass").value;
  var user_auth_data = {
      user_name: user_name,
      user_pass: user_pass
  };
  
  var jsonData = JSON.stringify(user_auth_data);
  console.log(jsonData)*/
  

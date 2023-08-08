document.getElementById('login-button').addEventListener('click', function() {
    var loginButton = document.getElementById('login-button');
    var container = document.getElementById('auth-container');
    
    loginButton.style.opacity = '0';
    container.style.opacity = '0';
    container.style.transform = 'scale(0)';
    
    setTimeout(function() {
        container.style.display = 'block';
        container.style.transition = 'opacity 0.4s, transform 0.1s';
        container.style.opacity = '1';
        container.style.transform = 'scale(1)';
    }, 500);

});

document.querySelector('#auth-container .close-btn').addEventListener('click', function() {
    var container = document.getElementById('auth-container');
    var loginButton = document.getElementById('login-button');
    
    container.style.transform = 'scale(1)';
    container.style.transition = 'transform 0.1s';
    
    setTimeout(function() {
        container.style.transition = 'opacity 0.8s';
        container.style.opacity = '0';
        
        setTimeout(function() {
            container.style.display = 'none';
            loginButton.style.opacity = '1';
        }, 800);
    }, 400);
});

document.querySelector('#forgotten-container .close-btn').addEventListener('click', function() {
    var forgottenContainer = document.getElementById('forgotten-container');
    var loginButton = document.getElementById('login-button');

    forgottenContainer.style.transform = 'scale(1)';
    forgottenContainer.style.transition = 'transform 0.1s';
    
    setTimeout(function() {
        forgottenContainer.style.transition = 'opacity 0.8s';
        forgottenContainer.style.opacity = '0';
        
        setTimeout(function() {
            forgottenContainer.style.display = 'none';
            loginButton.style.opacity = '1';

        }, 800);
    }, 400);
});

document.getElementById('forgotten').addEventListener('click', function() {
    var container = document.getElementById('auth-container');
    var forgottenContainer = document.getElementById('forgotten-container');
    
    container.style.transition = 'opacity 0.8s';
    container.style.opacity = '0';

    setTimeout(function() {
        container.style.display = 'none';
        forgottenContainer.style.display = 'block';
        forgottenContainer.style.transition = 'opacity 0.4s';
        forgottenContainer.style.opacity = '1';
    }, 400);
});

document.querySelector('#auth-container .orange-btn').addEventListener('click', function(event) {
    event.preventDefault(); 

    var user_name = document.getElementById("user_name").value;
    var user_pass = document.getElementById("user_pass").value;
    var user_auth_data = {
        user_name: user_name,
        user_pass: user_pass
    };
    
    var jsonData = JSON.stringify(user_auth_data);
    console.log(jsonData)

    /*//пост запрос на сервер
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5500/", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Обработка успешного ответа от сервера
            console.log(xhr.responseText);
        } else if (xhr.readyState === 4) {
            // Обработка ошибки
            console.error(xhr.statusText);
        }
    };
    xhr.send(jsonData);*/
});

document.querySelector('#forgotten-container .orange-btn').addEventListener('click', function(event) {
    event.preventDefault();
    var forgotten_user_name = document.getElementById("forgotten_user_name").value;
    var jsonData = JSON.stringify(forgotten_user_name);
    console.log(jsonData)
});
document.getElementById('regForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const user_name = document.getElementById("user_reg_name").value;
    const user_pass = document.getElementById("user_reg_pass").value;
    const user_pass_conf = document.getElementById("user_reg_pass_confirm").value;
    if (user_pass !== user_pass_conf){
        alert ('Введенные пароли не совпадают')
    }else{

        const user_auth_data = {
            user_name: user_name,
            user_pass: user_pass
        };
        
        const jsonData = JSON.stringify(user_auth_data);
        console.log(jsonData)
    }
    
})  
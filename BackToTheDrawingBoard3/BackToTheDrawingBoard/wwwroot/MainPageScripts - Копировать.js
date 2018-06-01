function LoadCanvases() {
    var currentUser = GetCurrentUserForPost();
   /* var xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function (ev)
    {
        var sasa = JSON.parse(xmlhttp.responseText);
    }
    xmlhttp.open("GET", "api/CanvasUsers/user/" + currentUser.id, false);
    xmlhttp.send();*/
    /*var currentUser = GetCurrentUserForPost();
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "api/CanvasUsers/" + currentUser.id, false);
    xmlhttp.send();
    canvases = JSON.parse(xmlhttp.responseText);*/

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function (ev) {
        var msg = ""
        if (xmlhttp.status == 200)
        {
            // msg = "Полотно создано"; 
            canvases = JSON.parse(xmlhttp.responseText);
            document.getElementById("canvasTable").innerHTML = "";
            var x = "<tr><th>Id<\/th><th>Название<\/th><th>Создатель<\/th><th>Ссылка<\/th><th>Лайк?<\/th><th>Удалить<\/th> <\/tr >";
          
            /*var request = new XMLHttpRequest();
            request.open("GET", "api/CanvasUsers/user/" + currentUser.id, false);
            request.send();
            var users = JSON.parse(request.responseText);*/

            var request = new XMLHttpRequest();
            request.open("GET", "api/FavoriteCanvases/" + currentUser.id, false);
            request.send();
            var favedCanvases = JSON.parse(request.responseText);
          
            for (i in canvases)
            {
              /*  if (canvases[i].creatorId == currentUser.id || CheckUserAllowance(users, canvases[i]))
                {*/
                    var star;
                    if (CheckFavedCanvases(canvases[i],favedCanvases) == false)
                    star = "<label for=\"faveButton" + canvases[i].id + "\" class=\"custom-checkbox\"><input type=\"checkbox\" id=\"faveButton" + canvases[i].id + "\"" + "onclick=\"FaveClickHandler(" + canvases[i].id+")\""+"\/><i class=\"glyphicon glyphicon-star-empty\"><\/i> <i class=\"glyphicon glyphicon-star\"><\/i><\/label>";
                    else 
                    star = "<label for=\"faveButton" + canvases[i].id + "\" class=\"custom-checkbox\"><input type=\"checkbox\" id=\"faveButton" + canvases[i].id + "\"" +  "checked=\"checked\""+ "onclick=\"FaveClickHandler(" + canvases[i].id + ")\"" + "\/><i class=\"glyphicon glyphicon-star-empty\"><\/i> <i class=\"glyphicon glyphicon-star\"><\/i><\/label>";
                x += "<tr><td class=\"col-md-2\">" + canvases[i].id + "<\/td>" + "<td class=\"col-md-2\">" + canvases[i].name + "<\/td>" + "<td class=\"col-md-2\">" + GetUserEmail(canvases[i].creatorId) + "<\/td>" + "<td class=\"col-md-2\">" + "<a href=\"\/canvas.html?id=" + canvases[i].id + "\">Ссылка<\/a>" + "<\/td>" + "<td>" + star + "<\/td>";
                if (canvases[i].creatorId == currentUser.id) {
                    x +="<td><button onclick=\"Delete(" + canvases[i].id + ");\">Удалить<\/button><\/td>" + "<\/tr>";
                }
                else x += "<td><\/td><\/tr>";
                //}
            }
            document.getElementById("canvasTable").innerHTML += x;
        } else
        {
            msg = "У Вас недостаточно прав для просмотра списка полотен, войдите или зарегистрируйтесь.";
            document.getElementById("canvasTable").innerHTML = msg;
        }
    }
    var canvases;
    //  var request = new XMLHttpRequest();
    xmlhttp.open("GET", "api/CanvasUsers/" + currentUser.id, false);
    xmlhttp.send();
}
function GetUserEmail(id) 
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "api/Users/" + id, false);
    xmlhttp.send();
    user = JSON.parse(xmlhttp.responseText);
    return user.email;
}
function CheckFavedCanvases(canvas, canvases)
{
    for (it in canvases) {
        if (canvases[it].canvasId == canvas.id) return true;

    }
    return false;
}

function FaveClickHandler(number)
{
    var button = document.getElementById("faveButton" + number);
    if (button.checked == true)
    {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "api/FavoriteCanvases/", false);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        var currentUser = GetCurrentUserForPost();
            xmlhttp.send(JSON.stringify({
                canvasid: number,
                userid: currentUser.id,
            }));
        
    }
    else if (button.checked == false)
    {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("DELETE", "api/FavoriteCanvases/", false);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        var currentUser = GetCurrentUserForPost();
        xmlhttp.send(JSON.stringify({
            canvasid: number,
            userid: currentUser.id,
        }));

    }
}
function CheckUserAllowance(users, canvas)
{
    for (it in users)
    {
        if (users[it].canvasId == canvas.id) return true;
        
    }
    return false;
}

function Match(user, types) {
    for (var i in types) if (user.userType == types[i].id) return types[i].name;
}

function Delete(id) {
    //var params = getQueryVariable("id");

    var request = new XMLHttpRequest();
    request.open("DELETE", "api/Canvas/" + id, false);
    request.send();
    // window.location.replace("index.html");
}
function GetId(type, types) {
    for (var i in types) if (type == types[i].name) return types[i].id;
}
function PostCanvas() {// Нужно узнать id создаваемого элемента
    var currentUser = GetCurrentUserForPost();
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function (ev) {
        var msg = ""
        if (xmlhttp.status == 201) {
            msg = "Полотно создано";
        } else {
            msg = "У Вас недостаточно прав для создания полотна";
        }
        document.getElementById("CreateMsg").innerHTML = msg;
    }
    var cName = document.getElementById("canvasName").value;
    // var request = new XMLHttpRequest();
    xmlhttp.open("POST", "api/Canvas/", false);
    xmlhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xmlhttp.send(JSON.stringify({ name: cName, creatorid: currentUser.id }));
    LoadCanvases();
}
function GetCurrentUserForPost()
{
    var currentUser = '';
    var request = new XMLHttpRequest();
    request.open("GET", "api/Account/GetCurrent", false);
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    request.onload = function () {
        if (request.readyState === request.DONE) {
            if (request.status === 200) {
                currentUser = JSON.parse(request.responseText);
            }
           
        }
     
    };
    request.send();
    return currentUser;
}
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}
function ParseResponseMsg() {
    // Считывание данных с формы
    email = document.getElementById("Email").value;
    password = document.getElementById("Password").value;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "/api/Account/Login");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xmlhttp.onreadystatechange = function () {
        // Очистка контейнера вывода сообщений
        document.getElementById("msg").innerHTML = ""
        var mydiv = document.getElementById('formError');
        while (mydiv.firstChild) {
            mydiv.removeChild(mydiv.firstChild);
        }
        // Обработка ответа от сервера
        myObj = JSON.parse(this.responseText);
        document.getElementById("msg").innerHTML = myObj.message;
        // Вывод сообщений об ошибках
        if (typeof myObj.error !== "undefined" && myObj.error.length > 0) {
            for (var i = 0; i < myObj.error.length; i++) {
                var ul = document.getElementsByTagName("ul");
                var li = document.createElement("li");
                li.appendChild(document.createTextNode(myObj.error[i]));
                ul[0].appendChild(li);
            }
        }
        else {
            $('#myLoginModal').modal('hide');
            GetCurrentUser();
        }
        document.getElementById("Password").value = "";
    };
    // Запрос на сервер
    xmlhttp.send(JSON.stringify({
        email: email,
        password: password
    }));
}
function ParseRegisterResponseMsg() {
    email = document.getElementById("RegEmail").value;
    password = document.getElementById("RegPassword").value;
    passwordConfirm = document.getElementById("RegPasswordConfirm").value;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "/api/account/Register");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xmlhttp.onreadystatechange = function () {
        // Очистка контейнера вывода сообщений
        document.getElementById("Regmsg").innerHTML = ""
        var mydiv = document.getElementById('RegformError');
        while (mydiv.firstChild) {
            mydiv.removeChild(mydiv.firstChild);
        }

        // Обработка ответа от сервера
        myObj = JSON.parse(this.responseText);
        document.getElementById("Regmsg").innerHTML = myObj.message;
        // Вывод сообщений об ошибках
        if (myObj.error.length > 0) {
            for (var i = 0; i < myObj.error.length; i++) {
                var ul = document.getElementsByTagName("ul");
                var li = document.createElement("li");
                li.appendChild(document.createTextNode(myObj.error[i]));
                ul[0].appendChild(li);
            }
        }
        else $('#myRegisterModal').modal('hide');
        // Очистка полей поролей
        document.getElementById("RegPassword").value = "";
        document.getElementById("RegPasswordConfirm").value = "";
    };
    // Запрос на сервер
    xmlhttp.send(JSON.stringify({
        email: email,
        password: password,
        passwordConfirm: passwordConfirm
    }));


};
function GetCurrentUser() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "/api/Account/isAuthenticated", true);
    xmlhttp.onreadystatechange = function () {
        var myObj = "";
        myObj = xmlhttp.responseText != "" ? JSON.parse(xmlhttp.responseText) :
            {};
        document.getElementById("msgAuth").innerHTML = myObj.message;
    }
    xmlhttp.send();
}
function Exit() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "api/Account/LogOff", true);
    xmlhttp.onreadystatechange = function () {
        var myObj = "";
        myObj = xmlhttp.responseText != "" ? JSON.parse(xmlhttp.responseText) :
            {};
        document.getElementById("msgAuth").innerHTML = myObj.message;
    }
    xmlhttp.send();
}

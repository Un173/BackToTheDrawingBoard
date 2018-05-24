function LoadCanvases() {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function (ev) {
        var msg = ""
        if (xmlhttp.status == 200) {
            // msg = "Полотно создано"; 
            canvases = JSON.parse(xmlhttp.responseText);
            document.getElementById("canvasTable").innerHTML = "";
            var x = "<tr><th>Id<\/th><th>Название<\/th><th>Ссылка<\/th> <\/tr >";
            for (i in canvases) { x += "<tr><td class=\"col-md-2\">" + canvases[i].id + "<\/td>" + "<td class=\"col-md-2\">" + canvases[i].name + "<\/td>" + "<td class=\"col-md-2\">" + "<a href=\"\/canvas.html?id=" + canvases[i].id + "\">Ссылка<\/a>" + "<\/td><\/tr>"; }
            document.getElementById("canvasTable").innerHTML += x;
        } else {
            msg = "У Вас недостаточно прав для просмотра списка полотен, войдите или зарегистрируйтесь.";
            document.getElementById("canvasTable").innerHTML = msg;
        }

    }
    var canvases;
    //  var request = new XMLHttpRequest();
    xmlhttp.open("GET", "api/Canvas/", false);
    xmlhttp.send();
}
function Match(user, types) {
    for (var i in types) if (user.userType == types[i].id) return types[i].name;
}
function CreatePage() {
    var params = getQueryVariable("id");
    var userTypes;

    var request = new XMLHttpRequest();

    request.open("GET", "api/UserTypeTables/", false);
    request.send();
    userTypes = JSON.parse(request.responseText);


    var x = "";
    for (var i in userTypes)
        x += "<option>" + userTypes[i].name + "</option>";
    document.getElementById("type").innerHTML = x;
}
function Put() {
    var params = getQueryVariable("id");
    var userTypes;

    var request = new XMLHttpRequest();
    request.open("GET", "api/UserTypeTables/", false);
    request.send();
    userTypes = JSON.parse(request.responseText);
    var login = document.getElementById("login").value;
    var e = document.getElementById("type");
    var type = GetId(e.options[e.selectedIndex].text, userTypes);


    request.open("PUT", "api/LoginTables/" + params, false);
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.send(JSON.stringify({ id: params, login: login, userType: type }));
    window.location.replace("index.html");
}
function Post() {
    var params = getQueryVariable("id");
    var userTypes;

    var request = new XMLHttpRequest();
    request.open("GET", "api/UserTypeTables/", false);
    request.send();
    userTypes = JSON.parse(request.responseText);
    var login = document.getElementById("login").value;
    var e = document.getElementById("type");
    var type = GetId(e.options[e.selectedIndex].text, userTypes);


    request.open("POST", "api/LoginTables/", false);
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.send(JSON.stringify({ login: login, userType: type }));
    window.location.replace("index.html");
}
function Delete(id) {
    //var params = getQueryVariable("id");

    var request = new XMLHttpRequest();
    request.open("DELETE", "api/LoginTables/" + id, false);
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

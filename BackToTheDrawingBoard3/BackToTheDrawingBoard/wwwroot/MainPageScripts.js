function LoadCanvases() {
    document.getElementById("canvasesCol").innerHTML = "";
    var request = new XMLHttpRequest();
    request.open("GET", " api/Account/GetUserRole", false);
    request.send();
    if (request.status == 500) {
        document.getElementById("exitButton").style.display = 'none';
            msg = "У Вас недостаточно прав для просмотра списка полотен, войдите или зарегистрируйтесь.";
            document.getElementById("canvasTable").innerHTML = msg;
        
    }
    else 
    {
        msg = "Список полотен:";
        document.getElementById("canvasTable").innerHTML = msg;
        document.getElementById("loginButton").style.display = 'none';
        document.getElementById("regButton").style.display = 'none';
        var role = JSON.parse(request.responseText);
        if (role[0] == "user")
            LoadPageAsUser();
        else if (role[0] == "admin")
            LoadPageAsAdmin();
    }
}
function LoadPageAsAdmin() 
{
    var currentUser = GetCurrentUserForPost();
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function (ev) {
        var msg = ""
        if (xmlhttp.status == 200) {
            canvases = JSON.parse(xmlhttp.responseText);
            var x = "";
            var request = new XMLHttpRequest();
            request.open("GET", "api/FavoriteCanvases/" + currentUser.id, false);
            request.send();
            var favedCanvases = JSON.parse(request.responseText);

            for (i in canvases) {
                var star;
                if (CheckFavedCanvases(canvases[i], favedCanvases) == false)
                    star = "<label for=\"faveButton" + canvases[i].id + "\" class=\"custom-checkbox\"><input type=\"checkbox\" id=\"faveButton" + canvases[i].id + "\"" + "onclick=\"FaveClickHandler(" + canvases[i].id + ")\"" + "\/><i class=\"glyphicon glyphicon-star-empty\"><\/i> <i class=\"glyphicon glyphicon-star\"><\/i><\/label>";
                else
                    star = "<label for=\"faveButton" + canvases[i].id + "\" class=\"custom-checkbox\"><input type=\"checkbox\" id=\"faveButton" + canvases[i].id + "\"" + "checked=\"checked\"" + "onclick=\"FaveClickHandler(" + canvases[i].id + ")\"" + "\/><i class=\"glyphicon glyphicon-star-empty\"><\/i> <i class=\"glyphicon glyphicon-star\"><\/i><\/label>";
                x += "<div class=\"col-sm-4 col-md-4\" style=\"min-width:255px\">\n<div class=\"thumbnail\" >\n<canvas id=\"image" + canvases[i].id + "\" style=\"height: 200px; width: 200px;\"><\/canvas><div class=\"caption\"style=\"width: inherit;\">\n<h3>" + canvases[i].name + "<\/h3>\n<p>\u0421\u043e\u0437\u0434\u0430\u0442\u0435\u043b\u044c \u043f\u043e\u043b\u043e\u0442\u043d\u0430:" + GetUserEmail(canvases[i].creatorId) + "<\/p><div class=\"buttonDiv\"><p><a href=\"\/canvas.html?id=" + canvases[i].id + "\" class=\"btn btn-primary\" role=\"button\">Рисовать!<\/a>&nbsp<a href=\"\#\"class=\"btn btn-default\" role=\"button\" onclick=\"Delete(" + canvases[i].id + ");\">Удалить<\/a>&nbsp" + star + "<\/p><\/div><\/div>\n<\/div>\n<\/div>\n<\/div>";


            }
            if (typeof x !== "undefined") {
                document.getElementById("canvasesCol").innerHTML += x;
                for (i in canvases)
                    if (canvases[i].id != null)
                        GetCanvas(canvases[i].id);
            }
        } 
    }
    var canvases;
    //  var request = new XMLHttpRequest();
    xmlhttp.open("GET", "api/Canvas/", false);
    xmlhttp.send();
}
function LoadPageAsUser()
{

    var currentUser = GetCurrentUserForPost();
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function (ev) {
        var msg = ""
        if (xmlhttp.status == 200) {
            canvases = JSON.parse(xmlhttp.responseText);
            var x = "";
            var request = new XMLHttpRequest();
            request.open("GET", "api/FavoriteCanvases/" + currentUser.id, false);
            request.send();
            var favedCanvases = JSON.parse(request.responseText);

            for (i in canvases) {
                var star;
                if (CheckFavedCanvases(canvases[i], favedCanvases) == false)
                    star = "<label for=\"faveButton" + canvases[i].id + "\" class=\"custom-checkbox\"><input type=\"checkbox\" id=\"faveButton" + canvases[i].id + "\"" + "onclick=\"FaveClickHandler(" + canvases[i].id + ")\"" + "\/><i class=\"glyphicon glyphicon-star-empty\"><\/i> <i class=\"glyphicon glyphicon-star\"><\/i><\/label>";
                else
                    star = "<label for=\"faveButton" + canvases[i].id + "\" class=\"custom-checkbox\"><input type=\"checkbox\" id=\"faveButton" + canvases[i].id + "\"" + "checked=\"checked\"" + "onclick=\"FaveClickHandler(" + canvases[i].id + ")\"" + "\/><i class=\"glyphicon glyphicon-star-empty\"><\/i> <i class=\"glyphicon glyphicon-star\"><\/i><\/label>";
                x += "<div class=\"col-sm-4 col-md-4\" style=\"min-width:255px\">\n<div class=\"thumbnail\" >\n<canvas id=\"image" + canvases[i].id + "\" style=\"height: 200px; width: 200px;\"><\/canvas><div class=\"caption\"style=\"width: inherit;\">\n<h3>" + canvases[i].name + "<\/h3>\n<p>\u0421\u043e\u0437\u0434\u0430\u0442\u0435\u043b\u044c \u043f\u043e\u043b\u043e\u0442\u043d\u0430:" + GetUserEmail(canvases[i].creatorId) + "<\/p><div class=\"buttonDiv\"><p><a href=\"\/canvas.html?id=" + canvases[i].id + "\" class=\"btn btn-primary\" role=\"button\">Рисовать!<\/a>&nbsp";

                if (canvases[i].creatorId == currentUser.id) 
                {
                    x+="<a href=\"\#\"class=\"btn btn-default\" role=\"button\" onclick=\"Delete(" + canvases[i].id + ");\">Удалить<\/a>&nbsp" + star + "<\/p><\/div><\/div>\n<\/div>\n<\/div>\n<\/div>";
                }
                else x +=star + "<\/p><\/div><\/div>\n<\/div>\n<\/div>\n<\/div>"
            }
            if (typeof x !== "undefined") {
                document.getElementById("canvasesCol").innerHTML += x;
                for (i in canvases)
                    if (canvases[i].id != null)
                        GetCanvas(canvases[i].id);
            }
        } 
    }
    var canvases;
    //  var request = new XMLHttpRequest();
    xmlhttp.open("GET", "api/CanvasUsers/" + currentUser.id, false);
    xmlhttp.send();
}
function GetCanvas(id) {
    var request = new XMLHttpRequest();
    request.open("GET", "api/Canvas/" + id, false);
    request.send();
    c = JSON.parse(request.responseText);
    if (c.string != null) {

        var canvas = document.getElementById("image" + id);
        var context = canvas.getContext('2d');
        var imageObj = new Image();
        imageObj.onload = function () {
            context.drawImage(this, 0, 0, imageObj.width, imageObj.height, 0, 0, canvas.width, canvas.height);
        };
        imageObj.src = c.string;
    }
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
    request.open("DELETE", "api/FavoriteCanvases/" + id, false);
    request.send();
    request.open("DELETE", "api/CanvasUsers/deleteCascade/" + id, false);
    request.send();
    LoadCanvases();
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
    LoadCanvases();
}

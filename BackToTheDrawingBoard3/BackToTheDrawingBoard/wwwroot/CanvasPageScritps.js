var mode = "";
var fatness = 3;
var beginCoord = { x: 0, y: 0 };
var endCoord = { x: 0, y: 0 };
var begin = false;
var end = false;
var isDrawing = false;
var color = "#000000";
var canvas = document.getElementById('canvas');
var demoColorPicker;
var canvasName = "";
var canvasRelatedUsers = [];
var logins;
var params;
var users;
var creator;
var c;
function LoadCanvas() {
    // canvas = document.getElementById('canvas');
    var request = new XMLHttpRequest();
    request.open("GET", " api/Account/GetUserRole", false);
    request.send();
    if (request.status == 500) 
    {
        location.href = '403.html';
        return;
    }
    demoColorPicker = null;
    if (canvas && canvas.getContext) {
        
        GetCanvas();
        var context = canvas.getContext('2d');
        demoColorPicker = new iro.ColorPicker("#color-picker-container", {
            width: document.getElementById("toolsColumn").offsetWidth,
            height: document.getElementById("toolsColumn").offsetWidth,
            color: { r: 255, g: 0, b: 0 },
            markerRadius: 8,
            padding: 4,
            sliderMargin: 24,
            sliderHeight: 36,
            borderWidth: 2,
            borderColor: "#fff",
            anticlockwise: true,
        });
    }
}

function GetStartingMousePosition(event) {
    //begin = true;
    var rect = canvas.getBoundingClientRect();
    beginCoord.x = event.clientX - rect.left;
    beginCoord.y = event.clientY - rect.top;
    isDrawing = true;
    var ctx = canvas.getContext('2d');
    ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
    var context = canvas.getContext('2d');
    context.beginPath();
    context.strokeStyle = demoColorPicker.color.hexString;

}
function GetEndingMousePosition(event) {
    // end = true;
    isDrawing = false;
    var rect = canvas.getBoundingClientRect();
    endCoord.x = event.clientX - rect.left;
    endCoord.y = event.clientY - rect.top;

    switch (mode) {
        case "line":
            {
                DrawLine(beginCoord, endCoord);
                break;
            }
        case "circle":
            {
                DrawCircle(beginCoord, endCoord);
                break;
            }
        case "pen":
            {
                var context = canvas.getContext('2d');
                context.stroke();
                break;
            }
        case "rectangle":
            {
                DrawRectangle(beginCoord, endCoord);
                break;
            }
    }
    beginCoord.x = null;
    beginCoord.y = null;
    endCoord.x = null;
    endCoord.y = null;
}
function ToolHandler(m) {
    mode = m;

}
function MouseMoveHandler(event) {

    if (isDrawing && mode == "pen") {
        var rect = canvas.getBoundingClientRect();
        var ctx = canvas.getContext('2d');
        ctx.lineWidth = fatness;
        ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
        ctx.stroke();
    }
}
function FatnessChanged(fat) {
    fatness = fat;
}
function DrawLine(a, b) {

    var ctx = canvas.getContext("2d");
    //ctx.beginPath();
    ctx.lineWidth = fatness;
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
}
function DrawCircle(a, b) {

    var ctx = canvas.getContext("2d");
    var first = beginCoord.x - endCoord.x;
    var second = beginCoord.y - endCoord.y;
    ctx.moveTo(a.x, a.y);
    ctx.beginPath();
    ctx.lineWidth = fatness;
    ctx.arc(beginCoord.x, beginCoord.y, Math.sqrt(first * first + second * second), 0, 2 * Math.PI);
    ctx.stroke();
}
function DrawRectangle(a, b) {
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = fatness;
    ctx.rect(a.x, a.y, b.x - a.x, b.y - a.y);
    ctx.stroke();
}
function ColorChanged(c) {
    color = c;
}
function SaveCanvas()// Добавить имя
{
 
   
    var canvas = document.getElementById('canvas');
    var url = canvas.toDataURL();
    var request = new XMLHttpRequest();
    request.open("PUT", "api/Canvas/" + params, false);
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.send(JSON.stringify({ id: params, string: url }));

}
function GetCurrent() {
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

function GetCanvas() {
   var id = getQueryVariable("id");
    var request = new XMLHttpRequest();
    request.open("GET", "api/Canvas/" + id, false);
    request.send();
    c = JSON.parse(request.responseText);

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var imageObj = new Image();
    imageObj.onload = function () {
        context.drawImage(this, 0, 0);
    };
    imageObj.src = c.string;
    canvasName = c.name;
    creator = c.creatorId;
    document.title = canvasName;
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
function Exit() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "api/Account/LogOff", true);
    xmlhttp.onreadystatechange = function () {
       
        location.href = '403.html';
        LoadCanvas();
    }
    xmlhttp.send();
    
    
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
function LoadUsers() {
    canvasRelatedUsers = [];
    var user = GetCurrent();
    if (user.id == c.creatorId) {

        var request = new XMLHttpRequest();
        request.open("GET", "api/Users/", false);
        request.send();
        logins = JSON.parse(request.responseText);

        params = getQueryVariable("id");
        var request = new XMLHttpRequest();
        request.open("GET", "api/CanvasUsers/canvas/"+params, false);
        request.send();
        users = JSON.parse(request.responseText);

        for (it in users) {
         canvasRelatedUsers.push(users[it].userId);
        }

        var x = "";
        document.getElementById("deleteUsersPicker").innerHTML = x;
        for (it in users) {
            x += "<option value=\"" + users[it].userId + "\">" + GetUserEmail(users[it].userId, logins) + "<\/option>";
        }
        document.getElementById("deleteUsersPicker").innerHTML += x;

        var x = "";
        document.getElementById("addUsersPicker").innerHTML = x;
        for (it in logins) {
            if (logins[it].id != c.creatorId && canvasRelatedUsers.indexOf(logins[it].id) == -1)
                x += "<option value=\"" + logins[it].id + "\">" + logins[it].email + "<\/option>";
        }
        document.getElementById("addUsersPicker").innerHTML += x;
    }
    else
    {
        document.getElementById("addUsersLabel").style.visibility = "hidden";
        document.getElementById("addUsersButton").style.visibility = "hidden";
        document.getElementById("addUsersPicker").style.visibility = "hidden";

        document.getElementById("deleteUsersLabel").style.visibility = "hidden";
        document.getElementById("deleteUsersButton").style.visibility = "hidden";
        document.getElementById("deleteUsersPicker").style.visibility = "hidden";
    }

}
function AllowUsers() {
    var e = document.getElementById("addUsersPicker");
    var selected = document.querySelectorAll('#addUsersPicker option:checked');
    var values = Array.from(selected).map((el) => el.value);
    for (it in values) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "/api/CanvasUsers");
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        var params = getQueryVariable("id");
        xmlhttp.send(JSON.stringify({
            canvasid: params,
            userid: values[it],
        }));

    }
    LoadUsers();
}
function DeleteUsers() {
    var e = document.getElementById("deleteUsersPicker");
    var selected = document.querySelectorAll('#deleteUsersPicker option:checked');
    var values = Array.from(selected).map((el) => el.value);
    for (it in values)
    {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("DELETE", "/api/CanvasUsers/delete/");
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify({
            canvasid: params,
            userid: values[it],
        }));

    }
    LoadUsers();
}
function FindId(user)
{
    for (it in users)
    {
        if (users[it].canvasId == params && users[it].userId == user) return users[it].id;
    }
}
function GetUserEmail(id, logins)
{
    for (i in logins)
    {
        if (logins[i].id == id) return logins[i].email;
    }

}
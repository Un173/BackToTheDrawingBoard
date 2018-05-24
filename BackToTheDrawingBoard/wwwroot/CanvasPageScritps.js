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
function LoadCanvas() {
    // canvas = document.getElementById('canvas');
    if (canvas && canvas.getContext) {
        var params = getQueryVariable("id");
        GetCanvas(params);
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
    var currentUser = GetCurrentUserForPost();
    var params = getQueryVariable("id");
    var canvas = document.getElementById('canvas');
    var url = canvas.toDataURL();
    var request = new XMLHttpRequest();
    request.open("PUT", "api/Canvas/" + params, false);
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.send(JSON.stringify({ id: params, name: canvasName, string: url, creatorid: currentUser.id }));

}
function GetCurrentUserForPost() {
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
//Для создания нового полотна
/*function MakeCanvas() {

    var canvas = document.getElementById('canvas');
    var url = canvas.toDataURL();
    var request = new XMLHttpRequest();
    request.open("POST", "api/Canvas/", false);
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.send(JSON.stringify({ string: url }));
}*/
function GetCanvas(id) {
    var request = new XMLHttpRequest();
    request.open("GET", "api/Canvas/" + id, false);
    request.send();
    var c = JSON.parse(request.responseText);

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var imageObj = new Image();
    imageObj.onload = function () {
        context.drawImage(this, 0, 0);
    };
    imageObj.src = c.string;
    canvasName = c.name;

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
        var myObj = "";
        myObj = xmlhttp.responseText != "" ? JSON.parse(xmlhttp.responseText) :
            {};
        document.getElementById("msgAuth").innerHTML = myObj.message;
    }
    xmlhttp.send();
    LoadCanvas();
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
function LoadUsers() {
    var logins
    var request = new XMLHttpRequest();
    request.open("GET", "api/Users/", false);
    request.send();
    logins = JSON.parse(request.responseText);
    var x = "";
    document.getElementById("loginspicker").innerHTML = x;
    for (it in logins) { x += "<option>" + logins[it].email + "<\/option>"; }

    document.getElementById("loginspicker").innerHTML += x;

}
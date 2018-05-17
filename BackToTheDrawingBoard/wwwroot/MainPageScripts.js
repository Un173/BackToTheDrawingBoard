function LoadCanvases() {
    var canvases;
    var request = new XMLHttpRequest();
    request.open("GET", "api/Canvas/", false);
    request.send();
    canvases = JSON.parse(request.responseText);
    document.getElementById("canvasTable").innerHTML = "";
    var x = "<tr><th>Id<\/th><th>Название<\/th><th>Ссылка<\/th> <\/tr >";
    for (i in canvases) { x += "<tr><td class=\"col-md-2\">" + canvases[i].id + "<\/td>" + "<td class=\"col-md-2\">" + canvases[i].name + "<\/td>" + "<td class=\"col-md-2\">" + "<a href=\"\/canvas.html?id=" + canvases[i].id + "\">Ссылка<\/a>" + "<\/td><\/tr>";}
    document.getElementById("canvasTable").innerHTML +=x;
    
}
function Match(user, types)
{
    for (var i in types) if (user.userType == types[i].id) return types[i].name;
}
function LoadUsers() {
        var logins
        var request = new XMLHttpRequest();
        request.open("GET", "api/LoginTables/", false);
        request.send();
        logins = JSON.parse(request.responseText);
        var x = "";
    document.getElementById("loginspicker").innerHTML = x;
        for (it in logins) { x += "<option>"+logins[it].login + "<\/option>";}

    document.getElementById("loginspicker").innerHTML += x;

}
function CreatePage()
{
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
    request.send(JSON.stringify({login: login, userType: type }));
    window.location.replace("index.html");
}
function Delete(id)
{
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
    var cName = document.getElementById("canvasName").value;
    var request = new XMLHttpRequest();
    request.open("POST", "api/Canvas/", false);
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.send(JSON.stringify({ name: cName}));
   LoadCanvases();
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
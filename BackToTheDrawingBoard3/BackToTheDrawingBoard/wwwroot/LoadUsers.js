function LoadUsers() {
    var logins, userTypes;
    var request = new XMLHttpRequest();
    request.open("GET", "api/LoginTables/", false);
    request.send();
    logins = JSON.parse(request.responseText);
    request.open("GET", "api/UserTypeTables/", false);
    request.send();
    userTypes = JSON.parse(request.responseText);
    
    var x = "";
    document.getElementById("user").innerHTML = x;
    for (i in logins) { x += "<tr><td class=\"col-md-2\">" + logins[i].login + "<\/td>" + "<td class=\"col-md-2\">" + Match(logins[i], userTypes) + "<\/td>" + "<td class=\"col-md-2\">" + "<a href=\"\/edit.html?id=" + logins[i].id + "\">Изменить<\/a>" + "<\/td><td> <button onclick=\"Delete("+logins[i].id+");\">Удалить<\/button><\/td><\/tr>";}

    document.getElementById("user").innerHTML += x;
    
}
function Match(user, types)
{
    for (var i in types) if (user.userType == types[i].id) return types[i].name;
}
function LoadUser() {
    var params = getQueryVariable("id");
    var logins, userTypes;
   
    var request = new XMLHttpRequest();
    request.open("GET", "api/LoginTables/"+params, false);
    request.send();
    logins = JSON.parse(request.responseText);
    request.open("GET", "api/UserTypeTables/", false);
    request.send();
    userTypes = JSON.parse(request.responseText);

   
    //x += logins.login + " " + Match(logins, userTypes);

    var x = "";
    for (var i in userTypes)
        if (userTypes[i].id != logins.userType) x += "<option>" + userTypes[i].name + "</option>";
        else x += "<option selected>" + userTypes[i].name + "</option>";
   

    


    document.getElementById("login").value = logins.login;
    document.getElementById("type").innerHTML = x;
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

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}
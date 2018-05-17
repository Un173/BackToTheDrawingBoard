var mode = "";
var fatness = 3;
var beginCoord = { x: 0, y: 0 };
var endCoord = { x: 0, y: 0 };
var begin=false;
var end = false;
var isDrawing = false;
var color = "#000000";
var canvas = document.getElementById('canvas');
var demoColorPicker;
var canvasName = "";
function LoadCanvas() {
    // canvas = document.getElementById('canvas');
    if (canvas && canvas.getContext)
    {
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
   
    switch (mode)
    {
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
function ToolHandler(m)
{
    mode = m;
    
}
function MouseMoveHandler(event)
{
    
    if (isDrawing&&mode=="pen")
    {
        var rect = canvas.getBoundingClientRect();
        var ctx = canvas.getContext('2d');
        ctx.lineWidth = fatness;
        ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
            ctx.stroke();
        }
}
function FatnessChanged(fat)
{
    fatness = fat;
}
function DrawLine(a, b)
{
   
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
function DrawRectangle(a, b)
{
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = fatness;
    ctx.rect(a.x, a.y, b.x-a.x, b.y-a.y);
    ctx.stroke();
}

function ColorChanged(c)
{
    color = c;
}
function SaveCanvas()// Добавить имя
{
    var params = getQueryVariable("id");
    var canvas = document.getElementById('canvas');
    var url = canvas.toDataURL();
    var request = new XMLHttpRequest();
    request.open("PUT", "api/Canvas/"+params, false);
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.send(JSON.stringify({ id:params, string: url, name:canvasName}));

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
function GetCanvas(id)
{
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
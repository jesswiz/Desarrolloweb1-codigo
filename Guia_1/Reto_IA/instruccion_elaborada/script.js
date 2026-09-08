
// GRAFICA DE BARRAS


const bar = document.getElementById("barChart");


new Chart(bar,{

type:"bar",

data:{


labels:[
"Semana 1",
"Semana 2",
"Semana 3",
"Semana 4"
],


datasets:[

{

label:"Ingresos",

data:[
520,
680,
430,
610
],


backgroundColor:"#13a36b"

},


{

label:"Gastos",

data:[
180,
220,
120,
160
],


backgroundColor:"#ff5252"

}

]


},


options:{

responsive:true

}


});







// GRAFICA PASTEL


const pie =
document.getElementById("pieChart");



new Chart(pie,{


type:"doughnut",


data:{


labels:[

"Servicios",
"Repuestos"

],


datasets:[{

data:[1620,596],


backgroundColor:[

"#2980ff",
"#7b2cbf"

]


}]


},


options:{

responsive:true

}


});







// BOTON NUEVA TRANSACCION


document.querySelector(".new")
.onclick=function(){

alert(
"Formulario para registrar nueva transacción"
);

};




// EXPORTACIONES


document.querySelector(".pdf")
.onclick=function(){

alert(
"Generando reporte PDF..."
);

};



document.querySelector(".excel")
.onclick=function(){

alert(
"Generando archivo Excel..."
);

};
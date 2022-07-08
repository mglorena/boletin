var data;
$(document).ready(function () {
  $.getJSON("data.json", function (json) {
    buildSecciones(json["secciones"]);
    buildDivData(json["orgas"]);
  });
});
function buildDivData(orgas) {
  var html = "";
  for (var i = 0; i < orgas.length; i++) {
    console.log(orgas[i].name);
    org = orgas[i];
    html += "<div id='s" + org.sigla + "'  class='resos'>";
    html += "<p>" + org.name + "</p>";
    if (org.isF == "no") {
      console.log("Enrando a secciones");
      secciones = org["secciones"];
      for (var j = 0; j < secciones.length; j++) {
        sec = secciones[j];
        for (var k = sec.fin; k > sec.ini; k--) {
          html +=
            "<a href='" +
            org.sigla.toLowerCase() +
            "/" +
            sec.cod +
            k +
            "'>" +
            sec.cod +
            k +
            "</a>&nbsp;|&nbsp;";
        }
      }
    }
    html += "</div>";
    $("#divMostrar").html(html);
  }
}

function buildSecciones(secciones) {
  var htmlSec =
    "<h5>Secciones</h5><ul class='nav nav-pills nav-stacked nav-bora form-group'>";
  var cA = "";
  for (var i = 0; i < secciones.length; i++) {
    sec = secciones[i];

    //htmlSec += " <li>" + secciones[i].name + "</li>";
    if (sec.order == "1") cA = " class='active' ";
    else cA = "";

    htmlSec +=
      "<li id='s" +
      sec.order +
      "' " +
      cA +
      "><a href='#' onclick=openSeccion('s" +
      sec.order +
      "');";
    htmlSec +=
      "return false;><i class='fa fa-angle-right'>&nbsp;</i><h6>" +
      sec.name +
      "</h6></a></li>";
  }
  htmlSec += "</ul>";
  $("#divSecciones").html(htmlSec);
}
function mostrar(iddiv) {
  ocultarDivs();
  $("#p" + iddiv).addClass("punteroOver");
  seccion = buscarSeccion();
  divShowId = seccion + iddiv;
  console.log(divShowId);
  $("#" + divShowId).show();
}
function ocultarDivs() {
  $("#divMostrar").find(".resos").hide();
  $("#collapseOne").find(".puntero").removeClass("punteroOver");
}
function buscarSeccion() {
  seccionId = $("#divSecciones").find(".active").attr("id");
  return seccionId;
}
function openSeccion(id) {
  idSeccionActiva = buscarSeccion();
  $("#" + idSeccionActiva).removeClass("active");
  $("#" + id).addClass("active");
  ocultarDivs();
  generarEnlaces("cdex", "2001", "2012", "A");
}
function generarEnlaces(dep, ini, fin, tipo) {
  var html = "";
  dep = "cdex";
  tipo = "A";
  ini = "2001";
  fin = "2012";

  for (var i = ini; i <= fin; i++) {
    html +=
      " <a href=" + dep + "/" + tipo + i + ">" + tipo + i + "</a>&nbsp;|&nbsp;";
  }
  console.log(html);
}
function openJsonData() {
  $.getJSON("data.json", function (json) {
    console.log(json); // this will show the info it in firebug console
  });
}

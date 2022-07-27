var data;
var host = "http://bo.unsa.edu.ar/";

$(document).ready(function () {
  $.getJSON("data.json", function (json) {
    buildSecciones(json["secciones"]);
    buildDivsLinks(json["orgas"], json["secciones"]);
  });
});

function searchInfoSec(cod, divsecciones) {
  try {
    for (var i = 0; i < divsecciones.length; i++) {
      var sec = divsecciones[i];
      if (sec.cod == cod) {
        var returnD = [sec.order, sec.t];
        return returnD;
      }
    }
  } catch (error) {
    console.log("Error buscando sección numero");
    console.log(error);
  }
}
function links(sec, org) {
  var html = "<p>";
  var count = 0;
  var sep = "";
  try {
    for (var k = sec.fin; k >= sec.ini; k--) {
      /*if (count > 12) {
        html += "<br/>";
        count = 0;
      }*/
      html +=
        sep +
        "<a href='" +
        host +
        org.sigla.toLowerCase() +
        "/" +
        sec.cod +
        k +
        "'>" +
        k +
        "</a>";
      sep = "&nbsp;|&nbsp;";
      count++;
    }

    html += "</p>";
  } catch (error) {
    console.log("Error generando links de " + org.sigla);
    console.log(error);
    html += "Disculpe las molestias</p>";
  }
  return html;
}
function constrLinks(org, listSecciones) {
  var html = "";
  try {
    var divisiones = org["divisiones"];
    for (var j = 0; j < divisiones.length; j++) {
      var dvs = divisiones[j];
      for (var i = 0; i < dvs["secciones"].length; i++) {
        var sec = dvs["secciones"][i];
        var dataSec = searchInfoSec(sec.cod, listSecciones);
        var classCss = "s" + dataSec[0] + org.sigla;
        var idDiv = classCss + "-" + dvs.sigla;
        if (sec.ini != 0) {
          html +=
            "<div id='" + idDiv + "'  class='resos " + classCss + "' hidden >";
          html += "<p>" + dataSec[1] + dvs.name + "</p>";
          html += links(sec, org);
          html += "</div>";
        } else {
          html += constLinkFolder(sec.seccionFolder, org.sigla, sec.nameFolder);
        }
      }
    }
  } catch (error) {
    console.log("Error construyendo links" + org.sigla);
    console.log(error);
    html += "<p> No hay resultados</p>";
  }
  return html;
}

function constLinkFolder(seccionFolder, sigla, nameFolder) {
  var html = "";
  try {
    var classCss = "s" + seccionFolder + sigla;
    html +=
      "<div id='" + classCss + "'  class='resos " + classCss + "' hidden >";
    html +=
      "<p><a href='" +
      host +
      nameFolder.toLowerCase() +
      "'>Lista de documentos </a></p>";
    html += "</div>";
  } catch (error) {
    console.log("No se pudo generar link a folder " + sigla);
    console.log(error);
    html += "<p> No hay resultados</p>";
  }

  return html;
}

function buildDivsLinks(orgas, listSecciones) {
  var html = "";
  try {
    for (var i = 0; i < orgas.length; i++) {
      org = orgas[i];
      if (typeof org["divisiones"] != "undefined") {
        html += constrLinks(org, listSecciones);
      } else {
        console.log(org.name + ": No tiene divisiones");
        if (typeof org["seccionFolder"] != "undefined") {
          html += constLinkFolder(org.seccionFolder, org.sigla, org.nameFolder);
        } else {
          console.log(org.name + ": No tiene folder");
        }
      }
    }
  } catch (error) {
    console.log("Error en construcción de divs de links");
    console.log(error);
    html = "<p>No hay datos</p>";
  }

  $("#divMostrar").html(html);
}

function buildSecciones(secciones) {
  var htmlSec =
    "<h5>Secciones</h5><ul class='nav nav-pills nav-stacked nav-bora form-group'>";
  var cA = "";
  try {
    for (var i = 0; i < secciones.length; i++) {
      sec = secciones[i];
      if (sec.order == "1") cA = " class='active' ";
      else cA = "";

      htmlSec +=
        "<li id='s" +
        sec.order +
        "' " +
        cA +
        "><a href='#' onclick=openSeccion('s" +
        sec.order +
        "','" +
        sec.cod +
        "');";
      htmlSec +=
        "return false;><i class='fa fa-angle-right'>&nbsp;</i><h6 id='s" +
        sec.order +
        "T" +
        "'>" +
        sec.name +
        "</h6></a></li>";
    }
    htmlSec += "</ul>";
  } catch (error) {
    console.log("No se pudo generar las secciones");
    console.log(error);
    htmlSec += "<p>Error creando las secciones</p>";
  }

  $("#divSecciones").html(htmlSec);
}
function showInfoSeccion(seccion) {
  try {
    var num = seccion.replace("s", "");
    var name = $("#" + seccion + "T").text();
    $("#divTitleSeccion").html(
      "<h5>" + name + "<br> <small>" + num + "º sección</small></h5>"
    );
  } catch (error) {
    console.log("Mostrando datos de sección");
  }
}
function mostrar(sigla) {
  try {
    ocultarDivs();
    $("#p" + sigla).addClass("punteroOver");
    var seccion = buscarSeccion();
    showInfoSeccion(seccion);
    var classCss = seccion + sigla;
    var divList = $("div[id^='" + classCss + "']");
    if (divList.length == 0) {
      $("#divMessage").show();
      $("#divMessage").html(
        "<div class='resos'><p sytle='margin-left:10px'>No hay resultados. </p></div>"
      );
    } else {
      $("#divMostrar")
        .find("." + classCss)
        .show();
      $("#divMessage").hide();
    }
  } catch (error) {
    console.log("Error mostrando links " + sigla);
    console.log(error);
  }
}
function ocultarDivs() {
  $("#divMostrar").find(".resos").hide();
  $("#collapseOne").find(".puntero").removeClass("punteroOver");
}
function buscarSeccion() {
  var seccionId = $("#divSecciones").find(".active").attr("id");
  return seccionId;
}
function openSeccion(cod) {
  var idSeccionActiva = buscarSeccion();
  $("#" + idSeccionActiva).removeClass("active");
  $("#" + cod).addClass("active");
  showInfoSeccion(cod);
  ocultarDivs();
  // ocultarContacto();
}
/*function mostrarContacto() {
  $("#divSeccionData").hide();
  $("#divContacto").show();
}
function ocultarContacto() {
  $("#divSeccionData").show();
  $("#divContacto").hide();
}*/

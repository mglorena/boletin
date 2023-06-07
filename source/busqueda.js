var data;
var host = "http://bo.unsa.edu.ar/";

$(document).ready(function () {
  var randomKey = localStorage.getItem("cacheKey");

  forceUpdateCache = true;

  if (!randomKey || forceUpdateCache) {
    randomKey = "" + Math.random();
    localStorage.setItem("cacheKey", randomKey);
  }

  $.getJSON("data.json?v=" + randomKey, function (json) {
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
function volverDivs(div) {
  $("#" + div).hide();
  $("#" + div + "A").show();
  $("#pnlOrgas").show();
}
function mostrarDocs(url, div, anio) {
  $("#" + div + "A").hide();
  $("#pnlOrgas").hide();

  $("#" + div).show();
  var page = url + "?C=N;O=D";
  $("#contenedor").load(page, function () {
    var html = "<div>";
    $("#contenedor").find("hr").parent().parent().remove();
    $("#contenedor")
      .find("a")
      .each(function () {
        var oldUrl = $(this).attr("href"); // Get current url
        $(this).attr("target","_blank");
        $(this).attr("href", url + "/" + oldUrl);
      });
    $('a:contains("Name"):not(:has(*))').parent().parent().remove();
    $('a:contains("Parent Directory"):not(:has(*))').parent().parent().remove();
    var mRes = "";
    var htmlR = $("#contenedor").find("tr");
    if (typeof htmlR[0] == "undefined") {
      mRes =
        "<div class='resos'><p sytle='margin-left:10px'>No hay resultados. </p></div>";
    }

    html +=
      "<div style='marign-bottom:10px'> <a href='#' onclick=\"volverDivs('" +
      div +
      "');\">< Volver</a></div>" +
      "<div><p style='color: #4F4848;font-weight: bold;'>Año : " +
      anio +
      "</p></div>" +
      mRes +
      "<div class='addScroll'><table style='width:100%' cellpading='4' cellspacing='2'>" +
      $("#contenedor").find("table").html() +
      "</table></div>";
    html += "</div>";
    $("#" + div).html(html);
  });
}
function links(sec, org, div) {
  var html =
    "<div style='maring:10px'  id='linkDocs' class='" +
    org.sigla +
    "-lists'></div>";
  html +=
    "<div style='maring:10px'  id='linkDocsA' class='" +
    org.sigla +
    "-listsA'>";
  var count = 0;
  var sep = "";

  try {
    for (var k = sec.fin; k >= sec.ini; k--) {
      var url = host + div.sigla.toLowerCase() + "/" + sec.cod + k;
      html +=
        "<a onclick=\"mostrarDocs('" +
        url +
        "','linkDocs','" +
        k +
        "');\" >" +
        sep +
        k +
        "</a>";
      sep = " | ";
      count++;
    }

    html += "</div>";
    html = html.replaceAll("linkDocsA", sec.cod + "-" + div.sigla + "listA");
    html = html.replaceAll("linkDocs", sec.cod + "-" + div.sigla + "list");
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
        if (sec.ini != 10000) {
          html +=
            "<div id='" + idDiv + "'  class='resos " + classCss + "' hidden >";
          html += "<p>" + org.name + "</p>";
          html += "<p>" + dataSec[1] + dvs.name + "</p>";
          html += links(sec, org, dvs);
          html += "</div>";
        } else {
          var classCss = "s" + sec.seccionFolder + org.sigla;

          html +=
            "<div id='" +
            classCss +
            "'  class='resos " +
            classCss +
            "' hidden >";
          var name = "<p>" + dataSec[1] + dvs.name + "</p>";
          html += constLinkFolder(
            name,
            sec.seccionFolder,
            org.sigla,
            sec.nameFolder
          );
          html += "</div>";
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

function constLinkFolder(name, seccionFolder, sigla, nameFolder) {
  try {
    var url = host + nameFolder;
    var page = url + "?C=N;O=D";
    var classCss = "s" + seccionFolder + sigla;
    var html = "";
    $("#contenedorFolder").load(page, function () {
      var html = "<p>" + name + "</p>";
      var classCss = "s" + seccionFolder + sigla;
      $("#contenedorFolder").find("hr").parent().parent().remove();
      $("#contenedorFolder")
        .find("a")
        .each(function () {
          var oldUrl = $(this).attr("href"); // Get current url
          $(this).attr("href", url + "/" + oldUrl);
        });
      $('a:contains("Name"):not(:has(*))').parent().parent().remove();
      $('a:contains("Parent Directory"):not(:has(*))')
        .parent()
        .parent()
        .remove();
      var mRes = "";
      var htmlR = $("#contenedorFolder").find("tr");

      if (typeof htmlR[0] == "undefined") {
        mRes =
          "<div class='resos'><p sytle='margin-left:10px'>No hay resultados. </p></div>";
      }
      html +=
        "<div style='marign-bottom:10px'> <a href='#' onclick=\"volverDivs('" +
        classCss +
        "');\">< Volver</a></div><br/>" +
        mRes +
        "<table style='width:100%' cellpading='4' cellspacing='2'>" +
        $("#contenedorFolder").find("table").html() +
        "</table>";
      $("#" + classCss).html(html);
    });
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
        if (typeof org["seccionFolder"] != "undefined") {
          var classCss = "s" + org.seccionFolder + org.sigla;
          html +=
            "<div id='" +
            classCss +
            "'  class='resos " +
            classCss +
            "' hidden >";
          var name = "<p>" + org.name + "</p>";
          html += constLinkFolder(
            name,
            org.seccionFolder,
            org.sigla,
            org.nameFolder
          );
          html += "</div>";
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
      if (sec.order == "1") cA = " class='active activeSec' ";
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
    $("#divMostrar").find(".punteroOver").removeClass("punteroOver");
    $("#p" + sigla).addClass("punteroOver");
    var seccion = buscarSeccion();
    showInfoSeccion(seccion);
    $("#" + seccion).focus();
    var classCss = seccion + sigla;
    $("." + sigla + "-listsA").show();
    $("." + sigla + "-lists").hide();
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
  $("#" + idSeccionActiva).removeClass("activeSec");
  $("#" + cod).addClass("active");
  $("#" + cod).addClass("activeSec");
  showInfoSeccion(cod);
  $("#pnlOrgas").show();
  ocultarDivs();
  $("#" + cod).focus();
}


var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";


var pacient1 = ["Milč", "29-11-2015", "1", "David Rubin", "Draža vas", "111", "104", "95", "87", "102", "90", "Meso", "120"];
var pacient2 = ["Stanč", "01-12-2015", "0", "Branko", "Draža vas", "100", "98", "115", "105", "95", "120", "Mleko", "100"];
var pacient3 = ["Bik Flik", "02-04-2016", "2", "Sosedov Franc", "Zreče", "120", "110", "105", "101", "100", "99", "Kombinirana", "130"];
/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti
 */
function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}


/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */
function generirajPodatke(stPacienta, callback) {
  sessionId = getSessionId();
  ehrId = "";
  var tabela = [];
  switch (stPacienta) {
    case 1:
      tabela = pacient1;
      break;
    case 2:
      tabela = pacient2;
      break;
    case 3:
      tabela = pacient3;
  }
  var imeBika = tabela[0];
  var datumRojstva = tabela[1];
  var pasma = tabela[2];
  var rejec = tabela[3];
  var lokacija = tabela[4];

  var okvir = tabela[5];
  var noge = tabela[6];
  var vime = tabela[7];
  var somatskeCelice = tabela[8];
  var posebnaMera = tabela[9];
  var iztokMleka = tabela[10];
  var prireja = tabela[11];
  var dolgozivost = tabela[12];

    $.ajaxSetup({
        headers: {"Ehr-Session": sessionId}
    });

    $.ajax({
        url: baseUrl + "/ehr",
        type: 'POST',
        async: false,
        success: function (data) {
            ehrId = data.ehrId;
            var partyData = {
              firstNames: imeBika,
              partyAdditionalInfo: [
                {
                  key: "datumRojstva",
                  value: datumRojstva
                },
                {
                  key: "ehrId", 
                  value: ehrId
                },
                {
                  key: "pasma",
                  value: pasma
                },
                {
                  key: "rejec",
                  value: rejec
                },
                {
                  key: "lokacija",
                  value: lokacija
                },
                {
                  key: "okvir",
                  value: okvir
                },
                {
                  key: "noge",
                  value: noge
                },
                {
                  key: "vime",
                  value: vime
                },
                {
                  key: "somatskeCelice",
                  value: somatskeCelice
                },
                {
                  key: "posebnaMera",
                  value: posebnaMera
                },
                {
                  key: "iztokMleka",
                  value: iztokMleka
                },
                {
                  key: "prireja",
                  value: prireja
                },
                {
                  key: "dolgozivost",
                  value: dolgozivost
                }
              ]
            };
            $.ajax({
                url: baseUrl + "/demographics/party",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(partyData),
                success: function (party) {
                    if (party.action == 'CREATE') {
                        console.log("Uspešno kreiran pacient");
                    }
                },
                error: function(err) {
                  console.log("Napaka " +
                    JSON.parse(err.responseText).userMessage );
                }
            });
        }
    });
  callback(ehrId);
}

function narediBike() {
  var eid1 = "0";
  var eid2 = "0";
  var eid3 = "0";
  generirajPodatke(1, function(id1){eid1 = id1;});
  generirajPodatke(2, function(id2){eid2 = id2;});
  generirajPodatke(3, function(id3){eid3 = id3;});

  var novoOkno = window.open("", "Kreirani pacienti", "width=320,height=250");
  novoOkno.document.write('<!DOCTYPE html>\
                          <html lang="en">\
                          <head>\
                            <meta charset="UTF-8">\
                            <title>Kreirani pacienti</title>\
                            <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">\
                            <script src="knjiznice/js/jquery-2.2.3.min.js"></script>\
                          </head>\
                          <body>\
                            <div style="margin: 10px;">\
                              <div class="form-group">\
                                <span class="label label-info label-xs">Pacient1</span>\
                                <input type="text" class="form-control" id="p1" style="width: 300px;" readonly value="'+eid1+'">\
                              </div>\
                              <div class="form-group">\
                                <span class="label label-info label-xs">Pacient2</span>\
                                <input type="text" class="form-control" id="p2" style="width: 300px;" readonly value="'+eid2+'">\
                              </div>\
                              <div class="form-group">\
                                <span class="label label-info label-xs">Pacient3</span>\
                                <input type="text" class="form-control" id="p3" style="width: 300px;" readonly value="'+eid3+'">\
                              </div>\
                              <button type="button" style="float: right;" class="btn btn-danger btn-xs" onclick="self.close()">Zapri okno</button>\
                            </div>\
                          </body>\
                          </html>');
}
function dodajNovegaBika() {
  sessionId = getSessionId();

  var imeBika = $("#vnosIme").val();
  var datumRojstva = $("#vnosDatum").val();
  var pasma = $("#vnosPasma").val();
  var rejec = $("#vnosRejec").val();
  var lokacija = $("#vnosLokacija").val();

  var okvir = $("#vnosOkvir").val();
  var noge = $("#vnosNoge").val();
  var vime = $("#vnosVime").val();
  var somatskeCelice = $("#vnosSomatskeCelice").val();
  //posebna mera
  var iztokMleka = $("#vnosMleko").val();
  var prireja = $("input[name='optradio']:checked").val();
  var dolgozivost = $("#vnosDolgozivost").val();
  

  var posebnaMera;
  switch (pasma) {
    case "":
      posebnaMera = "";
      break;
    case "0":
      posebnaMera = $("#vnosRobustnost").val();
      break;
    case "1":
      posebnaMera = $("#vnosOmisicenost").val();
      break;
    case "2":
      posebnaMera = $("#vnosKriz").val();
      break;
  }

  if (!imeBika || !datumRojstva || !pasma || !rejec || !lokacija || !okvir || !noge || !vime || !somatskeCelice || !iztokMleka || !posebnaMera || !prireja || !dolgozivost ||
      imeBika.trim().length == 0 ||
      datumRojstva.trim().length == 0 ||
      pasma.trim().length == 0 ||
      rejec.trim().length == 0 ||
      lokacija.trim().length == 0 ||
      okvir.trim().length == 0 ||
      noge.trim().length == 0 ||
      vime.trim().length == 0 ||
      somatskeCelice.trim().length == 0 ||
      iztokMleka.trim().length == 0 ||
      posebnaMera.trim().length == 0 ||
      prireja.trim().length == 0 ||
      dolgozivost.trim().length == 0) {
    $("#odzivKreacije").html('<h6 style="display:inline-block; margin-left: 10px;"><span class="label label-pill label-danger">Prosimo vnesite vse podatke</span></h6>');
  } else {
    $.ajaxSetup({
        headers: {"Ehr-Session": sessionId}
    });

    $.ajax({
        url: baseUrl + "/ehr",
        type: 'POST',
        success: function (data) {
            var ehrId = data.ehrId;
            var partyData = {
              firstNames: imeBika,
              partyAdditionalInfo: [
                {
                  key: "datumRojstva",
                  value: datumRojstva
                },
                {
                  key: "ehrId", 
                  value: ehrId
                },
                {
                  key: "pasma",
                  value: pasma
                },
                {
                  key: "rejec",
                  value: rejec
                },
                {
                  key: "lokacija",
                  value: lokacija
                },
                {
                  key: "okvir",
                  value: okvir
                },
                {
                  key: "noge",
                  value: noge
                },
                {
                  key: "vime",
                  value: vime
                },
                {
                  key: "somatskeCelice",
                  value: somatskeCelice
                },
                {
                  key: "posebnaMera",
                  value: posebnaMera
                },
                {
                  key: "iztokMleka",
                  value: iztokMleka
                },
                {
                  key: "prireja",
                  value: prireja
                },
                {
                  key: "dolgozivost",
                  value: dolgozivost
                }
              ]
            };
            $.ajax({
                url: baseUrl + "/demographics/party",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(partyData),
                success: function (party) {
                    if (party.action == 'CREATE') {
                        $("#odzivKreacije").html("<h6 style='display:inline-block; margin-left: 10px;'><span class='label " +
                          "label-pill label-success fade-in'>Uspešno kreiran EHR '" +
                          ehrId + "'.</span></h6>");
                    }
                },
                error: function(err) {
                  $("#odzivKreacije").html("<h6 style='display:inline-block; margin-left: 10px;'><span class='label label-pill " +
                    "label-danger fade-in'>Napaka '" +
                    JSON.parse(err.responseText).userMessage + "'!</span></h6>");
                }
            });
        }
    });
  }
}

function preberiBika() {
  sessionId = getSessionId();

  var ehrId = $("#vnosEHRId").val();

  if (!ehrId || ehrId.trim().length == 0) {
    $("#odzivIzpisa").html('<h6 style="display:inline-block; margin-left: 10px;"><span class="label label-pill label-danger">Prosimo vnesite podatek.</span></h6>');
  } else {
    // Seznam s podatki (kljuc podatek)
    var array = {};
    var imeBika = "";

    $.ajax({
      url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
      type: 'GET',
      headers: {"Ehr-Session": sessionId},
        success: function (data) {
        var party = data.party;
        imeBika = party.firstNames;
        // Preberi podatke iz additional info
        for (var i = 0; i < party.partyAdditionalInfo.length; i++) {
          var temp = $.map(party.partyAdditionalInfo[i], function(value, index) {
            return value;
          });
          array[temp[2]] = temp[3];
        }  
        narisiPodatke(array, imeBika);
      },
      error: function(err) {
        $("#odzivIzpisa").html("<span class='obvestilo label " +
          "label-danger fade-in'>Napaka '" +
          JSON.parse(err.responseText).userMessage + "'!");
      }
    });

  }
}

function narisiPodatke(array, imeBika) {
  // Ugotovi katera lastnost je se pommena glede na pasmo bikeca
  var posebnaMera = "";
  var slika = "";
  var pasma = "";

  if (array["pasma"] == "1") {
    posebnaMera = "Omišičenost";
    pasma = "Lisasta";
  }
  else if (array["pasma"] == "2") {
    posebnaMera = "Križ";
    pasma = "Rjava";
  }
  else {
    posebnaMera = "Robustnost";
    pasma = "Črnobela";
  }

  if (array["prireja"] == "Mleko")
    slika = '<img src=".\\knjiznice\\pictures\\prireja-mleka.png" style="display: inline-block; width: 10%;"></h2> (Mlecna reja)';
  else if (array["prireja"] == "Meso")
    slika = '<img src=".\\knjiznice\\pictures\\prireja-mesa.png" style="display: inline-block; width: 10%;"></h2> (Mesna reja)';
  else
    slika = '<img src=".\\knjiznice\\pictures\\prireja-kombinirana.png" style="display: inline-block; width: 10%;"></h2> (Kombinirana reja)';

  var predstavitevPodatkov = $("#predstavitevPodatkov");
  predstavitevPodatkov.empty();
  predstavitevPodatkov.append(' <table style="width: 90%; margin-top: 30px; margin-left: 20px;"> \
                                  <tr>\
                                    <td style="width: 50%">\
                                      <div class="panel panel-success">\
                                        <div class="panel-heading" style="position:relative;">\
                                          <strong><h2>'+imeBika+' '+ slika + '\
                                          <br>ID: '+ array["ehrId"] +'\
                                          <br>Rojen: ' + array["datumRojstva"] + '\
                                          <br>Pasma: ' + pasma + '\
                                          <br>Rejec: '+array["rejec"]+'<br>Kraj: '+array["lokacija"]+'</strong>\
                                          <img src=".\\knjiznice\\pictures\\bull-head.png" style="width: 60px; height: 60px; position:absolute;right:0px;">\
                                        </div>\
                                      </div>\
                                    </td>\
                                    <td>\
                                      <div class="panel panel-default">\
                                        <div class="panel-heading" style="margin: 0px; background-color: #ffff66;"> <strong>Izboljsuje lastnosti:</strong><span onmouseover="" style="cursor: help;" class="info glyphicon glyphicon-question-sign" data-toggle="modal" data-target="#pomoc-ikone"></span></div>\
                                        <div class="panel-body" style="margin: 0px; background-color: #ffff99;" id="boljseLastnosti"> </div>\
                                      </div>\
                                    </td>\
                                  </tr>\
                                </table>');
  predstavitevPodatkov.append(' <table style="width: 90%; margin-top: 30px;"> <tr> <td style="width: 100%"> <div id="chartdiv" style="margin: 0 auto; width: 90%; height: 250px; background-color: #FFFFFF;"></div> </td> </tr> <tr><td> <button onmouseover="" style="margin-left: 51%; cursor: help;" type="button" class="btn btn-info btn-xs" data-toggle="modal" data-target="#pv12-info">Kaj je PV12?</button> </td> </tr>  </table>');
  AmCharts.makeChart("chartdiv",
      {
        "type": "serial",
        "categoryField": "category",
        "maxSelectedSeries": 6,
        "maxSelectedTime": 0,
        "rotate": true,
        "maxZoomFactor": 26,
        "zoomOutButtonImageSize": 16,
        "startDuration": 1,
        "startEffect": "bounce",
        "accessibleTitle": "",
        "hideBalloonTime": 155,
        "theme": "light",
        "categoryAxis": {
          "gridPosition": "start"
        },
        "trendLines": [],
        "graphs": [
          {
            "balloonColor": "#3790D1",
            "balloonText": "[[open]] - [[close]]",
            "bulletOffset": -1,
            "closeField": "close",
            "fillAlphas": 1,
            "fontSize": -1,
            "gapPeriod": 1,
            "id": "Prikaz-podatkov",
            "maxBulletSize": 48,
            "minBulletSize": 3,
            "openField": "open",
            "title": "Graf",
            "type": "column"
          }
        ],
        "guides": [],
        "valueAxes": [
          {
            "baseValue": 100,
            "id": "ValueAxis-1",
            "stackType": "regular",
            "autoRotateCount": 0,
            "labelOffset": -1,
            "minHorizontalGap": 74,
            "offset": -2,
            "title": "Vrednost v PV12"
          }
        ],
        "allLabels": [],
        "balloon": {
          "fillColor": "#A2D5E7"
        },
        "titles": [
          {
            "id": "Title-1",
            "size": 15,
            "text": "Lastnosti hčera glede na bika"
          }
        ],
        "dataProvider": [
          {
            "category": "Okvir",
            "open": array["okvir"] <= 100 ? array["okvir"] : 100,
            "close": array["okvir"] <= 100 ? 100 : array["okvir"]
          },
          {
            "category": posebnaMera,
            "open": array["posebnaMera"] <= 100 ? array["posebnaMera"] : 100,
            "close": array["posebnaMera"] <= 100 ? 100 : array["posebnaMera"]
          },
          {
            "category": "Noge",
            "open": array["noge"] <= 100 ? array["noge"] : 100,
            "close": array["noge"] <= 100 ? 100 : array["noge"]
          },
          {
            "category": "Vime",
            "open": array["vime"] <= 100 ? array["vime"] : 100,
            "close": array["vime"] <= 100 ? 100 : array["vime"]
          },
          {
            "category": "Somatske celice",
            "open": array["somatskeCelice"] <= 100 ? array["somatskeCelice"] : 100,
            "close": array["somatskeCelice"] <= 100 ? 100 : array["somatskeCelice"]
          },
          {
            "category": "Iztok mleka",
            "open": array["iztokMleka"] <= 100 ? array["iztokMleka"] : 100,
            "close": array["iztokMleka"] <= 100 ? 100 : array["iztokMleka"]
          },
          {
            "category": "Dolgozivost",
            "open": array["dolgozivost"] <= 100 ? array["dolgozivost"] : 100,
            "close": array["dolgozivost"] <= 100 ? 100 : array["dolgozivost"]
          }
        ]
      }
    );
  var boljseLastnosti = $("#boljseLastnosti");
  if (array["vime"] > 100)
    boljseLastnosti.append("<img src='.\\knjiznice\\pictures\\vime.png' style='float: left; width: 14%; margin: 2%;' >");
  if (array["somatskeCelice"] > 100)
    boljseLastnosti.append("<img src='.\\knjiznice\\pictures\\somatske-celice.png' style='float: left; width: 9%; margin: 2%;' >");
  if (array["noge"] > 100)
    boljseLastnosti.append("<img src='.\\knjiznice\\pictures\\noge.png' style='float: left; width: 14%; margin: 2%;' >");
  if (array["okvir"] > 100)
      boljseLastnosti.append("<img src='.\\knjiznice\\pictures\\okvir.png' style='float: left; width: 14%; margin: 2%;' >");
  if (array["iztok"] > 100)
      boljseLastnosti.append("<img src='.\\knjiznice\\pictures\\iztok-mleka.png' style='float: left; width: 9%; margin: 2%;' >");
  if (array["dolgozivost"] > 100)
    boljseLastnosti.append("<img src='.\\knjiznice\\pictures\\dolgozivost.png' style='float: left; width: 14%; margin: 2%;' >");
  if (array["posebnaMera"] > 100) {
    if (posebnaMera == "Križ")
      boljseLastnosti.append("<img src='.\\knjiznice\\pictures\\kriz.png' style='float: left; width: 14%; margin: 2%;' >");
    else if (posebnaMera == "Robustnost")
      boljseLastnosti.append("<img src='.\\knjiznice\\pictures\\robustnost.png' style='float: left; width: 14%; margin: 2%;' >");
    else if (posebnaMera == "Omišičenost")
      boljseLastnosti.append("<img src='.\\knjiznice\\pictures\\misice.png' style='float: left; width: 14%; margin: 2%;' >");
  }

}

function preberiWikipedioOPasmi() {
  var jezik = $("#jezikWiki").val();
  var osnovni = "http://"+ jezik + ".wikipedia.org/w/api.php";
  var dostop = "?action=parse&format=json&prop=text&noimages=1";
  
  // CB, Lisasto, Rjavo (domace)
  var stranSL = ["&pageid=290207", "&pageid=289600", "&pageid=96944"];
  var stranEN = ["&pageid=369836", "&pageid=6424109", "&pageid=26051975"]
  var obkljukan = $("input[name='katera-pasma']:checked").val();
  var pasma = 0;

  // Preberi pasmo iz EHRScape
  if (obkljukan == "ehrWiki") {
    sessionId = getSessionId();
    var ehrId = $("#ehrWiki").val();

    if (!ehrId || ehrId.trim().length == 0) {
      $("#article").empty();
      $("#vir1").empty();
      $("#odzivPoizvedbe").html('<h6 style="display:inline-block; margin-left: 10px;"><span class="label label-pill label-danger">Prosimo vnesite podatek.</span></h6>');
    } else {
    $.ajax({
      url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
      type: 'GET',
      async: false,
      headers: {"Ehr-Session": sessionId},
        success: function (data) {
          var party = data.party;
          var array = {};
          // Preberi podatke iz additional info
          for (var i = 0; i < party.partyAdditionalInfo.length; i++) {
            var temp = $.map(party.partyAdditionalInfo[i], function(value, index) {
              return value;
            });
            array[temp[2]] = temp[3];
          }
          pasma = array["pasma"];
        },
        error: function(err) {
          $("#odzivPoizvedbe").html("<span class='obvestilo label " +
            "label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
        }
      });
      var page = "";
      var sekcija = 0;
      if (jezik == "sl") {
        page = stranSL[pasma];
      }
      else
        page = stranEN[pasma];
      var section = "&section="+ sekcija;
      //ajax call to wikipedia
      $.ajax({
        type: "GET",
        url: osnovni + dostop + page + section + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
          var markup = data.parse.text["*"];
          var i = $('<div></div>').html(markup);
          
          // Odstrani povezave, ker ne delajo
          i.find('a').each(function() { 
            $(this).replaceWith($(this).html()); 
          });
          
          // Odstrani reference
          i.find('sup').remove();
          // Odstrani slike
          i.find('img').remove();
          i.find('.thumb').remove();
          
          // Odstrani cite error
          i.find('.mw-ext-cite-error').remove();
          
          $('#article').html($(i).find('p'));
          $('#vir1').html("vir: Wikipedia");
          $("#odzivPoizvedbe").html('<h6 style="display:inline-block; margin-left: 10px;"><span class="label label-pill label-success">Uspesen dostop.</span></h6>');
        },
        error: function (errorMessage) {
          $("#odzivPoizvedbe").html("<span class='obvestilo label " +
            "label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
        }
      });
    }
  } else {
    // Preberi pasmo iz selected
    pasma = $("#pasmaWiki").val();
    if (!pasma) {
      $("#article").empty();
      $("#vir1").empty();
      $("#odzivPoizvedbe").html('<h6 style="display:inline-block; margin-left: 10px;"><span class="label label-pill label-danger">Prosimo vnesite podatek.</span></h6>');
    }
    else {
      var page = "";
      var sekcija = 0;
      if (jezik == "sl") {
        page = stranSL[pasma];
      }
      else
        page = stranEN[pasma];
      var section = "&section="+ sekcija;
      //ajax call to wikipedia
      $.ajax({
        type: "GET",
        url: osnovni + dostop + page + section + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
          var markup = data.parse.text["*"];
          var i = $('<div></div>').html(markup);
          
          // Odstrani povezave, ker ne delajo
          i.find('a').each(function() { 
            $(this).replaceWith($(this).html()); 
          });
          
          // Odstrani reference
          i.find('sup').remove();
          // Odstrani slike
          i.find('img').remove();
          i.find('.thumb').remove();
          
          // Odstrani cite error
          i.find('.mw-ext-cite-error').remove();
          
          $('#article').html($(i).find('p'));
          $('#vir1').html("vir: Wikipedia");
          $("#odzivPoizvedbe").html('<h6 style="display:inline-block; margin-left: 10px;"><span class="label label-pill label-success">Uspesen dostop.</span></h6>');
        },
        error: function (errorMessage) {
          $("#odzivPoizvedbe").html("<span class='obvestilo label " +
            "label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
        }
    });

    }
  }
  }    


$(document).ready(function() {
  
  // Dodaj vnosne podatke, glede na pasmo
  $("#vnosPasma").change(function() {
      var pasma = $(this).val();
      var hcer = document.getElementById("podatkiHcer");
      switch (pasma) {
        case "":
          // Nic ni izbrano
          $(hcer).empty();
          hcer.innerHTML = '<h6 style="display:inline-block; margin-left: 10px;"><span class="label label-pill label-warning">Prosimo izberite pasmo za nadaljni vnos podatkov</span></h6>';
          break;
        case "0":
          //Crnobela pasma
          $(hcer).empty();
          hcer.innerHTML = '<span class="label label-default">Okvir</span><input type="number" id="vnosOkvir" class="form-control input-sm" placeholder="99">\
              <span class="label label-default">Robustnost</span><input type="number" id="vnosRobustnost" class="form-control input-sm" placeholder="127">\
              <span class="label label-default">Noge</span><input type="number" id="vnosNoge" class="form-control input-sm" placeholder="114">\
              <span class="label label-default">Vime</span><input type="number" id="vnosVime" class="form-control input-sm" placeholder="104">\
              <span class="label label-default">Somatske celice</span><input type="number" id="vnosSomatskeCelice" class="form-control input-sm" placeholder="99">\
              <span class="label label-default">Iztok mleka</span><input type="number" id="vnosMleko" class="form-control input-sm" placeholder="87">\
              <span class="label label-default">Dolgozivost</span><input type="number" id="vnosDolgozivost" class="form-control input-sm" placeholder="87">';
          break;
        case "1":
          //Lisasta pasma
          $(hcer).empty();
          hcer.innerHTML = '<span class="label label-default">Okvir</span><input type="number" id="vnosOkvir" class="form-control input-sm" placeholder="114">\
              <span class="label label-default">Omišičenost</span><input type="number" id="vnosOmisicenost" class="form-control input-sm" placeholder="87">\
              <span class="label label-default">Noge</span><input type="number" id="vnosNoge" class="form-control input-sm" placeholder="141">\
              <span class="label label-default">Vime</span><input type="number" id="vnosVime" class="form-control input-sm" placeholder="130">\
              <span class="label label-default">Somatske celice</span><input type="number" id="vnosSomatskeCelice" class="form-control input-sm" placeholder="110">\
              <span class="label label-default">Iztok mleka</span><input type="number" id="vnosMleko" class="form-control input-sm" placeholder="129">\
              <span class="label label-default">Dolgozivost</span><input type="number" id="vnosDolgozivost" class="form-control input-sm" placeholder="87">';
          break;
         case "2":
          //Rjava pasma
          $(hcer).empty();
          hcer.innerHTML = '<span class="label label-default">Okvir</span><input type="number" id="vnosOkvir" class="form-control input-sm" placeholder="112">\
              <span class="label label-default">Križ</span><input type="number" id="vnosKriz" class="form-control input-sm" placeholder="117">\
              <span class="label label-default">Noge</span><input type="number" id="vnosNoge" class="form-control input-sm" placeholder="92">\
              <span class="label label-default">Vime</span><input type="number" id="vnosVime" class="form-control input-sm" placeholder="113">\
              <span class="label label-default">Somatske celice</span><input type="number" id="vnosSomatskeCelice" class="form-control input-sm" placeholder="93">\
              <span class="label label-default">Iztok mleka</span><input type="number" id="vnosMleko" class="form-control input-sm" placeholder="101">\
              <span class="label label-default">Dolgozivost</span><input type="number" id="vnosDolgozivost" class="form-control input-sm" placeholder="87">';
          break;
      }
  });

  // Prikazije tooltipe nad slikicami
   $('[data-toggle="tooltip"]').tooltip();   
});
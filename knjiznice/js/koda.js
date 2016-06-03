
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";


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
function generirajPodatke(stPacienta) {
  ehrId = "";

  // TODO: Potrebno implementirati

  return ehrId;
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
  var iztokMleka = $("#vnosMleko").val();

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

  if (!imeBika || !datumRojstva || !pasma || !rejec || !lokacija || !okvir || !noge || !vime || !somatskeCelice || !iztokMleka || !posebnaMera ||
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
      posebnaMera.trim().length == 0) {
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
            console.log(rejec);
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
    $.ajax({
      url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
      type: 'GET',
      headers: {"Ehr-Session": sessionId},
        success: function (data) {
        var party = data.party;
        var array = $.map(party.partyAdditionalInfo[0], function(value, index) {
          return [value];
        });
        console.log(array);
      },
      error: function(err) {
        $("#odzivIzpisa").html("<span class='obvestilo label " +
          "label-danger fade-in'>Napaka '" +
          JSON.parse(err.responseText).userMessage + "'!");
      }
    });
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
              <span class="label label-default">Iztok mleka</span><input type="number" id="vnosMleko" class="form-control input-sm" placeholder="87">';
          break;
        case "1":
          //Lisasta pasma
          $(hcer).empty();
          hcer.innerHTML = '<span class="label label-default">Okvir</span><input type="number" id="vnosOkvir" class="form-control input-sm" placeholder="114">\
              <span class="label label-default">Omišičenost</span><input type="number" id="vnosOmisicenost" class="form-control input-sm" placeholder="87">\
              <span class="label label-default">Noge</span><input type="number" id="vnosNoge" class="form-control input-sm" placeholder="141">\
              <span class="label label-default">Vime</span><input type="number" id="vnosVime" class="form-control input-sm" placeholder="130">\
              <span class="label label-default">Somatske celice</span><input type="number" id="vnosSomatskeCelice" class="form-control input-sm" placeholder="110">\
              <span class="label label-default">Iztok mleka</span><input type="number" id="vnosMleko" class="form-control input-sm" placeholder="129">';
          break;
         case "2":
          //Rjava pasma
          $(hcer).empty();
          hcer.innerHTML = '<span class="label label-default">Okvir</span><input type="number" id="vnosOkvir" class="form-control input-sm" placeholder="112">\
              <span class="label label-default">Križ</span><input type="number" id="vnosKriz" class="form-control input-sm" placeholder="117">\
              <span class="label label-default">Noge</span><input type="number" id="vnosNoge" class="form-control input-sm" placeholder="92">\
              <span class="label label-default">Vime</span><input type="number" id="vnosVime" class="form-control input-sm" placeholder="113">\
              <span class="label label-default">Somatske celice</span><input type="number" id="vnosSomatskeCelice" class="form-control input-sm" placeholder="93">\
              <span class="label label-default">Iztok mleka</span><input type="number" id="vnosMleko" class="form-control input-sm" placeholder="101">';
          break;
      }
  });
});
$(document).ready(function() {

  $.ajax({
  'url': 'http://157.230.17.132:4004/sales',
  'method': 'GET',
  'success': function (response) {

    // GRAFICO VENDITE ANNO 2017
    var mesi = {
      'January': 0,
      'February': 0,
      'March': 0,
      'April': 0,
      'May': 0,
      'June': 0,
      'July': 0,
      'August': 0,
      'September': 0,
      'October': 0,
      'November': 0,
      'December': 0

    };
    console.log(response);
    // ciclo tutti i risultati e preparo un oggetto
    // con chiave = nome del mese e valore = totale vondita in quel mese
    for (var i = 0; i < response.length; i++) {
    var vendita = response[i];
    var importo = vendita.amount;
    // recupero la data della vendita in formato 12/02/2017
    var data_vendita = vendita.date;
    console.log(data_vendita);
    // costruisco un oggetto moment leggendo la data con il formato corretto
    var moment_data = moment(data_vendita, "DD/MM/YYYY");
    // creo il mese in formato letterale esteso dalla data della vendita
    var  mese_vendita = moment_data.format('MMMM');

    mesi[mese_vendita] += importo;
    }
    var label_mesi = Object.keys(mesi);
    var dati_mesi = Object.values(mesi);

    disegna_grafico_vendite_annuali(label_mesi, dati_mesi)

    // GRAFICO VENDITE PER VENDITORE
    var vendite = {};
    var totale_vendite = 0;
    // ciclo i risultati e preparo un oggetto con chiave = venditore e valore = totale venduto
    for (var i = 0; i < response.length; i++) {
      var vendita = response[i];
      var venditore = vendita.salesman;
      var importo = vendita.amount;
      // array di oggetti
      var venditori_inseriti = Object.keys(vendite);
      // se venditori_inseriti non include il nome del venditore
      if(!venditori_inseriti.includes(venditore)) {
        // vado a inserirlo
        vendite[venditore] = importo;
      } else {
        vendite[venditore] += importo;
      }

      totale_vendite += importo;
    }

    // preparo le percentuali di vendita per ogni venditore
    if(totale_vendite > 0) {
      for (var venditore in vendite) {
        var totale_vendite_venditore = vendite[venditore];
        var percentuale_vendite_venditore = totale_vendite_venditore * 100 / totale_vendite;
        // aggiorno il valore delle vendite con la percentuale
        vendite[venditore] = percentuale_vendite_venditore.toFixed(1);
      }
      var label_venditori = Object.keys(vendite);
      var dati_vendite_per_venditore = Object.values(vendite);

      // chiamo la funzione e gli passo i due parametri
      disegna_grafico_vendite_venditore(label_venditori, dati_vendite_per_venditore);
    } else {
      $('#messaggio_no_grafico').removeClass('hidden');
    }
  },
  'error': function() {
    alert('si è verificato un errore');
  }
  });
});

  function disegna_grafico_vendite_annuali(mesi, importi) {
    var chart = new Chart($('#grafico_annuale'), {
        type: 'line',
        data: {
            labels: mesi,
            datasets: [{
                label: 'Vendite annuali totali',
                backgroundColor: 'blue',
                borderColor: 'lime',
                // se si vuole solo la linea senza il colore di sfondo inserire fill:'false'
                // fill:'false',
                data: importi
            }]
        },
        options: {}
    });
  }

  // dichiaro la funzione
  function disegna_grafico_vendite_venditore(nomi, dati) {

    var myPieChart = new Chart($('#grafico_contributo_venditore'), {
      'type': 'pie',
      'data': {
        'datasets': [{
          'data': dati,
          'backgroundColor': ['cyan', 'red', 'yellow', 'green']
        }],
         'labels': nomi
      },
      'options': {
          'title': {
              'display': true,
              'text': 'Vendite per venditore 2017'
          }
      }
    });

  }

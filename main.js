$(document).ready(function() {

  $.ajax({
  'url': 'http://157.230.17.132:4004/sales',
  'method': 'GET',
  'success': function (response) {

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
  // dichiaro la funzione
  function disegna_grafico_vendite_venditore(nomi, dati) {

    var myPieChart = new Chart($('#grafico_contributo_venditore'), {
      'type': 'pie',
      'data': {
        'datasets': [{
          'data:': dati,
          'backgroundColor': ['cyan', 'red', 'yellow', 'green']
        }],
         'labels': nomi
      },
      'options': {
          'title': {
              'display': true,
              'text': 'Grafico contributo venditore 2017'
          }
      }
    });

  }

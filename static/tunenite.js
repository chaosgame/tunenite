$(document).ready(function(){
  function renderVenuePlaylist(result) {
    $('#query_view').hide();
    $playlist_view = $('#playlist_view');
    $playlist_view.empty();

    $('<img src=\'' + result.icon + '\'>')
      .appendTo($playlist_view);
    $('<br/>')
      .appendTo($playlist_view);
    $('<a href=\'' + result.url + '\'>' + result.url + '</a>')
      .appendTo($playlist_view);
    $playlist_view.show();
  }

  function queryVenuePlaylist(e) {
    $result = $(e.target).parent('#results > .result');

    var url = '/venue_playlist/' + $result.attr('venue_id');
    $.ajax({
      'url': url,
      'dataType': 'json'
    }).done(renderVenuePlaylist);
  }

  function renderResult(result) {
    $li = $(
    '<li class=\'result\'>' +
      '<span class=\'name\'>' + result.name + '</span>' +
      '<span class=\'city\'>(' + result.city + ')</span>' +
    '</li>')
    .click(queryVenuePlaylist)
    .attr('venue_id', result.venue_id)
    .appendTo($('#query_view > #results'));
  }

  function queryResults(e) {
    if (e.which != 13) {
      return;
    }

    $('#query_view > #results').empty();

    e.preventDefault();
    var url = '/venue_search/' + encodeURIComponent($(e.target).val());

    $.ajax({
      'url': url,
      'dataType': 'json'
    }).done(function(results) {
      _.each(results, renderResult);
    });
  }

  $('#query_view > #search').keypress(queryResults);
});

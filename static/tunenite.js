$(document).ready(function(){
  function renderVenuePlaylist(result) {
    $playlist_view = $('#playlist_view');
    $playlist_view.empty();

    $('body').css('background', 'url(' + result.icon + ') repeat');
    $('<a href=\'' + result.url + '\'>' + result.url + '</a>')
      .appendTo($playlist_view);
    $("#loading_view").hide();

    // TODO(nathan) display a back to results

    $playlist_view.fadeIn();
  }

  function queryVenuePlaylist(e) {
    $result = $(e.target).parent('#search_results > .result');

    $('#search_view').slideUp();
    $("#loading_view").show();

    // TODO(nathan) error handling
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
      '<span class=\'city\'>' + result.city + '</span>' +
    '</li>')
    .click(queryVenuePlaylist)
    .attr('venue_id', result.venue_id)
    .appendTo($('#search_results'));
  }

  function searchQueryFocusout(e) {
    $target = $(e.target);

    if ($target.val() == '') {
      $target.addClass('default_text');
      $target.val('Enter Concert Venue');
    }
  }

  function searchQueryFocusin(e) {
    $target = $(e.target);

    if ($target.hasClass('default_text')) {
      $target.select();

      // Work around Chrome's little problem
      $target.mouseup(function() {
          // Prevent further mouseup intervention
          $target.unbind("mouseup");
          return false;
      });
    }
  }

  function searchQueryKeypress(e) {
    $target = $(e.target);

    if ($target.hasClass('default_text')) {
      $target.removeClass('default_text');
      $target.val('');
    }

    if (e.which != 13) {
      return;
    }

    $('#search_results').empty();

    e.preventDefault();
    var url = '/venue_search/' + encodeURIComponent($target.val());

    $('#search_view').slideUp();
    $('#playlist_view').fadeOut();
    $("#loading_view").show();

    $.ajax({
      'url': url,
      'dataType': 'json'
    }).done(function(results) {
      $("#loading_view").hide();
      _.each(results, renderResult);
      $('#search_view').slideDown();
    });
  }

  $('#search_query').keypress(searchQueryKeypress);
  $('#search_query').focusout(searchQueryFocusout);
  $('#search_query').focusin(searchQueryFocusin);
});

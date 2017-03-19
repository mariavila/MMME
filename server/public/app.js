
function routeView(view) {
  $.ajax({
    url: "/geocoding.html",
  })
    .done(function( html ) {
        $("#container").innerHtml(html);
    });
}

window.routeView = routeView;

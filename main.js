var map;
var arrMarkers = [];
var arrInfoWindows = [];

function mapInit(){
  var centerCoord = new google.maps.LatLng(40.857, -73.866); // Central Bronx
  var mapOptions = {
    zoom: 12,
    center: centerCoord,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  $.getJSON("bronx_parks.json", {}, function(data){
    data = $(data.features).sort(sortJsonName);
    $.each(data, function(i, item){
      $("#markers").append('<li><a href="#" rel="' + i + '">' + item.properties.name + '</a></li>');
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(item.geometry.coordinates[1], item.geometry.coordinates[0]),
        map: map,
        title: item.properties.name
      });
      arrMarkers[i] = marker;
      var infowindow = new google.maps.InfoWindow({
        content: "<b>"+ item.properties.name + "</b><br><a href="+ item.properties.url +">more info</a>"
      });
      arrInfoWindows[i] = infowindow;
      google.maps.event.addListener(marker, 'click', function() {
        for(x=0; x < arrInfoWindows.length; x++){ arrInfoWindows[x].close(); }
        arrInfoWindows[i].open(map, arrMarkers[i]);
      });
    });
  });
}

function sortJsonName(a,b) {
  return a.properties.name.toLowerCase() > b.properties.name.toLowerCase() ? 1 : -1;
};

$(function(){
  // initialize map (create markers, infowindows and list)
  mapInit();

  // "live" bind click event
  $("#markers a").live("click", function(){
    var i = $(this).attr("rel");
    for(x=0; x < arrInfoWindows.length; x++){ arrInfoWindows[x].close(); }
    arrInfoWindows[i].open(map, arrMarkers[i]);
  });
});


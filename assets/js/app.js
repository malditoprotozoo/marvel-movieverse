$(document).ready(function() {
  $.when(getInfo(marvelUniverse)).done(function() {
    setTimeout(function() {
      postInfo(marvelUniverse);
    }, 1000)
  });
  deleteVideo("#modal");
});

/* Obtiene información de la API */
var getInfo = (function(mainArr) {
  var titlesArr = [];
  var yearsArr = [];
  for (var i = 0; i < mainArr.length; i++) {
    titlesArr.push(mainArr[i].title);
    yearsArr.push(mainArr[i].year);
  }
  for (var n = 0; n < titlesArr.length; n++) {
    var queryString = "https://www.omdbapi.com/?apikey=3a181f1c&t=" + titlesArr[n].replace(/ /g, "+") + "&y=" + yearsArr[n];
    console.log(queryString);
    $.ajax({
      url: queryString,
      method: "GET"
    }).done(function(response) {
      if (response.Response === "False") {
        console.log("Sorry, no movies were found :(");
      } else {
        if (response.Ratings.length >= 3) {
          for (var c = 0; c < mainArr.length; c++) {
            var eachObj = mainArr[c];
            if (eachObj.title == response.Title) {
              eachObj.ratings = response.Ratings[1].Value;
              // eachObj.plot = response.Plot;
              // eachObj.poster = response.Poster;
            }
          }
        }
        if (response.Plot !== undefined) {
          for (var x = 0; x < mainArr.length; x++) {
            var eachObj = mainArr[x];
            if (eachObj.title == response.Title) {
              eachObj.plot = response.Plot;
              eachObj.poster = response.Poster;
            }
          }
        } else {
          for (var x = 0; x < mainArr.length; x++) {
            var eachObj = mainArr[x];
            if (eachObj.title == response.Title) {
              eachObj.plot = "Coming Soon.";
              eachObj.poster = response.Poster;
            }
          }
        }
        if (response.Poster === "N/A") {
          for (var x = 0; x < mainArr.length; x++) {
            var eachObj = mainArr[x];
            if (eachObj.title == response.Title) {
              eachObj.poster = eachObj.newPoster;
            }
          }
        }
      }
    });
  };
});

/* Selecciona las películas con un rating por sobre el 80% */
var orderPerRating = (function(obj) {
  for (var key in obj) {
    if (parseInt(obj[key]) > 80) {
      bestMovies[key] = obj[key];
    }
  }
  console.log(bestMovies);
});

/* Toma la información de la data y la postea en la página */
var postInfo = (function(arr) {
  for (var i = 0; i < arr.length; i++) {
    var postThis = `<div class="content">`+`<h2>`+ arr[i].title + `</h2><img src="` + arr[i].poster + `" alt="` + arr[i].title + `"></div>`;
      $(postThis).appendTo("#movies").css("display", "none");
  }
  setTimeout(function() {
    contentGenerator($(".content"), marvelUniverse);
    showInfo();
  }, 2000);
});
/* Cambia el display de la información posteada de display none a block */
var showInfo = (function() {
  $(".content").slideDown("slow");
});

/* Genera el contenido de cada modal */
var contentGenerator = (function(toApply, arr) {
  var modalTitle = $("#modal-title");
  var posterContainer = $("#poster");
  var trailerContainer = $("#trailer");
  var infoContainer = $("#info");
  var firstAppearanceContainer = $("#first-appearance");
  var mostPopularContainer = $("#most-popular");
  var whereToBeginContainer = $("#where-to-begin");
  $(toApply).click(function() {
    $(modalTitle).html("");
    $(posterContainer).children().remove();
    $(trailerContainer).children().remove();
    $(infoContainer).children().remove();
    $(firstAppearanceContainer).children().remove();
    $(mostPopularContainer).children().remove();
    $(whereToBeginContainer).children().remove();
    var toCompare = $(this).children("img").attr("alt");
    for (var i = 0; i < arr.length; i++) {
      var obj = arr[i];
      if (obj.title == toCompare) {
        $(modalTitle).append(obj.title);
        if (obj.newPoster == undefined) {
          $(posterContainer).append(`<img src="` + obj.poster + `" class="modal-poster">`);
        } else {
          $(posterContainer).append(`<img src="` + obj.newPoster + `" class="modal-poster">`);
        }
        $(trailerContainer).append(`<iframe src="` + obj.trailer + `" frameborder="0" allowfullscreen></iframe>`);
        if (obj.plot == undefined) {
          obj.plot = "Coming Soon";
          $(infoContainer).append(`<p class="p-plot">` + obj.plot + `</p>`);
        } else {
          $(infoContainer).append(`<p class="p-plot">` + obj.plot + `</p>`);
        }
        var url = "https://www.bookdepository.com/search?searchTerm=" + obj.mostPopularComic.replace(/#/g, "") + "&search=Find+book";
        $(firstAppearanceContainer).append(`<a href="https://www.bookdepository.com/search?searchTerm=` + obj.firstAppearance.replace(/#/g, "") + `&search=Find+book" target="_blank"><span class="description-comic">First Appearance of ` + obj.protagonist + `</span><img src="` + obj.imageAppearance + `" class="img-comic"></a>`);
        $(mostPopularContainer).append(`<a href="https://www.bookdepository.com/search?searchTerm=` + obj.mostPopularComic.replace(/#/g, "") + `&search=Find+book" target="_blank"><span class="description-comic">Most Popular Comic of ` + obj.protagonist + `</span><img src="` + obj.imagePopularComic + `" class="img-comic"></a>`);
        $(whereToBeginContainer).append(`<a href="https://www.bookdepository.com/search?searchTerm=` + obj.whereToBegin.replace(/#/g, "") + `&search=Find+book" target="_blank"><span class="description-comic">Where should you start reading ` + obj.protagonist + `</span><img src="` + obj.imageToBegin + `" class="img-comic"></a>`);
        $("#modal").modal("show");
      }
    }
  });
});

var deleteVideo = (function(modal) {
  $(modal).on("hidden.bs.modal", function() {
    $("#trailer").children().remove();
  })
});

// $('#pic-top').append('<img class="responsive-img circle profilepic right" src="' +
//        + photoURL + '.jpg">');

// function printFantasyMovies() {
//   var imgCategory = $('#movieImgs1');
//   for (var i = 0; i < data.length; i++) {
//     if (data[i].genero === 'Fantasía, Familiar' || data[i].genero === 'Fantasía, Drama' && $(imgCategory).children() <= 5) {
//       imgCategory.append('<div class="images col s3 m3 l3 xl3">  <a href="#"> <img src="' + data[i].poster
//                         + '" style="width:100%"></a> <h5 class="name">' + data[i].nombre +'</h5> <p style="font-weight:bold; font-size:1em;">'
//                         + data[i].año + '</p> </div>');
//     }
//   }
//   $('#categoria1').append('<h3>Fantasy</h3>');
// }
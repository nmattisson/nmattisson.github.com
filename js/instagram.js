function createPhotoElement(a){return $("<div>").addClass("entry").attr("id",a.id).append($("<div>").addClass("photo").append($("<a>").attr("target","_blank").attr("href",a.link).append($("<img>").attr("src",a.images.standard_resolution.url))).append($("<div>").addClass("row").append($("<div>").addClass("date").append($("<a>").attr("target","_blank").attr("href",a.link).text(moment(1e3*parseInt(a.created_time)).format("MMMM Do")))).append($("<div>").addClass("caption").text(a.caption.text))))}function didLoadInstagram(a,t){console.log("Did Load Instagram");var d=this;$.each(t.data,function(a,t){$(d).append(createPhotoElement(t))})}$(document).ready(function(){var a="329068.8a2f81e.1a12ad9a9349410d9b17ed569472a4";$(".instagram").on("didLoadInstagram",didLoadInstagram),$(".instagram").instagram({userId:"329068",accessToken:a,show:"20"})});

(function($){
  $.fn.instagram = function(options) {
    var that = this,
        apiEndpoint = "https://api.instagram.com/v1",
        settings = {
            hash: null
          , userId: null
          , locationId: null
          , search: null
          , accessToken: null
          , clientId: null
          , show: null
          , onLoad: null
          , onComplete: null
          , maxId: null
          , minId: null
          , next_url: null
        };
        
    options && $.extend(settings, options);
    
    function createPhotoElement(photo) {
      return $('<div>')
        	.addClass('instagram_entry')
        	.attr('id', photo.id)
        	
			.append(
                $('<div>')
                .addClass('instagram_image')
                .append(
                    $('<a>')
                    .attr('target', '_blank')
                    .attr('href', photo.link)
				    .append(
                        $('<img>')
                        .attr('src', photo.images.standard_resolution.url)
                    )
                )
                .append(
        $('<div>')
        .addClass('instagram_date')
        .append(
                  $('<a>')
                  .attr('target', '_blank')
                  .attr('href', photo.link)
            .text(createDateStr(photo.created_time))
        )
       )
                .append(
                    $('<div>')
                    .addClass('instagram_caption')
                    .text(photo.caption.text)
                )
            );
    }

	function createDateStr (created_time) {
		d = new Date(parseInt(created_time)*1000);
		return $.datepicker.formatDate('MM d', d);
	}
    
    function createEmptyElement() {
      return $('<div>')
        .addClass('instagram')
        .attr('id', 'empty')
        .append($('<p>').html('No photos for this query'));
    }
    
    function composeRequestURL() {

      var url = apiEndpoint,
          params = {};
      
      if (settings.next_url != null) {
        return settings.next_url;
      }

      if(settings.hash != null) {
        url += "/tags/" + settings.hash + "/media/recent";
      }
      else if(settings.search != null) {
        url += "/media/search";
        params.lat = settings.search.lat;
        params.lng = settings.search.lng;
        settings.search.max_timestamp != null && (params.max_timestamp = settings.search.max_timestamp);
        settings.search.min_timestamp != null && (params.min_timestamp = settings.search.min_timestamp);
        settings.search.distance != null && (params.distance = settings.search.distance);
      }
      else if(settings.userId != null) {
        url += "/users/" + settings.userId + "/media/recent";
      }
      else if(settings.locationId != null) {
        url += "/locations/" + settings.locationId + "/media/recent";
      }
      else {
        url += "/media/popular";
      }
      
      settings.accessToken != null && (params.access_token = settings.accessToken);
      settings.clientId != null && (params.client_id = settings.clientId);
      settings.minId != null && (params.min_id = settings.minId);
      settings.maxId != null && (params.max_id = settings.maxId);

      url += "?" + $.param(params)
      
      return url;
    }
    
    settings.onLoad != null && typeof settings.onLoad == 'function' && settings.onLoad();
    
    $.ajax({
      type: "GET",
      dataType: "jsonp",
      cache: false,
      url: composeRequestURL(),
      success: function(res) {
        var length = typeof res.data != 'undefined' ? res.data.length : 0;
        var limit = settings.show != null && settings.show < length ? settings.show : length;
        if(limit > 0) {
          for(var i = 0; i < limit; i++) {
            that.append(createPhotoElement(res.data[i]));
          }
        }
        else {
          that.append(createEmptyElement());
        }

        settings.onComplete != null && typeof settings.onComplete == 'function' && settings.onComplete(res.data, res);
		
      }
    });
    return this;
  };
})(jQuery);

(function( $ ){
nmTwitter = {
	// Main function, makes API call and generates HTML with help of format functions below
	run: function(settings) {
		$.ajax({
			url: 'http://api.twitter.com/1/statuses/user_timeline.json/',
			type: 'GET',
			dataType: 'jsonp',
			data: {
				screen_name: settings.user,
				count: settings.num_tweets,
				include_rts: true,
				include_entities: true,
				exclude_replies: true
			},
			success: function(data, textStatus, xhr) {
				// Formatting of HTML to be appended with every tweet
				var html = settings.html_format;

				 // Generate and append HTML to specified div
				 for (var i = 0; i < data.length; i++) {						
					$(settings.div).append(
						html.replace('{tweet_text}', nmTwitter.format.tweet(data[i].text, data[i].entities))
							.replace('{tweet_date}', nmTwitter.format.date(data[i].created_at, settings.date_format))
							.replace('{tweet_url}', 'http://twitter.com/' + settings.user + '/status/' + data[i].id_str)
					);
				 }
			}	
		});
	},
	
	// Collection of functions for formatting the tweets. 
	// In part adapted from http://twitter.com/javascripts/widgets/widget.js
	format: {
		date: function(date_string, date_format) {
			d = new Date(date_string);
			return $.datepicker.formatDate(date_format, d);
	    },

		link: function (tweet_text, entities) {
			// URL Regex: http://daringfireball.net/2010/07/improved_regex_for_matching_urls
			var url_regex = /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi;
			var urls = tweet_text.match(url_regex);
			
			if (urls) {
				for (var i = 0; i < urls.length; i++) {
					// Extract host name and TLD from URL
					var a = document.createElement('a');
					a.href = entities.urls[i].expanded_url;
					// Strip www. from host
					var host = a.hostname.replace(/^www\./,'');
					
					// Generate HTML for link and return result
					var link = "<a href=\"" + entities.urls[i].expanded_url + "\">" + host + "</a>"
					tweet_text = tweet_text.replace(urls[i], link);
				}
			}
			return tweet_text;
		},
		
		at: function(tweet) {
        	return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
          		return '<a href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
        	});
      	},

      	list: function(tweet) {
        	return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
          		return '<a href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
        	});
      	},

      	hash: function(tweet) {
        	return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
          		return before + '<a href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
        	});
      	},

		tweet: function(tweet_text, expanded_url) {
			return this.hash(this.at(this.list(this.link(tweet_text, expanded_url))));
		}
	}
};
})( jQuery );
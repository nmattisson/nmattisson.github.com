/*! jQuery Instagram - v0.3.0 - 2013-08-10
* https://potomak.github.com/jquery-instagram
* Copyright (c) 2013 Giovanni Cappellotto; Licensed MIT */
!function(e){function n(n){var a="https://api.instagram.com/v1",l={};if(null==n.accessToken&&null==n.clientId)throw"You must provide an access token or a client id";if(l=e.extend(l,{access_token:n.accessToken,client_id:n.clientId,count:n.count}),null!=n.url)a=n.url;else if(null!=n.hash)a+="/tags/"+n.hash+"/media/recent";else if(null!=n.search)a+="/media/search",l=e.extend(l,n.search);else if(null!=n.userId){if(null==n.accessToken)throw"You must provide an access token";a+="/users/"+n.userId+"/media/recent"}else null!=n.location?(a+="/locations/"+n.location.id+"/media/recent",delete n.location.id,l=e.extend(l,n.location)):a+="/media/popular";return{url:a,data:l}}e.fn.instagram=function(a){var l=this;a=e.extend({},e.fn.instagram.defaults,a);var t=n(a);return e.ajax({dataType:"jsonp",url:t.url,data:t.data,success:function(e){l.trigger("didLoadInstagram",e)}}),this.trigger("willLoadInstagram",a),this},e.fn.instagram.defaults={accessToken:null,clientId:null,count:null,url:null,hash:null,userId:null,location:null,search:null}}(jQuery);
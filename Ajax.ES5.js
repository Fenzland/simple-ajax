!function( global, mod ){  return (global.define && global.define.amd)? global.define(mod) : global.Ajax= mod();  }(this,function(){
	"use strict";

	var httpRequest= function( method, url, headers, body ){
		var response;
		var listeners= {};
		var xhr= new XMLHttpRequest;

		xhr.onreadystatechange= function(){
			if( xhr.readyState==4 )
			{
				response= {
					status: xhr.status,
					statusText: xhr.statusText,
					content: xhr.responseText,
					getHeader: function( name ){  return xhr.getResponseHeader( name );  },
				};

				try{
					response.json= JSON.parse( xhr.responseText );
				}
				catch( e )
				{
					response.json= null;
				}

				if( listeners[xhr.status] )
				{
					listeners[xhr.status].forEach( function( listener ){  listener( response );  } );
				}

				if( listeners[0] )
				{
					listeners[0].forEach( function( listener ){  listener( response );  } );
				}
			}
		};

		xhr.open( method, url, true );

		for( name in headers )
		{
			xhr.setRequestHeader( name, headers[name] );
		}

		xhr.send( body );

		return {

			"then": function( listener ){
				if( response )
				{
					listener( response );
				}else{
					(listeners[0] || (listeners[0]= [])).push( listener );
				}

				return this;
			},

			"when": function( status, listener ){
				if( response )
				{
					if( status==response.status )
					{
						listener( response );
					}
				}else{
					(listeners[status] || (listeners[status]= [])).push( listener );
				}

				return this;
			},

		}

	};


	return {

		"OPTIONS": function( url, headers )
		{
			headers || (headers={});

			return httpRequest( 'HEAD', url, headers, null );
		},

		"HEAD": function( url, headers )
		{
			headers || (headers={});

			return httpRequest( 'HEAD', url, headers, null );
		},

		"GET": function( url, headers )
		{
			headers || (headers={});

			return httpRequest( 'GET', url, headers, null );
		},

		"DELETE": function( url, headers )
		{
			headers || (headers={});

			return httpRequest( 'DELETE', url, headers, null );
		},

		"POST": function( url, body, headers )
		{
			headers || (headers={});

			return httpRequest( 'POST', url, headers, body );
		},

		"PUT": function( url, body, headers )
		{
			headers || (headers={});

			return httpRequest( 'PUT', url, headers, body );
		},

		"PATCH": function( url, body, headers )
		{
			headers || (headers={});

			return httpRequest( 'PATCH', url, headers, body );
		},

		"get": function( url, params, headers )
		{
			params || (params={});
			headers || (headers={});

			headers['X-Requested-With']= "XMLHttpRequest";

			return httpRequest( 'GET', buildQuery(params,url), headers );
		},

		"post": function( url, params, headers )
		{
			params || (params={});
			headers || (headers={});

			headers['X-Requested-With']= "XMLHttpRequest";
			headers['Content-Type']= "application/x-www-form-urlencoded";

			return httpRequest( 'POST', url, headers, buildQuery(params) );
		},

		"put": function( url, params, headers )
		{
			params || (params={});
			headers || (headers={});

			headers['X-Requested-With']= "XMLHttpRequest";
			headers['Content-Type']= "application/x-www-form-urlencoded";

			return httpRequest( 'PUT', url, headers, buildQuery(params) );
		},

		"patch": function( url, params, headers )
		{
			params || (params={});
			headers || (headers={});

			headers['X-Requested-With']= "XMLHttpRequest";
			headers['Content-Type']= "application/x-www-form-urlencoded";

			return httpRequest( 'PATCH', url, headers, buildQuery(params) );
		},

	};

	function buildQuery( parameters, url )
	{
		url || (url= '');

		var delimiter= url? (url.indexOf('?')+1? '&' : '?') : '';

		for( var key in parameters )
		{
			url+= delimiter+key+'='+encodeURIComponent(parameters[key]);
			delimiter= '&';
		}

		return url;
	}
});

(( global, mod )=>(global.define && global.define.amd)?global.define(mod):global.Ajax=mod())(this,()=>{
	"use strict";

	const httpRequest= ( method, url, headers, body )=>Object.assign(
		new Promise(
			( resolve, reject )=>{
				const xhr= new XMLHttpRequest;
				xhr.onreadystatechange= ()=>{
					if( xhr.readyState==4 ){
						const response= {
							status: xhr.status,
							statusText: xhr.statusText,
							content:xhr.responseText,
							getHeader: name=>xhr.getResponseHeader(name),
						};

						try{
							response.json= JSON.parse(xhr.responseText);
						}catch(e){
							response.json= null;
						}

						resolve(response);
					}
				}
				xhr.open(method,url,true);

				for( name in headers ){
					xhr.setRequestHeader(name,headers[name]);
				}

				xhr.send(body);
			}
		)
		,
		{
			when( status, callback ){
				return this.then( response=>(status===response.status?callback(response):null,response)),this;
			},
		}
	);

	return {

		OPTIONS( url, headers={} )
		{
			return httpRequest( 'HEAD', url, headers, null );
		},

		HEAD( url, headers={} )
		{
			return httpRequest( 'HEAD', url, headers, null );
		},

		GET( url, headers={} )
		{
			return httpRequest( 'GET', url, headers, null );
		},

		DELETE( url, headers={} )
		{
			return httpRequest( 'DELETE', url, headers, null );
		},

		POST( url, body, headers={} )
		{
			return httpRequest( 'POST', url, headers, body );
		},

		PUT( url, body, headers={} )
		{
			return httpRequest( 'PUT', url, headers, body );
		},

		PATCH( url, body, headers={} )
		{
			return httpRequest( 'PATCH', url, headers, body );
		},

		get( url, params={} )
		{
			return httpRequest( 'POST', buildQuery(params,url) );
		},

		post( url, params={} )
		{
			return httpRequest( 'POST', url, {"Content-Type":"application/x-www-form-urlencoded",}, buildQuery(params) );
		},

		put( url, params={} )
		{
			return httpRequest( 'PUT', url, {"Content-Type":"application/x-www-form-urlencoded",}, buildQuery(params) );
		},

		patch( url, params={} )
		{
			return httpRequest( 'PATCH', url, {"Content-Type":"application/x-www-form-urlencoded",}, buildQuery(params) );
		},

	};

	function buildQuery( parameters, url='' )
	{
		let delimiter= url? (url.indexOf('?')+1? '&' : '?') : '';

		for( let key in parameters )
		{
			url+= delimiter+key+'='+encodeURIComponent(parameters[key]);
			delimiter='&';
		}
		return url;
	}
});

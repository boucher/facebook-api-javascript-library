
function XMLHttpRequest() {
    if(window.XMLHttpRequest) return new XMLHttpRequest();
    else if(window.ActiveXObject)
    {
        try { return new ActiveXObject("Msxml2.XMLHTTP"); }
        catch(anException)
        {
            try { return new ActiveXObject("Microsoft.XMLHTTP"); }
            catch(anException) { }
        }
    }
    
    return null;
}


function FacebookRestClient(serverAddr, sessionKey, apiKey, secret)
{
	this._secret= 		secret,
	this._sessionKey= 	sessionKey,
	this._apiKey=		apiKey,
	this._serverUrl=	serverAddr;			
	
	this.callMethod = function(method, params, callback) 
	{
		var currentTime = new Date();
		var time = currentTime.getTime();
		
		params.push("method="+method);
		params.push("session_key="+this._sessionKey);
		params.push("api_key=" + this._apiKey);
		params.push("call_id=" + time);
		params.push("sig=" + this.generateSig(params));
		
		this.postRequest(this, params, callback);
	}
	
	this.generateSig = function(params)
	{
		var request = "";
		params.sort();
		
		for(var i=0; i<params.length; i++)
		{
			request+=params[i];
		}
		
		request+=this._secret;
		
		return hex_md5(request);
	}
	
	this.postRequest= function(sender, params, callback)
	{
		var request= XMLHttpRequest();
		request.onreadystatechange = sender.processRequestChange;
		
		var request = "";
		params.sort();
		
		for(var i=0; i<params.length; i++)
		{
			request+=params[i];
		}

		request.open("POST", request, true);
		request.send("");
	}
		
	return this;
}

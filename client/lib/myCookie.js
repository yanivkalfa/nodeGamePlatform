(function($){
    $.fn.myCookie = function(obj){
        if(typeof obj === 'undefined'){
            return false;
        }

        var s = {
            oDef : {
                exp : (typeof obj.exp !== 'undefined' && obj.exp !== "") ? parseInt(obj.exp) : 60*60*24*30/* 30 days*/,
                path : (typeof obj.path !== 'undefined' && obj.path !== "") ? obj.path : '/',
                del : (typeof obj.del !== 'undefined' && obj.del !== "") ? (obj.del) ? true : false : false
            },
            init : function(){
                /* checking if cookie is set */
                if(typeof obj.cName === 'undefined' || typeof obj.cName === ''){
                    return false;
                }

                /* checking if we want to delete the cookie*/
                if(s.oDef.del && s.oFns.getCookie() !== false){
                    s.oDef.exp = 0;
                    return s.oFns.setCookie();
                }

                /* checking if both cookie name and value are set if so setting the cookie */
                if((typeof obj.cVal !== 'undefined' && obj.cVal!== false) || (typeof obj.exp !== 'undefined' && obj.exp)){
                    if(s.oFns.getCookie()){
                        return s.oFns.setCookie(true);
                    }else{
                        return s.oFns.setCookie(false);
                    }
                }

                if(typeof obj.cName !== 'undefined'){
                    return s.oFns.getCookie();
                }

                return false;
            },
            oFns : {
                setCookie : function(update)
                {
                    var d = new Date(), expires = "", value;
                    if(update){
                        if(typeof obj.oDef !== 'undefined' && typeof obj.oDef.exp !== 'undefined' && obj.oDef.exp != ""){
                            d.setTime(d.getTime()+(obj.oDef.exp*1000));
                            expires = "expires="+d.toGMTString();
                        }
                        value = (typeof obj.cVal !== 'undefined') ? JSON.stringify(obj.cVal) : "" ;
                    }
                    else
                    {
                        d.setTime(d.getTime()+(s.oDef.exp*1000));
                        expires = "expires="+d.toGMTString();
                        value = JSON.stringify(obj.cVal) ;
                    }

                    document.cookie = obj.cName.replace("=", "") + "=" + value + "; " + expires + '; path=' + s.oDef.path + ';'
                    return true;
                },
                getCookie : function ()
                {
                    var name = obj.cName + "=", ca = document.cookie.split(';'), cVal;
                    for(var i=0; i<ca.length; i++)
                    {
                        var c = ca[i].trim();
                        if (c.indexOf(name)==0){
                            cVal = c.substring(name.length,c.length);
                            try{ return JSON.parse(cVal); }
                            catch(err) { return cVal; }
                        }
                    }
                    return false;
                }
            }
        };
        return s.init();
    }
})(jQuery);
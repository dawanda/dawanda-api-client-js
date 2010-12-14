DaWanda = {};
DaWanda.API = function(apiKey, language){
  this.apiKey               = null
  this.host                 = null
  this.API_VERSION          = 1
  this.CALLBACK_PARAM_NAME  = "callback"
  this.AVAILABLE_LANGUAGES  = ["de", "fr", "en"]
  this.cache                = {}
  
  // check for dependencies
  if(!this.supportedLibAvailable())
     throw("This frameworks requires either the Prototype + it's jsonp extension OR the jQuery framework.");
  
  if(!apiKey)
    throw("Initialization failed due to missing api key! Please pass a key as first param.");
    
  if(!language)
    throw("Initialization failed due to unspecified language! Please pass the language as second param.");
  
  if(this.AVAILABLE_LANGUAGES.indexOf(language) == -1)
    throw("DaWanda only supports the following languages: "+this.AVAILABLE_LANGUAGES.join(", "));
  
  this.apiKey = apiKey;
  this.host = "http://" + language + DaWanda.API.BaseHost;
}

DaWanda.API.BaseHost = ".dawanda.com"

DaWanda.API.prototype = {
  prototypeAvailable: function() {
    return (typeof Prototype != "undefined") && (typeof Ajax.JSONRequest != "undefined")
  },
  
  jQueryAvailable: function() {
    return (typeof jQuery != "undefined")
  },
  
  supportedLibAvailable: function() {
    return this.prototypeAvailable() || this.jQueryAvailable()
  },

  
  searchUsers: function(keyword, options) {
    var url = this.getApiUrl("searchUsers");
    options = this.addKeywordToOptions(keyword, options);
    this.requestApi(url, options);
  },
  
  searchShops: function(keyword, options) {
    var url = this.getApiUrl("searchShops");
    options = this.addKeywordToOptions(keyword, options);
    this.requestApi(url, options);
  },
  
  searchProducts: function(keyword, options) {
    var url = this.getApiUrl("searchProducts");
    options = this.addKeywordToOptions(keyword, options);
    this.requestApi(url, options);
  },
  
  searchProductForColor: function(keyword, id, options) {
    var url = this.getApiUrl("searchProductForColor", id);
    options = this.addKeywordToOptions(keyword, options);
    this.requestApi(url, options);
  },
  
  getUserDetails: function(id, options) {
    var url = this.getApiUrl("getUserDetails", id);
    this.requestApi(url, options);
  },
  
  getUserPinboards: function(id, options) {
    var url = this.getApiUrl("getUserPinboards", id);
    this.requestApi(url, options);
  },
  
  getShopDetails: function(id, options) {
    var url = this.getApiUrl("getShopDetails", id);
    this.requestApi(url, options);
  },
  
  getProductsForShop: function(id, options) {
    var url = this.getApiUrl("getProductsForShop", id);
    this.requestApi(url, options);
  },
  
  getProductsForPinboard: function(id, options) {
    var url = this.getApiUrl("getProductsForPinboard", id);
    this.requestApi(url, options);
  },
  
  getPinboardDetails: function(id, options) {
    var url = this.getApiUrl("getPinboardDetails", id);
    this.requestApi(url, options);
  },
  
  getCategoriesForShop: function(id, options) {
    var url = this.getApiUrl("getCategoriesForShop", id);
    this.requestApi(url, options);
  },
  
  getShopCategoryDetails: function(id, options) {
    var url = this.getApiUrl("getShopCategoryDetails", id);
    this.requestApi(url, options);
  },
  
  getProductsForShopCategory: function(id, options) {
    var url = this.getApiUrl("getProductsForShopCategory", id);
    this.requestApi(url, options);
  },
  
  getTopCategories: function(options) {
    var url = this.getApiUrl("getTopCategories");
    this.requestApi(url, options);
  },
  
  getCategoryDetails: function(id, options) {
    var url = this.getApiUrl("getCategoryDetails", id);
    this.requestApi(url, options);
  },
  
  getChildrenOfCategory: function(id, options) {
    var url = this.getApiUrl("getChildrenOfCategory", id);
    this.requestApi(url, options);
  },
  
  getProductsForCategory: function(id, options) {
    var url = this.getApiUrl("getProductsForCategory", id);
    this.requestApi(url, options);
  },
  
  getProductDetails: function(id, options) {
    var url = this.getApiUrl("getProductDetails", id);
    this.requestApi(url, options);
  },
  
  getColors: function(options) {
    var url = this.getApiUrl("getColors");
    this.requestApi(url, options);
  },
  
  getProductsForColor: function(id, options) {
    var url = this.getApiUrl("getProductsForColor", id);
    this.requestApi(url, options);
  },
  
  
  getApiUrl: function(callee, id) {
    var endpoints = {
      "searchUsers": "/users/search.js", 
      "searchShops": "/shops/search.js", 
      "searchProducts": "/products/search.js", 
      "searchProductForColor": "/colors/#{id}/products/search.js", 
      "getUserDetails": "/users/#{id}.js", 
      "getUserPinboards": "/users/#{id}/pinboards.js", 
      "getShopDetails": "/shops/#{id}.js", 
      "getProductsForShop": "/shops/#{id}/products.js", 
      "getProductsForPinboard": "/pinboards/#{id}/products.js", 
      "getPinboardDetails": "/pinboards/#{id}.js", 
      "getCategoriesForShop": "/shops/#{id}/shop_categories.js", 
      "getShopCategoryDetails": "/shop_categories/#{id}.js", 
      "getProductsForShopCategory": "/shop_categories/#{id}/products.js", 
      "getTopCategories": "/categories/top.js", 
      "getCategoryDetails": "/categories/#{id}.js", 
      "getChildrenOfCategory": "/categories/#{id}/children.js", 
      "getProductsForCategory": "/categories/#{id}/products.js", 
      "getProductDetails": "/products/#{id}.js", 
      "getColors": "/colors.js", 
      "getProductsForColor": "/colors/#{id}/products.js"
    };

    var template = "#{host}/api/v#{version}" + endpoints[callee];
    var result = template.replace("#{host}", this.host).replace("#{version}", this.API_VERSION).replace("#{id}", id);

    return result;
  },

  requestApi: function(url, options) {
    options = options || {};
    options.params = options.params || {};
    options.params.api_key = this.apiKey;

    var cacheKey = url + "?" 
    if (this.prototypeAvailable())
      cacheKey += Object.toQueryString(options.params)
    else {
      var queryStringParts = []

      jQuery.each(options.params, function(key, value) {
        queryStringParts.push([key, value].join("="))
      })

      cacheKey += queryStringParts.join("&")
    }

    var _this = this;

    if(this.cache[cacheKey]) {
      var data = this.cache[cacheKey];

      if(data.error) {
        if(options.onFailure) options.onFailure(data);
      } else {
        if(options.onSuccess) options.onSuccess(data.response);
      }
    } else {
      if(this.prototypeAvailable())
        this.doPrototypeRequest(url, options, cacheKey)
      else
        this.doJQueryRequest(url, options, cacheKey)
    }
  },

  addKeywordToOptions: function(keyword, options) {
    options = options || {};
    options.params = options.params || {};
    options.params.keyword = keyword;

    return options;
  },

  doPrototypeRequest: function(url, options, cacheKey) {
    var _this = this
    new Ajax.JSONRequest(url, {
      timeout: 30,
      callbackParamName: this.CALLBACK_PARAM_NAME,
      parameters: options.params,
      onSuccess: function(data) {
        data = data.responseJSON
        _this.cache[cacheKey] = data;
        if(data.error) {
          if(options.onFailure) options.onFailure(data);
        } else {
          if(options.onSuccess) options.onSuccess(data.response);
        }
      },
      onFailure: function(response) {
        _this.cache[cacheKey] = response;
        if(options.onFailure) options.onFailure(response);
      }
    });
  },

  doJQueryRequest: function(url, options, cacheKey) {
    var api = this
    jQuery.ajax({
      url: url,
      dataType: "jsonp",
      data: options.params,
      success: function(data) {
        api.cache[cacheKey] = data;
        if(data.error) {
          if(options.onFailure) options.onFailure(data);
        } else {
          if(options.onSuccess) options.onSuccess(data.response);
        }
      },
      error: function(data) {
        api.cache[cacheKey] = data;
        if(options.onFailure) options.onFailure(data);
      }
    })
  }
}

DaWanda.API.OAuth = function(key, secret, language) {
  this.AVAILABLE_LANGUAGES  = ["de", "fr", "en"]
 
  if(!OAuth)
    throw("Please add OAuth library to the document! Sources: http://oauth.googlecode.com/svn/code/javascript/oauth.js, http://oauth.googlecode.com/svn/code/javascript/sha1.js")
 
  if(!language)
    throw("Initialization failed due to unspecified language! Please pass the language as second param.");
  
  if(this.AVAILABLE_LANGUAGES.indexOf(language) == -1)
    throw("DaWanda only supports the following languages: "+this.AVAILABLE_LANGUAGES.join(", "));
  
  this.key        = key
  this.secret     = secret
  this.language   = language
  this.host       = "http://" + language + DaWanda.API.BaseHost
  this.endpoints  = {
    authorize: this.host + "/oauth/authorize",
    request_token: this.host + "/oauth/request_token",
    access_token: this.host + "/oauth/access_token"
  }
}

DaWanda.API.OAuth.prototype.requestAuthorization = function(callback) {
  // check for ?
  var callbackString = window.location.href + "?key="+this.key + "&token=" + this.secret + "&endpoint=" + escape(this.endpoints.authorize)
  var url = this.endpoints.authorize + "?oauth_token=" + this.key + "&oauth_callback=" + escape(callbackString)
    // 
    // 
    // $parsed = parse_url($this->endpoints["request_token"]);
    // $params = array(callback => $this->base_url);
    // parse_str($parsed['query'], $params);
    // 
    // $req_req = OAuthRequest::from_consumer_and_token($this->consumer, NULL, "GET", $this->endpoints["request_token"], $params);
    // $req_req->sign_request($this->sig_method, $this->consumer, NULL);
    // 
    // $req_token = $this->doHttpRequest($req_req->to_url());
    // parse_str ($req_token,$tokens);
    // 
    // $oauth_token = $tokens['oauth_token'];
    // $oauth_token_secret = $tokens['oauth_token_secret'];
    // 
    // $callback_url = "$this->base_url/$callback_file?key=$this->key&token=$oauth_token&token_secret=$oauth_token_secret&endpoint=" . urlencode($this->endpoints["authorize"]);
    // $auth_url = $this->endpoints["authorize"] . "?oauth_token=$oauth_token&oauth_callback=".urlencode($callback_url);
    // 
    // http://de.dawanda.com/oauth/authorize?oauth_callback=http%3A%2F%2Flocalhost%2F%7Esdepold%2Fdawanda-api-client-php%2Fexamples%2Foauth%2Findex.php%3Fkey%3D8rvQGF1FmiKrqVCzuIm7%26token%3D685RS3k0e3Sz0HMpJSG9%26token_secret%3DlxrnMxR1IeaDc4UYznMj0gLJj80ClSuUukrvOFIg%26endpoint%3Dhttp%253A%252F%252Fde.dawanda.com%252Foauth%252Fauthorize&oauth_token=685RS3k0e3Sz0HMpJSG9&persistent=true
  
  window.location.href = url
}

DaWanda.API.OAuth.prototype.doHttpRequest = function(url) {
  var accessor = {
    token: "",
    tokenSecret: "",
    consumerKey : this.key,
    consumerSecret: this.secret
  }
  var message = {
    action: url,
    method: "GET",
    parameters: {a:1}
  }

  OAuth.completeRequest(message, accessor);        
  OAuth.SignatureMethod.sign(message, accessor);
  url = url + '?' + OAuth.formEncode(message.parameters);
  console.log(url)
}
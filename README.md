# Development proxy

Are you using some form of an apache web server, such as tomcat, to serve your REST api while doing your front-end development work in Meteor?

If so, then you might encounter these two problems:

1) The apache server serves on a different port than your app, and so you can't just call your REST apis using the relative form `/api/dosomething`

2) CORS restrictions might prevent you from making any REST calls from the Meteor based client side to the Apache based REST server, because the apache server uses a different port than Meteor's. For example, apache servers commonly use `localhost:8080`, whereas Meteor's default setup serves to `localhost:3000`.

This proxy will recognise calls to certain routes on your local Meteor server and send then to the other (possibly apache) server. For example  

    localhost:3000/rest/

can be sent to 

    localhost:8080/rest/


> It is up to you to ensure that the proxy is enabled only when you need it. 

For example, once you deploy to production, where your front-end code is served by apache or some other server, the proxy may no longer be necessary. To ensure that the DevProxy is enabled only in development you could use code like this:
  
```javascript
if (process.env.NODE_ENV === "development" && typeof DevProxy !== 'undefined') {
    DevProxy.addProxy( .... )
}
```


## Installation

    meteor install pbastowski:dev-proxy

## Usage

This package exports DevProxy, which has the following method that allows you to configure the proxying:

```javascript
DevProxy.addProxy ( source, target, replacePath );
```

Or, if you have more than one server that you want to proxy to, then you could do this:

```javascript
DevProxy.addProxy([
    // proxy all requests for "/myapp/img/" to "http://localhost:3000/img" (removing "/myapp")
    {source: '/myapp/img', target: 'http://localhost:3000', replacePath: { search: '/myapp/', replace: '/' }},

    // proxy all requests for "/myapp/api/" to "http://localhost:8080/myapp/api"
    {source: '/myapp/api/', target: 'http://localhost:8080' },

    // proxy only when the URL path is the exact string "/goo"
    {source: '/goo', target: 'https://www.google.com.au', exactMatch: true, replacePath: { search: '/goo', replace: '/' }}
]);
```

The example above also shows how to cater for the eventual deployment to a server that will require a prefix, such as "myapp", in the URL after the server name. So, you may be developing and testing on `localhost:3000/home`, but the target server may require an app name prefix, such that the URL will become `my.server.com/myapp/home`. To fix this, `replacePath` is used to remove the "myapp" prefix from the URL. In this way you won't have to make any changes to your app when you deploy it to the server.

- `source` is the source path of the URL on your Meteor server that needs to be proxied to the `target` server. Proxying will trigger if the URL on the server contains the `source` string.
- `target` is the target server URL that you want to forward your requests to.
- `replacePath` is optional. With replace path you can specify that a portion of your source path shoudl be replaced with a new string. For example if the `/rest/` path on your server is equivalent to the `/api/` path on the target, then replace path would look like this: `{ search: '/rest', replace: '/api' }`. `search` and `replace` can be any valid URL strings. 
- `exactMatch` is optional. When `true` the URL on the Meteor server must match exactly the `source` string to activate the proxying.

For example, the configuration below will proxy all calls made to `/rest/` to `http:localhost:8080/rest/`.

```javascript
if (process.env.NODE_ENV === "development" && DevProxy) {
    DevProxy.addProxy ( '/rest/', 'http://localhost:8080' , { search: '/rest', replace: '/api' } );
}
```

> Note: If the proxying is not working for you, try using `google.com` as the target. Google will display an error message to the user, including the requested path, when it receives a request for a path that it does not recognise. This may help you identify the problem.

# Changelog

### 1 Jul 2016 - v0.0.5

- Updated http-proxy to v1.14.0

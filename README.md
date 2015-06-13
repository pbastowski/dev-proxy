# Development proxy

Are you using some form of an apache web server, such as tomcat, to serve your REST api while doing your front-end development work in Meteor?

If so, then you might encounter these two problems:

1) The apache server serves on a different port than your app, and so you can't just call your REST apis using the relative form `/api/dosomething`

2) CORS restrictions might prevent you from making any REST calls from the Meteor based client side to the Apache based REST server, because the apache server uses a different port than Meteor's. For example, apache servers commonly use `localhost:8080`, whereas Meteor's default setup serves to `localhost:3000`.

This proxy will recognise calls to certain routes on your local Meteor server and send then to the other (possibly apache) server. For example  

    localhost:3000/rest/

can be sent to 

    localhost:8080/rest/

This remapping will only be done in the development environment. Once you deploy to production, where your front-end code is served by apache, or any other server, the proxying will no longer be necessary and will not actually happen. 

## Installation

    meteor install pbastowski:dev-proxy

## Usage

This package exports DevProxy, which has the following method that allows you to configure the proxying:

```javascript
DevProxy.addProxy ( source, target );
```

For example, the configuration below will proxy all calls made to `/rest/` to `http:localhost:8080/rest/`.

```javascript
if (process.env.NODE_ENV === "development" && DevProxy) {
    DevProxy.addProxy ( '/rest/', 'http://localhost:8080' );
}
```


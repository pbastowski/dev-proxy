if (process.env.NODE_ENV === "development") {

    var proxy = Npm.require('http-proxy');

    DevProxy = {
        addProxy: addProxy
    };

    function addProxy(source, target) {
        var apiProxy = proxy.createProxyServer({
            target: target //example: 'http://localhost:8080'
        });

        WebApp.connectHandlers
            .use(function (req, res, next) {
                if (req.url.indexOf(source) > -1) {
                    console.log('proxying ' + req.url);
                    apiProxy.web(req, res);
                }
                else {
                    next()
                }
            });

    }
}

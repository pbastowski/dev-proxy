if (process.env.NODE_ENV === "development") {

    var proxy = Npm.require('http-proxy');

    DevProxy = {
        addProxy: addProxy
    };

    function addProxy(source, target, replacePath) {
        var apiProxy = proxy.createProxyServer({
            target: target,
            changeOrigin: !!replacePath
        });

        WebApp.connectHandlers
            .use(function (req, res, next) {
                if (req.url.indexOf(source) > -1) {
                    if (replacePath)
                        req.url = req.url.replace(replacePath.search, replacePath.replace);

                    console.log('proxying ' + req.url, ' to: ', target);

                    apiProxy.web(req, res);
                }
                else {
                    next()
                }
            });

    }
}

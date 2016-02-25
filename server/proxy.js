//if (process.env.NODE_ENV === "development") {

    var httpProxy = Npm.require('http-proxy');

    DevProxy = {
        addProxy: addProxy
    };

    function addProxy(source, target, replacePath) {
        var proxies;

        // Did the user pass up to three parameters?
        if ("string" === typeof source && target) {
            proxies = [{ source: source, target: target, replacePath: replacePath, exactMatch: false }];
        }
        // Or perhaps they passed an array of objects?
        else if ( source instanceof Array) {
            proxies = source;
        }
        else
            throw new Error('DevProxy: The supplied arguments are not valid ' + JSON.stringify(arguments));

        // Enable all requested proxies
        proxies.forEach(function(config) {
            console.log('Proxy config:\n', JSON.stringify(config, null, 4));
            makeProxy( config.source, config.target, config.replacePath, config.exactMatch || false );
        });

        function makeProxy (source, target, replacePath, exactMatch) {
            var apiProxy = httpProxy.createProxyServer({
                target: target,
                changeOrigin: !!replacePath
            });

            WebApp.connectHandlers
                .use(function (req, res, next) {
                    if ((!exactMatch && req.url.indexOf(source) > -1) || (exactMatch && req.url === source)) {
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
//}

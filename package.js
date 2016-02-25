Package.describe({
    name:          'pbastowski:dev-proxy',
    version:       '0.0.4',
    summary:       'Proxy your REST api calls to a web server running on the same machine, but another port.',
    git:           'https://github.com/pbastowski/dev-proxy',
    documentation: 'README.md'
});

var npmDeps = {
    "http-proxy": "1.11.1",
};

Npm.depends(npmDeps);

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.2');
    api.use('webapp', 'server');
    api.add_files('server/proxy.js', 'server');
    api.export(['DevProxy'], 'server');
});


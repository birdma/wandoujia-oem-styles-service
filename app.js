var fs = require('fs');
var sass = require('node-sass');
var express = require('express');
var app = express();

var SOURCE = fs.readFileSync('./components/bootstrap-sass-official/assets/stylesheets/_bootstrap.scss');
var CACHE = null;
var color = null;
var navbar_color = null;

app.use('/bootstrap/fonts/', express.static(__dirname + "/components/bootstrap-sass-official/assets/fonts/bootstrap/"));

app.get('/bootstrap/bootstrap.css', function(req, res, next) {
    res.set({
        'Content-Type': 'text/css'
    });

    console.log(req.query);
    if (color === req.query.color && req.query.navbar_color === navbar_color) {
        console.log('cache hit');
        return res.send(CACHE);
    }

    var source = '';
    if(req.query.color) {
        color = req.query.color;
        navbar_color = req.query.navbar_color;
        var customSource = '$brand-primary: #' + req.query.color + ';\n'
                        + '$navbar-default-bg: #' + req.query.color + ';\n'
                        + '$navbar-default-color: #' + req.query.navbar_color + ';\n'
                        + '$navbar-default-link-color: #' + req.query.navbar_color + ';\n'
                        + '$navbar-default-link-hover-color: #' + req.query.navbar_color + ';\n'
                        + '$navbar-default-link-active-color: #' + req.query.navbar_color + ';\n'
                        + '$navbar-default-link-disabled-color: #' + req.query.navbar_color + ';\n'
                        + '$icon-font-path: "./fonts/";\n'


        console.log(customSource);

        source = source + customSource;
    }

    source = source + SOURCE;
    sass.render({
        data: source,
        includePaths: ['components/bootstrap-sass-official/assets/stylesheets'],
        success: function(css) {
            CACHE = css;
            
            res.send(css);
        },
        error: function(e) {
            color = null;
            next(e);
        }
    });
});

app.listen(5769, function() {
    console.log('listening on port', 5769);
});


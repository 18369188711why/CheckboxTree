var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, 'src')));
app.listen(4444, function () {
    console.log('App listening at port 4444;');
});
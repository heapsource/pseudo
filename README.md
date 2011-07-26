# pseudo

pseudo is a utility module which aims to improve maintenance of large [express.js](http://expressjs.com/) projects splitting actions and middlewares(filters) into different directories.

## Example Project Structure
    - app.js
    - actions
       home.js
       dashboard.js
    - filters
       requireLogin.js
       requireAdmin.js

## How it works

Let's setup you need a route as GET / that requires the user to be logged in.

### The express.js way
Using only express.js you will have do to something similar to this:
#### app.js
    // ... Load your app.
    function requireLogin(req, res, next) {
        // validate the user
        next();
    };
    
    app.get('/',requireLogin, function(req, res) {
       // render some view for the home page
    });
    // Start the server

Of course you can use module.exports and split the middleware but it requires some extra work.

### The pseudo way
Using pseudo loader you will have your middlewares into the filters directory and the actions in a directory with the same name:
#### app.js
    // ... Load your app.
    require('pseudo').init({Application:app,customContext:"This is my custom context stuff!"});
    // Start the server
    
#### actions/home.js
    var pseudo = require('pseudo')
    pseudo.get('/', {
        filters:['requireLogin'],
            action:function(req, res) {
                var greeting = this.customContext // use custom context bound values
                // render some view for the home page
	    }
    });

#### filters/requireLogin.js
    module.exports.filter = function(req, res, next) {
        // validate the user
        var greeting = this.customContext  // use custom context bound values
        next();
    }
    
## Download

You can install it using Node Package Manager (npm):

	    npm install pseudo
	
## Author
Johan Hernandez: johan@firebase.co
Drop me an email if you need anything, thanks!

## License

Copyright (c) 2011 Firebase.co

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
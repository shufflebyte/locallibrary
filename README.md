# LocalLibrary 

tutorial from:[https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs)

## Used technonlogy

* nodenv, node, express, mongodb

## Screenshot

sdfsdf

## MongoDB Database Layout

![Library Website - Mongoose_Express](README.assets/Library%20Website%20-%20Mongoose_Express.png)

### Routes

```http
/ redirects to /catalog
/catalog
/catalog/book /create :/id :id/update/ :id/delete
/catalog/books

same for bookinstance, author, genre
```

Changes to the tutorial: 

* use case-insensitive RegExp in POST-routes instead of simple comparison for finding already posted rows





offene fragen/ selbst beheben

* updates werden doch mit put oder patch gemacht und nicht mit post?!

* update auf ES6..

Merken:

Falls sowas: /catalog/books/123/catalog/books... ist im Model, dass die Url erzeugt die url von der Form 'catalog/boo..' und muss zu '**/**catalog/boo..' geändert werden

Arrow functions

```js
// ES5
hello = function(name) {
  return "Hello " + name + "!";
}

// ES 6

```

How to use variable with regular expression to find case insensitive matches with mongoDB: in findOne().. as search condition..

```js
{'name': new RegExp('^' +req.body.name + '$', 'i')}
```



### Links to read

[RegExp, how to use it in JS](https://developer.mozilla.org/de/docs/Web/JavaScript/Guide/Regular_Expressions)

[The Node.js Way - Understanding Error-First Callbacks](http://fredkschott.com/post/2014/03/understanding-error-first-callbacks-in-node-js/)

[https://sass-lang.com/guide](https://sass-lang.com/guide)

[callback hell8](http://callbackhell.com)

[How to write a production-ready nodejs rest api](https://medium.com/bb-tutorials-and-thoughts/how-to-write-production-ready-node-js-rest-api-javascript-version-db64d3941106)

[MongoDB in 5 Minutes (YT)](https://www.youtube.com/watch?v=EE8ZTQxa0AM)

[Express - Validator](https://express-validator.github.io/docs/)

[PUG](https://pugjs.org/api/getting-started.html)

[W3C Cool URIs dont' change](https://www.w3.org/Provider/Style/URI)
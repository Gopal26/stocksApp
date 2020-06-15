/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
// Apply the styles in style.css to the page.
require('./site/style.css')

// if you want to use es6, you can do something like
//     require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = false

const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url)
client.debug = function(msg) {
  if (global.DEBUG) {
    console.info(msg)
  }
}

const StockFunction = require('./es6/StockFunction');
const TEMPLATE = `
<div class="stock-values">
    <div id="stock-name-{name}" class="stock-name">{name}</div>
    <div id="stock-bestAsk-{name}" class="stock-bestAsk">{bestAsk}</div>
    <div id="stock-bestBid-{name}" class="stock-bestBid">{bestBid}</div>
    <div id="stock-openAsk-{name}" class="stock-openAsk">{openAsk}</div>
    <div id="stock-openBid-{name}" class="stock-openBid">{openBid}</div>
    <div id="stock-lastChangeAsk-{name}" class="stock-lastChangeAsk">{lastChangeAsk}</div>
    <div id="stock-lastChangeBid-{name}" class="stock-lastChangeBid">{lastChangeBid}</div>
    <div id="stock-sparkline-{name}" class="stock-sparkline"></div>
</div>`;

const _stockFunction = new StockFunction('stock-tickers', TEMPLATE, window.document);
client.connect({}, function connectCallback() {
  client.subscribe("/fx/prices", _stockFunction.updateStocks.bind(_stockFunction));
}, error => alert(error.headers.message));

// function connectCallback() {
//   document.getElementById('stomp-status').innerHTML = "It has now successfully connected to a stomp server serving price updates for some foreign exchange currency pairs."
// }

// client.connect({}, connectCallback, function(error) {
//   alert(error.headers.message)
// })

// const exampleSparkline = document.getElementById('example-sparkline')
// Sparkline.draw(exampleSparkline, [1, 2, 3, 6, 8, 20, 2, 2, 4, 2, 3])
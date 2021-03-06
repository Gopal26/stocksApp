require('./toFind');
const Sparkline = require('../site/sparkline');

class StockFunction {
  constructor(parentID, template, document) {
    // init
    this.store = {};
    this.store.document = document;
    this.store.stockTickers = this.store.document.querySelector(`#${parentID}`);
    this.store.stockTemplate = template;
    this.store.stocks = new Map();
    this.store.sparks = new Map();
  }

  updateStocks(res, testing = false) {
    const data = JSON.parse(res.body),
          stockName = data.name;
    let stockRow = this.getStockRow(stockName);
  
    if (typeof stockRow === 'undefined') {
      let div = this.store.document.createElement('div');
      div.setAttribute('id', `stock-id-${stockName}`);
      div.innerHTML = this.store.stockTemplate.toFind(data);
      // append to view
      this.store.stockTickers.insertBefore(div, this.firstDiv(this.store.stockTickers, div));
      // create Stock row with DOM nodes
      stockRow = this.createStock(this.store.stockTickers, stockName);
    }
    // Update existing StockRow with new Data
    // which eventually reflects in view
    stockRow = this.updateStockDisplay(data, stockRow);
    // Update store
    this.setStockRow(stockName, stockRow);

    // Draw sparkline
    if (!testing) {
      Sparkline.draw(stockRow.sparkline, this.getSparksArray(stockRow.sparkline.id, data.lastChangeBid, this.store.sparks));
    }
    // Sort UI with CSS
    this.updateParentGridRow(this.store.stocks.size);
    this.store.stocks = this.sortStocksGridRowBy('lastChangeBid', this.store.stocks);
  }

  sortStocksGridRowBy(str, stocks) {
    let arr = [];
    for(let i of stocks) {
      arr.push(i);
    }
    
    arr.sort(function(x, y) {
      return y[1][str].innerText - x[1][str].innerText;
    });
    
    let sorted = arr.reduce((accum, a) => {
      a[1].box.style.gridRow = accum.length + 1;
      return [...accum, a];
    }, []);

    return new Map(sorted);
  }

  updateParentGridRow(count) {
    this.store.stockTickers.style.gridTemplateRows = `repeat(${count},auto)`
  }

  getStockRow(stockName) {
    return this.store.stocks.get(stockName);
  }
  setStockRow(stockName, stockData) {
    this.store.stocks.set(stockName, stockData);
  }

  getSparksArray(elemId, val, sparks) {
    let currentSpark = sparks.get(elemId);
    if (typeof currentSpark === 'undefined') {
      currentSpark = [0];
      sparks.set(elemId, currentSpark);
    }
    setInterval(() => {
      currentSpark.push(val.toFixed(2));
    }, 30000);
    if (currentSpark.length >= 9) { currentSpark.splice(1,1); }
    return currentSpark;
  }

  createStock(stockTickers, stockName) {
    let stock = {};
    stock.box = stockTickers.querySelector(`#stock-id-${stockName}`);
    stock.bestAsk = stockTickers.querySelector(`#stock-bestAsk-${stockName}`);
    stock.bestBid = stockTickers.querySelector(`#stock-bestBid-${stockName}`);
    stock.lastChangeAsk = stockTickers.querySelector(`#stock-lastChangeAsk-${stockName}`);
    stock.lastChangeBid = stockTickers.querySelector(`#stock-lastChangeBid-${stockName}`);
    stock.name = stockTickers.querySelector(`#stock-name-${stockName}`);
    stock.openAsk = stockTickers.querySelector(`#stock-openAsk-${stockName}`);
    stock.openBid = stockTickers.querySelector(`#stock-openBid-${stockName}`);
    stock.sparkline = stockTickers.querySelector(`#stock-sparkline-${stockName}`);
    return stock;
  }
  updateStockDisplay(data, stock) {
    stock.bestAsk.innerHTML = data.bestAsk.toFixed(4);
    stock.bestBid.innerHTML = data.bestBid.toFixed(4);
    stock.lastChangeAsk.innerHTML = data.lastChangeAsk.toFixed(4);
    stock.lastChangeBid.innerHTML = data.lastChangeBid.toFixed(4);
    stock.name.innerHTML = (data.name.slice(0, 3) + '-' + data.name.slice(3)).toUpperCase();
    stock.openAsk.innerHTML = data.openAsk.toFixed(4);
    stock.openBid.innerHTML = data.openBid.toFixed(4);
    return stock;
  }

  firstDiv(elm, compareDiv) {
    return elm.getElementsByTagName('div')[0];
  }

}
module.exports = StockFunction;
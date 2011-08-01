/**
 * Hello world: a simple extension that demonstrates how to pass messages
 * between a panel, the main extension code and a page-mod.
 */

const Panel = require("panel").Panel;
const tabs = require("tabs");
var targetUrl = 'http://canuckistani.ca/_blank.html'; 

require("widget").Widget({
  id: 'hello-world-widget',
  label: 'Say hello',
  content: "X",
  onClick: function() { //pageMod.port.
    workers.forEach(function(w) { w.postMessage("Clicked Widget!") });
  }
});

var workers = [];

function detachWorker(worker, workerArray) {
  var index = workerArray.indexOf(worker);
  if(index != -1) {
    workerArray.splice(index, 1);
  }
}

const pageMod = require("page-mod").PageMod({
  include: [targetUrl],
  contentScriptWhen: 'ready',
  contentScript: "self.on('message', function onMessage(message) {" +
                 "  window.alert(message);}); ",
  onAttach: function(worker) {
    workers.push(worker);
    worker.on('detach', function () {
      detachWorker(this, workers);
    });
    
    console.log(worker.tab.title);
    
    worker.postMessage("Hello world.");
  }
});

tabs.open(targetUrl);


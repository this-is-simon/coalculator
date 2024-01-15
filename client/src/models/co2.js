const Request = require('../helpers/request.js');
const PubSub = require('../helpers/pub_sub.js');

const Co2Data = function(url){
  this.url = url;
  this.id = null;
}

Co2Data.prototype.getData = function () {
  const request = new Request(this.url);
  request.get()
  .then((co2Collection) => {
    PubSub.publish('co2Collection:data-loaded', co2Collection);
    this.id = co2Collection[0]._id;
  })
  .catch(console.error);
};

Co2Data.prototype.formSubmitListener = function () {
  PubSub.subscribe('FormView:updated-data-ready', (evt)=>{
    this.updateData(evt.detail)
  });
};

Co2Data.prototype.updateData = function (evt) {
  const request = new Request(this.url);
  request.put(evt, this.id)
};

module.exports = Co2Data;

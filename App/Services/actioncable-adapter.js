// var WebSocket = require('ws');

var ActionCableAdapter = {
 createConsumer: function(url) {
   var consumer = new Consumer(url)
   consumer.open()
   return consumer;
 }
}

var Consumer = function(url) {
  console.tron.log(url)
  this.ws = new WebSocket(url);
  this.commands = []
  this.subscriptions = [];
  this.subscriptions.create = this.createSubscription.bind(this)
} 

Consumer.prototype.open = function() {
  this.ws.onopen = this.onopen.bind(this)
  this.ws.onmessage = this.onmessage.bind(this)

  this.ws.onclose = function() {
    console.tron.log('close')
  }
}

Consumer.prototype.send = function(data) {
  var msg = JSON.stringify(data)
  if(this.ws.readyState === 1) {
    this.ws.send(msg)
  } else {
    this.commands.push(msg)
  }
  // this.ws.send(JSON.stringify(data))
}

Consumer.prototype.onopen = function() {
  console.tron.log('open')
  for(var i=0; i < this.commands.length; i++) {
    this.ws.send(this.commands[i]);
  }
  this.commands = []
}

Consumer.prototype.onmessage = function(message) {
  const msg = JSON.parse(message.data)
  if(!msg) {
    return
  }

  console.tron.log(msg)

  switch(msg.type) {
    case "welcome":
      break;
    case "ping":
      break;
    case "confirm_subscription":
      var subscription = this.findSubscription(msg.identifier)
      subscription.trigger('connected', {})
      break;
    default:
      if(msg.message) {
        var subscription = this.findSubscription(msg.identifier)
        subscription.trigger('received', msg.message)
      }
      break;
  }
}

Consumer.prototype.createSubscription = function(channel_identifier, options) {
  // var channelId = Math.round(Date.now() + Math.random() * 100000).toString(16)
  msg = { command: "subscribe", identifier: JSON.stringify(channel_identifier) }
  this.send(msg)
  var subscription = new Subscription(this, channel_identifier, options)
  this.subscriptions.push(subscription)
}

Consumer.prototype.findSubscription = function(identifier) {
  for(var i = 0; i < this.subscriptions.length; i++) {
    var subscription = this.subscriptions[i]
    if(subscription.isMe(identifier)) {
      return subscription
    }
  }

  return null;
}

var Subscription = function(consumer, identifier, options) {
  this.consumer = consumer
  this.identifier = identifier
  this.options = options
}

Subscription.prototype.isMe = function(identifier) {
  return JSON.stringify(this.identifier) === identifier
}

Subscription.prototype.trigger = function(event, data) {
  if (this.options[event]) {
		this.options[event].bind(this)(data)
	}
}

Subscription.prototype.perform = function(action, data) {
  data.action = action
  var msg = {
    command: "message",
    identifier: JSON.stringify(this.identifier),
    data: JSON.stringify(data)
  }
  this.consumer.send(msg)
}

module.exports = ActionCableAdapter;
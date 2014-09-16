function PubSub() { 
    this.list = {};
}
 
PubSub.prototype = {
    constructor: PubSub,
 
    subscribe: function(name, callback) {
        if (!this.list[name]) {
           this.list[name] = [];
        }
 
        this.list[name].push({callback:callback});
    },
    unsubscribe:function(name){
        if (this.list[name]) {
            delete this.list[name];
        }
    },
    publish: function(name){
        for (var i in this.list) {
            if (i === name) {
                var args = Array.prototype.slice.call(arguments);
                args.splice(0, 1);
                for (var j=0; j< this.list[name].length; j++) {
                    this.list[name][j].callback.apply(this, args);
                }
            }
        }
    }    
};
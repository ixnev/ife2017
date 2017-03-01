function Observer(data) {
	this.data = data;
	this.walk(data);
}
Observer.prototype.walk = function(obj) {
	var key,
		val;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			val = obj[key];
			if (typeof val === 'object') {
				new Observer(val);
			}
			this.convert(key,val);
		}
	}
};
Observer.prototype.convert = function(key,val) {
	Object.defineProperty(this.data, key, {
		enumerable: true,
		configurable: true,
		get: function () {
			console.log('您访问了' + key);
			return val;
		},
		set: function (newVal) {
			console.log('您设置了' + key + '属性为' + newVal);
			val = newVal;
		}
	})
};

var data = {
    user: {
        name: "liangshaofeng",
        age: "24"
    },
    address: {
        city: "beijing"
    }
};

var app = new Observer(data);
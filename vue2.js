// 自定义事件
function EventTarget() {
	this.handlers = {};
}
EventTarget.prototype = {
	constructor: EventTarget,
	addHandler: function (type,handler) {
		if (typeof this.handlers[type] == 'undefined') {
			this.handlers[type] = [];
		}
		this.handlers[type].push(handler);
	},
	fire: function (event) {
		if (!event.target) {
			event.target = this;
		}
		if (this.handlers[event.type] instanceof Array) {
			var handlers = this.handlers[event.type];
			for (var i = 0, len = handlers.length; i < len; i++) {
				handlers[i](event);
			}
		}
	},
	removeHandler: function (type, handler) {
		if (this.handlers[type] instanceof Array) {
			var handlers = this.handlers[type];
			for (var i = 0, len = handlers.length; i < len; i++) {
				if (handlers[i] === handler) {
					break;
				}
			}
			handlers.splice(i, 1);
		}
	}
};

function object(o) {
	function F() {}
	F.prototype = o;
	return new F();
}
function inheritPrototype(subType, superType) {
	var prototype = object(superType.prototype);
	prototype.constructor = subType;
	subType.prototype = prototype;
}

// Observe继承EventTarget
function Observer(data) {
	EventTarget.call(this);
	this.data = data;
	this.walk(data);
}
inheritPrototype(Observer, EventTarget);

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
	var that = this;
	Object.defineProperty(this.data, key, {
		enumerable: true,
		configurable: true,
		get: function () {
			console.log('您访问了' + key);
			return val;
		},
		set: function (newVal) {
			console.log('您设置了' + key + '属性为' + newVal);
			that.fire({type: key, old: val, new: newVal})
			val = newVal;
			if (typeof newVal === 'object') {
				new Observer(val);
			}
		}
	})
};
Observer.prototype.$watch = function(key,handler) {
	if (this.data.hasOwnProperty(key)) {
		this.addHandler(key, handler);
	}
};

var app1 = new Observer({
	name: 'youngwind',
	age: 25
});

app1.$watch('age', function(event) {
	console.log('我的年纪变了，现在已经是：'+event.new+'岁了')
});
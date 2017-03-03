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
		val,
		that=this;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			val = obj[key];
			if (typeof val === 'object') {
				var app = new Observer(val);
				var key2 = key;
				// new Observer()时对该对象绑定fireparent事件
				// 该事件触发父级对象对应属性名的事件
				// 以及父级对象的fireparent事件
				app.addHandler('fireparent',function (event) {
					that.fire({type: key2});
					that.fire({type: 'fireparent'});
				})
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
			// set时触发自己的属性名对应的事件
			that.fire({type: key, old: val, new: newVal});
			// set时触发自己的fireparent事件
			that.fire({type: 'fireparent'});
			if (typeof newVal === 'object') {
				var app = new Observer(newVal);
				// new Observer()时对该对象绑定fireparent事件
				// 该事件触发父级对象对应属性名的事件
				// 以及父级对象的fireparent事件
				app.addHandler('fireparent',function (event) {
					that.fire({type: key});
					that.fire({type: 'fireparent'});
				})
			}
			val = newVal;
		}
	})
};
Observer.prototype.$watch = function(key,handler) {
	if (this.data.hasOwnProperty(key)) {
		this.addHandler(key, handler);
	}
};

var app2 = new Observer({
    name: {
        firstName: 'shaofeng',
        lastName: 'liang'
    },
    age: 25
});

app2.$watch('name', function (event) {
    console.log('我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。')
});
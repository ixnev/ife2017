function Vue(obj) {
	this.ele = obj.el;
	this.data = obj.data;
	this.$node = this.qsa(document,this.ele);
	this.set();
}
Vue.prototype.qsa = function(element, selector){
	var found,
		simpleSelectorRE = /^[\w-]*$/,
		maybeID = selector[0] == '#',
		maybeClass = !maybeID && selector[0] == '.',
		nameOnly = maybeID || maybeClass ? selector.slice(1) : selector,
		isSimple = simpleSelectorRE.test(nameOnly)
	return (element.getElementById && isSimple && maybeID) ?
		( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
		(element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
		[].slice.call(
		isSimple && !maybeID && element.getElementsByClassName ?
			maybeClass ? element.getElementsByClassName(nameOnly) :
			element.getElementsByTagName(selector) :
			element.querySelectorAll(selector)
	  )
}
Vue.prototype.set = function() {
	var len = this.$node.length;
	var nodes = this.$node;
	var that = this;
	for (var i = 0; i < len; i++) {
		(function (i) {
			var html = nodes[i].innerHTML;
			var html2 = html.replace(/{{.+}}/g,function(match){
				var path = match.slice(2,-2).split('.');
				var val = that.data;
				for (var j = 0; j < path.length; j++) {
					val = val[path[j]];
				}
				return val;
			})
			nodes[i].innerHTML = html2;
		})(i)
	}
};

var app = new Vue({
	el: '#app',
	data: {
		user: {
			name: 'youngwind',
			age: 25
		}
	}
});
;;(function() {
	var dir = void 0;
//	numbers, strings, booleans, dates, elements, arrays, objects, null|undefined
	function smartSort(a, b/* , dir */) {
		//	immidiate return for emtpy values
		if (null == a || void 0 == a || a !== a) return 1;
		if (null == b || void 0 == b || b !== b) return -1;
		
		//	make string numbers into real numbers
		var regNum = new RegExp(/^-?\d+\.?\d*$|^\d*\.?\d+$/);
		if (regNum.test(a)) a = parseFloat(a);
		if (regNum.test(b)) b = parseFloat(b);
		
		var aType = typeof a,
			bType = typeof b,
			cType = aType + bType;
			
		var aInstance = Object.prototype.toString.call(a).slice(8, -1),
			bInstance = Object.prototype.toString.call(b).slice(8, -1),
			cInstance = aInstance + bInstance;
			
		if (/Array/ig.test(aInstance)) a.smartSort(dir);
		if (/Array/ig.test(bInstance)) b.smartSort(dir);
		
		if (aType == bType) {
			switch (aType || bType) {
				case 'boolean': return a === b ? 0 : (dir ? (a ? 1 : -1) : (b ? 1 : -1));
				case 'number': return a === b ? 0 : (dir ? (a < b ? -1 : 1) : (a > b ? -1 : 1));
				case 'string':
					a = a.valueOf().toLowerCase();
					b = b.valueOf().toLowerCase();
					return a === b ? 0 : (dir ? (a < b ? -1 : 1) : (a > b ? -1 : 1));
				case 'object':
					if (aInstance == bInstance) {
						if (/(date){2}/ig.test(cInstance)) {
							var aValue = a.valueOf(),
								bValue = b.valueOf();
							return aValue === bValue ? 0 : (dir ? (aValue < bValue ? -1 : 1) : (aValue > bValue ? -1 : 1));
						}
						else if (/^(HTML)\w+(Element)$/.test(cInstance)) {
							if (a.id && b.id) return a.id === b.id ? 0 : (dir ? (a.id < b.id ? -1 : 1) : (a.id > b.id ? -1 : 1));
							else if (a.id || b.id) return a.id && !b.id ? 1 : -1;
							if (a.name && b.name) return a.name === b.name ? 0 : (dir ? (a.name < b.name ? -1 : 1) : (a.name > b.name ? -1 : 1));
							else if (a.name || b.name) return a.name && !b.name ? 1 : -1;
							return a.tagName === b.tagName ? 0 : (dir ? (a.tagName < b.tagName ? -1 : 1) : (a.tagName > b.tagName ? -1 : 1));
						}
						/*TODO: else if (window['jQuery'] && a instanceof jQuery) {
							
						} */
						else if (/(array){2}/ig.test(cInstance)) {
							var aFirst = Object.keys(a)[0],
								bFirst = Object.keys(b)[0];
							if (aFirst === bFirst) {
								aFirst = a[aFirst];
								bFirst = b[bFirst];
								if (aFirst === bFirst) return 0;
								var firstSorted = [aFirst, bFirst].smartSort(dir);
								return aFirst == firstSorted[0] ? 1 : -1;
							}
							else return dir ? (aFirst < bFirst ? -1 : 1) : (aFirst > bFirst ? -1 : 1);
						}
						else if (/(object){2}/ig.test(cInstance)) {
							var aFirst = Object.keys(a)[0],
								bFirst = Object.keys(b)[0];
							if (void 0 != aFirst && aFirst === bFirst) {
								aFirst = a[aFirst];
								bFirst = b[bFirst];
								if (aFirst === bFirst) return 0;
								var firstSorted = [aFirst, bFirst].smartSort(dir);
								return aFirst == firstSorted[0] ? 1 : -1;
							}
							else return dir ? (aFirst < bFirst ? -1 : 1) : (aFirst > bFirst ? -1 : 1);
						}
						
					}
					else {	//	Organize as [DATE, ELEMENT, ARRAY, OBJECT, NAN|NULL|UNDEFINED]
						if (/Date/ig.test(cInstance)) return /Date/ig.test(aInstance) ? -1 : 1;
						if (/Element/ig.test(cInstance)) return /Element/ig.test(aInstance) ? -1 : 1;
						//	quick jQuery check to organize jQuery elements right behind standard elements
						if (window['jQuery'] && (a instanceof jQuery || b instanceof jQuery)) return a instanceof jQuery ? -1 : 1;
						if (/Array/ig.test(cInstance)) return /Array/ig.test(aInstance) ? -1 : 1;
						return /object/ig.test(aInstance) ? -1 : 1;
					}
					
					break;
			}
		}
		else {	//	Organize as [NUMBER, STRING, BOOLEAN, DATE, ELEMENT, ARRAY, OBJECT, NAN|NULL|UNDEFINED]
			if (/number/ig.test(cType)) return /number/ig.test(aType) ? -1 : 1;
			if (/string/ig.test(cType)) return /string/ig.test(aType) ? -1 : 1;
			if (/boolean/ig.test(cType)) return /boolean/ig.test(aType) ? -1 : 1;
			if (/object/ig.test(cType)) {
				//	TODO: think up every possible test to ensure this is never reached, as it shouldnt be
				if (window['console'] && console['log']) {
					console.log(new Array(50).join('-') + 'H I T' + new Array(50).join('-'));
					console.log(new Array(50).join('-') + 'H I T' + new Array(50).join('-'));
					console.log(new Array(50).join('-') + 'H I T' + new Array(50).join('-'));
				}
				if (a instanceof Date || b instanceof Date) return a instanceof Date ? -1 : 1;
				if (a instanceof Element || b instanceof Element) return a instanceof Element ? -1 : 1;
				if (a instanceof Array || b instanceof Array) return a instanceof Array ? -1 : 1;
				return /object/ig.test(aType) ? -1 : 1;
			}
			if (/function/ig.test(cType)) return /function/ig.test(aType) ? -1 : 1;
			else return -1;
		}
	}
		
	if (Object['defineProperty'] && !Array.prototype['smartSort']) {
		Object.defineProperty(Array.prototype, 'smartSort', { value: function() {
			//	first determine if a specific string for a|asc|d|dsc|desc was passed in
			for (var x in arguments) {
				if (typeof arguments[x] == 'string' && /^a([sc]{2})?$|^d([e]?[sc]{2,3})?$/i.test(arguments[x])) {
					dir = /^a([sc]{2})?$/i.test(arguments[x]) ? true : false;
					delete arguments[x];
					break;
				}
			}
			
			//	add extra arguments to current array for sorting
			/* var arr = this;
			for (var x in arguments) {
				//	check if direction is set yet, if current item is boolean
				//	if not yet set, set it to first found given boolean
				if (typeof arguments[x] == 'boolean' && void 0 == dir) dir = arguments[x];
				else arr.push(arguments[x]);
			}
			return arr.sort(function(a, b) { return smartSort(a, b, dir); }); */
			
			//	if direction still not set, then set to true/asc
			if (void 0 == dir) dir = true;
			
			Object.defineProperty(this, "direction", {
				enumerable: false,
				value: dir,
				writable: true
			});
			return this.sort(smartSort);
		} });
	}
})();

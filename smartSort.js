;;(function() {
	function smartSort() {
		var $this = this,
			dir = void 0;
		
		//	first determine if a specific string for a|asc|d|dsc|desc was passed in
		for (var x in arguments) {
			if (typeof arguments[x] == 'string' && /^a([sc]{2})?$|^d([e]?[sc]{2,3})?$/i.test(arguments[x])) {
				dir = /^a([sc]{2})?$/i.test(arguments[x]) ? true : false;
				delete arguments[x];
				break;
			}
			else if (typeof arguments[x] == 'boolean') {
				dir = arguments[x];
				delete arguments[x];
				break;
			}
		}
		
		//	if direction still not set, then set to true/asc
		if (void 0 == dir) dir = true;
		
		Object.defineProperty(this, "dir", {
			enumerable: false,
			value: dir,
			writable: true
		});
		
		//	numbers, strings, booleans, dates, elements, arrays, objects, null|undefined
		function ss(a, b, dir) {
			// var dir = $this.dir;
			//	immidiate return for emtpy values
			if ((null == a || void 0 == a) && b !== b) return 1;
			if ((null == b || void 0 == b) && a !== a) return -1;
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
			
			// if (/Array/ig.test(cInstance)) console.log(dir);
			if (/Array/ig.test(aInstance)) a.sort(function(aa,bb){return ss(aa,bb,dir)});
			if (/Array/ig.test(bInstance)) b.sort(function(aa,bb){return ss(aa,bb,dir)});
			
			if (aType == bType) {
				switch (aType || bType) {
					case 'boolean': return a === b ? 0 : (dir ? (a ? 1 : -1) : (b ? 1 : -1));
					case 'number': return a === b ? 0 : (dir ? (a < b ? -1 : 1) : (a > b ? -1 : 1));
					case 'string':
						a = a.valueOf().toLowerCase();
						b = b.valueOf().toLowerCase();
						return a === b ? 0 : (dir ? (a < b ? -1 : 1) : (a > b ? -1 : 1));
					case 'object':
						if (aInstance == bInstance || /^((HTML)\w+(Element)){2}$/.test(cInstance)) {
							if (/(date){2}/ig.test(cInstance)) {
								var aValue = a.valueOf(),
									bValue = b.valueOf();
								return aValue === bValue ? 0 : (dir ? (aValue < bValue ? -1 : 1) : (aValue > bValue ? -1 : 1));
							}
							else if (/^((HTML)\w+(Element)){2}$/.test(cInstance)) {
								if (a.id && b.id) return a.id === b.id ? 0 : (dir ? (a.id < b.id ? -1 : 1) : (a.id > b.id ? -1 : 1));
								else if (a.id || b.id) return (dir ? a.id && !b.id : !a.id && b.id) ? 1 : -1;
								if (a.name && b.name) return a.name === b.name ? 0 : (dir ? (a.name < b.name ? -1 : 1) : (a.name > b.name ? -1 : 1));
								else if (a.name || b.name) return (dir ? a.name && !b.name : !a.name && b.name) ? 1 : -1;
								return a.tagName === b.tagName ? 0 : (dir ? (a.tagName < b.tagName ? -1 : 1) : (a.tagName > b.tagName ? -1 : 1));
							}
							else if (window['jQuery'] && a instanceof jQuery && b instanceof jQuery) {
								var a0 = a.get(0), b0 = b.get(0);
								if (a0.id && b0.id) return a0.id === b0.id ? 0 : (dir ? (a0.id < b0.id ? -1 : 1) : (a0.id > b0.id ? -1 : 1));
								else if (a0.id || b0.id) return (dir ? a0.id && !b0.id : !a0.id && b0.id) ? 1 : -1;
								if (a0.name && b0.name) return a0.name === b0.name ? 0 : (dir ? (a0.name < b0.name ? -1 : 1) : (a0.name > b0.name ? -1 : 1));
								else if (a0.name || b0.name) return (dir ? a0.name && !b0.name : !a0.name && b0.name) ? 1 : -1;
								return a0.tagName === b0.tagName ? 0 : (dir ? (a0.tagName < b0.tagName ? -1 : 1) : (a0.tagName > b0.tagName ? -1 : 1));
							}
							else if (/(array){2}/ig.test(cInstance)) {
								var aFirst = Object.keys(a)[0],
									bFirst = Object.keys(b)[0];
								if (aFirst === bFirst) {
									aFirst = a[aFirst];
									bFirst = b[bFirst];
									if (aFirst === bFirst) return 0;
									var arrFirst = [aFirst, bFirst],
										firstSorted = arrFirst.smartSort(dir); // smartSortInit.apply(arrFirst, [dir]);
									return aFirst == firstSorted[0] ? -1 : 1;
								}
								return dir ? (aFirst < bFirst ? -1 : 1) : (aFirst > bFirst ? -1 : 1);
							}
							else if (/(object){2}/ig.test(cInstance)) {
								if (window['jQuery']) {
									if (a instanceof jQuery) return -1;
									if (b instanceof jQuery) return 1;
								}
								
								//	sort inner arrays if found
								for (var k in a) if (a[k] instanceof Array) a[k].smartSort(dir);
								for (var k in b) if (b[k] instanceof Array) b[k].smartSort(dir);
								
								//	sort object
								var objA = [], objB = [];
								
								for (var k in a) { if (a.hasOwnProperty(k)) objA[k] = a[k], delete a[k]; }
								for (var k in b) { if (b.hasOwnProperty(k)) objB[k] = b[k], delete b[k]; }
								if (dir == false) 
								
								objA.smartSort(dir);
								objB.smartSort(dir);
								
								for (var k in objA) a[k] = objA[k];
								for (var k in objB) b[k] = objB[k];
								
								var aKeys = JSON.stringify(Object.keys(a)).replace(/\[|"|\]|,/g, '').toLowerCase(),
									bKeys = JSON.stringify(Object.keys(b)).replace(/\[|"|\]|,/g, '').toLowerCase();
								
								if (aKeys !== bKeys) return dir ? (aKeys < bKeys ? -1 : 1) : (aKeys > bKeys ? -1 : 1);
								else {	//	evaluate based on values
									var aValues = '', bValues = '';
									
									//	try by number values
									for (var k in a) if (Object.prototype.hasOwnProperty.call(a, k) && /number/.test(typeof a[k])) aValues += a[k];
									for (var k in b) if (Object.prototype.hasOwnProperty.call(b, k) && /number/.test(typeof b[k])) aValues += b[k];
									if (aValues && bValues) {
										aValues = parseFloat(aValues);
										bValues = parseFloat(bValues);
										return aValues === bValues ? 0 : (dir ? (aValues < bValues ? -1 : 1) : (aValues > bValues ? -1 : 1));
									}
									
									//	try by string values
									for (var k in a) if (Object.prototype.hasOwnProperty.call(a, k) && /string/.test(typeof a[k])) aValues += a[k].toLowerCase();
									for (var k in b) if (Object.prototype.hasOwnProperty.call(b, k) && /string/.test(typeof b[k])) aValues += b[k].toLowerCase();
									if (aValues && bValues) return aValues === bValues ? 0 : (dir ? (aValues < bValues ? -1 : 1) : (aValues > bValues ? -1 : 1));
								}
								
								//	falback
								//	TODO: break this down to further above cause
								var aFirst = Object.keys(a)[0],
									bFirst = Object.keys(b)[0];
								
								if (void 0 != aFirst && aFirst === bFirst) {
									aFirst = a[aFirst];
									bFirst = b[bFirst];
									if (aFirst === bFirst) return 0;
									var firstSorted = [aFirst, bFirst].smartSort(dir);
									return aFirst == firstSorted[0] ? -1 : 1;
								}
								return dir ? (aFirst < bFirst ? -1 : 1) : (aFirst > bFirst ? -1 : 1);
							}
							
						}
						//	Organize as [DATE, ELEMENT, ARRAY, OBJECT, NAN|NULL|UNDEFINED]
						if (/Date/ig.test(cInstance)) return /Date/ig.test(aInstance) ? -1 : 1;
						if (/Element/ig.test(cInstance)) return /Element/ig.test(aInstance) ? -1 : 1;
						//	quick jQuery check to organize jQuery elements right behind standard elements
						if (window['jQuery'] && (a instanceof jQuery || b instanceof jQuery)) return a instanceof jQuery ? -1 : 1;
						if (/Array/ig.test(cInstance)) return /Array/ig.test(aInstance) ? -1 : 1;
						aInstance = aInstance.toLowerCase();
						bInstance = bInstance.toLowerCase();
						return aInstance === bInstance ? 0 : (dir ? (aInstance < bInstance ? -1 : 1) : (aInstance > bInstance ? -1 : 1));
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
		
		// ss.dir = dir;
		/* console.log(dir); */
		return this.sort(function(a,b){return ss(a,b,$this.dir)});
	}
	
	if (Object['defineProperty'] && !Array.prototype['smartSort']) {
		Object.defineProperty(Array.prototype, 'smartSort', { value: smartSort });
	}
	
	//	add to jQuery if available
	if (window['jQuery']) {
		jQuery.smartSort = function() {
			dir = void 0;
			var args = [], arr;
			jQuery.each(arguments, function(i,v) {
				if (!arr && typeof v == 'object' && v instanceof Array) arr = v;
				else args.push(v);
			});
			//	DOES NOT CHANGE ORIGINAL ARRAY	
			//	This is so the user can simply use jQuery to GET a sorted array without manipulating original,
			//	since the original will already have option of array.smartSort
			if (arr) return Array.prototype.smartSort.apply($.extend(true, [], arr), args);
			return void 0;
		}
	}
	
	return  Array.smartSort;
})();

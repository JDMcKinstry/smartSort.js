;;(function() {
	var arrHTMLElementTypes = ["HTMLAnchorElement","HTMLAreaElement","HTMLAudioElement","HTMLBRElement","HTMLBaseElement","HTMLBaseFontElement","HTMLBodyElement","HTMLButtonElement","HTMLCanvasElement","HTMLCollection","HTMLContentElement","HTMLDListElement","HTMLDataElement","HTMLDataListElement","HTMLDialogElement","HTMLDivElement","HTMLDocument","HTMLElement","HTMLEmbedElement","HTMLFieldSetElement","HTMLFormControlsCollection","HTMLFormElement","HTMLFrameSetElement","HTMLHRElement","HTMLHeadElement","HTMLHeadingElement","HTMLHtmlElement","HTMLHyperlinkElementUtils","HTMLIFrameElement","HTMLImageElement","HTMLInputElement","HTMLIsIndexElement","HTMLKeygenElement","HTMLLIElement","HTMLLabelElement","HTMLLegendElement","HTMLLinkElement","HTMLMapElement","HTMLMediaElement","HTMLMetaElement","HTMLMeterElement","HTMLModElement","HTMLOListElement","HTMLObjectElement","HTMLOptGroupElement","HTMLOptionElement","HTMLOptionsCollection","HTMLOutputElement","HTMLParagraphElement","HTMLParamElement","HTMLPictureElement","HTMLPreElement","HTMLProgressElement","HTMLQuoteElement","HTMLScriptElement","HTMLSelectElement","HTMLShadowElement","HTMLSourceElement","HTMLSpanElement","HTMLStyleElement","HTMLTableCaptionElement","HTMLTableCellElement","HTMLTableColElement","HTMLTableDataCellElement","HTMLTableElement","HTMLTableHeaderCellElement","HTMLTableRowElement","HTMLTableSectionElement","HTMLTextAreaElement","HTMLTimeElement","HTMLTitleElement","HTMLTrackElement","HTMLUListElement","HTMLUnknownElement","HTMLVideoElement"],
		dir = void 0;
	
	var debug = new (function ssDebug() {
			function debug() {
				try {
					if (window['console'] && console['log']) {
						var msgJson = JSON.stringify(arguments);
						if (debug.msgs.indexOf(msgJson) == -1) {
							debug.msgs.push(msgJson);
							
							var its = debug.includeTimeStamp,
								timeStamp = 'hh:mm:ss.ms';
							
							if (its) {
								var d = new Date();
								timeStamp = timeStamp.replace(/hh/, (d.getHours() < 10 ? '0' : '') + d.getHours());
								timeStamp = timeStamp.replace(/mm/, (d.getMinutes() < 10 ? '0' : '') + d.getMinutes());
								timeStamp = timeStamp.replace(/ss/, (d.getSeconds() < 10 ? '0' : '') + d.getSeconds());
								timeStamp = timeStamp.replace(/ms/, (d.getMilliseconds() < 10 ? '0' : '') + d.getMilliseconds());
							}
							
							console.log("}"+new Array(25).join('-')+new Array(25).join('=')+"{>D+E+B+U+G [open] <}"+new Array(25).join('=')+new Array(25).join('-')+"{");
							for (var i=0;i<arguments.length;i++) {
								var pre = (its ? '['+timeStamp+']' : '') + (i < 10 ? '0' + i : i) + ":\t";
								console.log(pre, arguments[i]);
							}
							console.log("}"+new Array(25).join('-')+new Array(25).join('=')+"{>D+E+B+U+G [close] <}"+new Array(25).join('=')+new Array(25).join('-')+"{");
						}
					}
				}
				catch (err) { console.log(err); }
			}
			
			debug.includeTimeStamp = true;
			if (localStorage['ssIncTimeStamp'] && typeof JSON.parse(localStorage['ssIncTimeStamp']) === "boolean")
				debug.includeTimeStamp = JSON.parse(localStorage['ssIncTimeStamp']);
			
			debug.msgs = [];
			
			debug["error"] = function() {
				var err = arguments[0],
					args = Array.prototype.slice.call(arguments, 1);
				if (args.length) {
					args.unshift("\t-\t=\t{{\tERRORINFORMATION\t}}\t=\t-\t");
					this.apply(this, args);
				}
				throw new Error(err);
			}
			
			return debug;
		})();
	
//	numbers, strings, booleans, dates, elements, arrays, objects, null|undefined
	function smartSort(a, b/* , dir */) {
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
							var aKeys = JSON.stringify(Object.keys(a)).replace(/\[|"|\]|,/g, '').toLowerCase(),
								bKeys = JSON.stringify(Object.keys(b)).replace(/\[|"|\]|,/g, '').toLowerCase();
							
							//	falback
							//	TODO: break this down to further above cause
							var aFirst = Object.keys(a)[0],
								bFirst = Object.keys(b)[0];
							if (aFirst === bFirst) {
								aFirst = a[aFirst];
								bFirst = b[bFirst];
								if (aFirst === bFirst) return 0;
								var firstSorted = [aFirst, bFirst].smartSort(dir);
								return aFirst == firstSorted[0] ? -1 : 1;
							}
							else return dir ? (aFirst < bFirst ? -1 : 1) : (aFirst > bFirst ? -1 : 1);
						}
						else if (/(object){2}/ig.test(cInstance)) {
							if (window['jQuery']) {
								if (a instanceof jQuery) return -1;
								if (b instanceof jQuery) return 1;
							}
							
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
	
	function smartSortInit() {
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
		
		Object.defineProperty(this, "direction", {
			enumerable: false,
			value: dir,
			writable: true
		});
		
		debug('DIRECTION', dir);
		
		return this.sort(smartSort);
	}
	
	if (Object['defineProperty'] && !Array.prototype['smartSort']) {
		Object.defineProperty(Array.prototype, 'smartSort', { value: smartSortInit });
	}
	
	debug('Array.prototype.smartSort(["asc"|"desc"]) initialized! Enjoy!', [Array.prototype.smartSort]);
	
	//	add to jQuery if available
	if (window['jQuery']) {
		jQuery.smartSort = function() {
			dir = void 0;
			var args = [], arr;
			jQuery.each(arguments, function(i,v) {
				if (!arr && typeof v == 'object' && v instanceof Array) arr = v;
				else args.push(v);
			});
			if (arr) return smartSortInit.apply(arr, args);
			return void 0;
		}
	}
})();

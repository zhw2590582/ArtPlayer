var fs = require('fs');
var regexpu = require('regexpu');

var data = fs.readFileSync('./UnicodeData.txt').toString('utf8');
var entries = data.split('\n');

var rtlCodes = [], rtlCodesLength = 0;
var BREAK_SIGNAL = -1;

function toUnicodeCode(n) {
	return n.toString(16).toUpperCase();
}

var prevWasRTL = false;
for (var i = 0, len = entries.length; i < len; i++) {
	var entry = entries[i];
	var props = entry.split(';');

	var code = props[0];
	var dir = props[4];

	if (dir === 'R' || dir === 'AL') {
		rtlCodes[rtlCodesLength++] = parseInt(code, 16);
		prevWasRTL = true;
	} else if (prevWasRTL) {
		prevWasRTL = false;
		rtlCodes[rtlCodesLength++] = BREAK_SIGNAL;
	}
}
fs.writeFileSync('rtl-codes.txt', rtlCodes.filter(code => code !== BREAK_SIGNAL).map(toUnicodeCode).join('\n'));

var rtlCodeRanges = [], rtlCodeRangesLength = 0;

var startCode = rtlCodes[0];
var prevCode = rtlCodes[0];
for (var i = 1; i < rtlCodesLength; i++) {
	var code = rtlCodes[i];
	if (code === BREAK_SIGNAL) {
		continue;
	}
	if (prevCode + 1 !== code) {
		rtlCodeRanges[rtlCodeRangesLength++] = {
			from: startCode,
			to: prevCode
		};
		startCode = code;
	}
	prevCode = code;
}
rtlCodeRanges[rtlCodeRangesLength++] = {
	from: startCode,
	to: prevCode
};

fs.writeFileSync('rtl-code-ranges.txt', rtlCodeRanges.map(function(entry) {
	var from = toUnicodeCode(entry.from);
	var to = toUnicodeCode(entry.to);
	if (from === to) {
		return from;
	}
	return from + '-' + to;
}).join('\n'));

var fuzzy = [], fuzzyLength = 0, breakSignal = false;
fuzzy[fuzzyLength++] = {
	from: rtlCodes[0],
	to: rtlCodes[0]
};
for (var i = 1; i < rtlCodesLength; i++) {
	var code = rtlCodes[i];

	if (code === BREAK_SIGNAL) {
		breakSignal = true;
		continue;
	}

	if (breakSignal) {
		fuzzy[fuzzyLength++] = {
			from: code,
			to: code
		};
	} else {
		fuzzy[fuzzyLength - 1].to = code;
	}

	breakSignal = false;
}

fs.writeFileSync('rtl-code-ranges-fuzzy.txt', fuzzy.map(function(entry) {
	var from = toUnicodeCode(entry.from);
	var to = toUnicodeCode(entry.to);
	if (from === to) {
		return from;
	}
	return from + '-' + to;
}).join('\n'));

var isRTLFuzzy = fuzzy.map(function(entry) {
	var from = '\\u{'+toUnicodeCode(entry.from)+'}';
	var to = '\\u{'+toUnicodeCode(entry.to)+'}';
	if (from === to) {
		return from;
	}
	return from + '-' + to;
}).join('');

var regex = '[' + isRTLFuzzy + ']';

console.log('UNICODE CODE-POINTS RANGES:');
console.log(regex);

var r = regexpu.rewritePattern(regex, 'u');
console.log('------');
console.log(r);
console.log('------');

// var containsRTL = /(?:[\u05BE\u05C0\u05C3\u05C6\u05D0-\u05F4\u0608\u060B\u060D\u061B-\u064A\u066D-\u066F\u0671-\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u0710\u0712-\u072F\u074D-\u07A5\u07B1-\u07EA\u07F4\u07F5\u07FA-\u0815\u081A\u0824\u0828\u0830-\u0858\u085E-\u08BD\u200F\uFB1D\uFB1F-\uFB28\uFB2A-\uFD3D\uFD50-\uFDFC\uFE70-\uFEFC]|\uD802[\uDC00-\uDD1B\uDD20-\uDE00\uDE10-\uDE33\uDE40-\uDEE4\uDEEB-\uDF35\uDF40-\uDFFF]|\uD803[\uDC00-\uDCFF]|\uD83A[\uDC00-\uDCCF\uDD00-\uDD43\uDD50-\uDFFF]|\uD83B[\uDC00-\uDEBB])/


// var r = containsRTL.test('a');
// console.log(r);

//console.log(rtlCodeRanges);

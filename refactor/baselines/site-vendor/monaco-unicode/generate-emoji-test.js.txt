var fs = require('fs');
var regexpu = require('regexpu');

// Generate a map of all codes that appear in emojis
var emojiCodesMap = {};
(function () {
	var emojiTestData = fs.readFileSync('./emoji-test.txt').toString('utf8');
	var emojiTestEntries = emojiTestData.split('\n');

	for (var i = 0, len = emojiTestEntries.length; i < len; i++) {
		var entry = emojiTestEntries[i];

		// strip comments
		entry = entry.replace(/#.*/, '');
		entry = entry.trim();

		// strip status
		entry = entry.replace(/;.*/, '');
		entry = entry.trim();

		if (entry.indexOf(' ') > 0) {
			// ignore combined
			continue;
		}

		if (entry.length === 0) {
			// ignore empty lines
			continue;
		}

		emojiCodesMap[parseInt(entry, 16)] = true;
	}
})();

function toUnicodeCode(n) {
	return n.toString(16).toUpperCase();
}

// Read entire UnicodeData.txt and find contiguous ranges of emojis
var emojiCodes = [];
var BREAK_SIGNAL = -1;
(function () {
	var data = fs.readFileSync('./UnicodeData.txt').toString('utf8');
	var entries = data.split('\n');

	var prevWasEmoji = false;
	for (var i = 0, len = entries.length; i < len; i++) {
		var entry = entries[i];
		var props = entry.split(';');

		var code = parseInt(props[0], 16);
		var _isEmoji = isEmoji(code, emojiCodesMap[code]);

		if (_isEmoji) {
			emojiCodes.push(code);
			prevWasEmoji = true;
		} else if (prevWasEmoji) {
			prevWasEmoji = false;
			emojiCodes.push(BREAK_SIGNAL);
		}
	}
	fs.writeFileSync('emoji-codes.txt', emojiCodes.filter(code => code !== BREAK_SIGNAL).map(toUnicodeCode).join('\n'));
})();

var emojiCodeRanges = [];
(function () {
	var startCode = emojiCodes[0];
	var prevCode = emojiCodes[0];
	for (var i = 1; i < emojiCodes.length; i++) {
		var code = emojiCodes[i];
		if (code === BREAK_SIGNAL) {
			continue;
		}
		if (prevCode + 1 !== code) {
			emojiCodeRanges.push({
				from: startCode,
				to: prevCode
			});
			startCode = code;
		}
		prevCode = code;
	}
	emojiCodeRanges.push({
		from: startCode,
		to: prevCode
	});
})();

fs.writeFileSync('emoji-code-ranges.txt', emojiCodeRanges.map(function (entry) {
	var from = toUnicodeCode(entry.from);
	var to = toUnicodeCode(entry.to);
	if (from === to) {
		return from;
	}
	return from + '-' + to;
}).join('\n'));


var fuzzy = [], fuzzyLength = 0, breakSignal = false;
fuzzy[fuzzyLength++] = {
	from: emojiCodes[0],
	to: emojiCodes[0]
};
for (var i = 1; i < emojiCodes.length; i++) {
	var code = emojiCodes[i];

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

fs.writeFileSync('emoji-code-ranges-fuzzy.txt', fuzzy.map(function (entry) {
	var from = toUnicodeCode(entry.from);
	var to = toUnicodeCode(entry.to);
	if (from === to) {
		return from;
	}
	return from + '-' + to;
}).join('\n'));

var isEmojiFuzzy = fuzzy.map(function(entry) {
	var from = '\\u{'+toUnicodeCode(entry.from)+'}';
	var to = '\\u{'+toUnicodeCode(entry.to)+'}';
	if (from === to) {
		return from;
	}
	return from + '-' + to;
}).join('');

var isEmojiVeryImprecise = fuzzy.map(function(entry) {
	if (entry.from + 1 === entry.to) {
		return `(x === ${entry.from}) || (x === ${entry.to})`;
	}
	if (entry.from === entry.to) {
		return `(x === ${entry.from})`;
	}
	return `(x >= ${entry.from} && x <= ${entry.to})`;
}).join(' || ');

console.log('very imprecise test :: (x >= 0x1F1E6 && x <= 0x1F1FF) || ' + isEmojiVeryImprecise);

// Flags use two code points, but they usually start with 1F1E6 - 1F1FF
// REGIONAL INDICATOR SYMBOL LETTER A -> REGIONAL INDICATOR SYMBOL LETTER Z
isEmojiFuzzy += '\\u{1F1E6}-\\u{1F1FF}';


// TODO:
// use U+FE0F as a hint
// http://emojipedia.org/variation-selector-16/
// Variation Selector-16
// An invisible codepoint which specifies that the preceding character should be displayed with emoji presentation. Only required if the preceding character defaults to text presentation.
var regex = '[' + isEmojiFuzzy + ']';

console.log('UNICODE CODE-POINTS RANGES:');
console.log(regex);

var r = regexpu.rewritePattern(regex, 'u');
console.log('------');
console.log(r);
console.log('------');

// GOTTEN FROM ABOVE RESULT
var containsEmoji = /(?:[\u231A\u231B\u23F0\u23F3\u2600-\u27BF\u2B50\u2B55]|\uD83C[\uDDE6-\uDDFF\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD00-\uDDFF\uDE70-\uDED6])/;

// SANITY CHECK the regex
(function () {
	var emojiTestData = fs.readFileSync('./emoji-test.txt').toString('utf8');
	var emojiTestEntries = emojiTestData.split('\n');

	var MISSING = [];

	for (var i = 0, len = emojiTestEntries.length; i < len; i++) {
		var original = emojiTestEntries[i];
		var entry = emojiTestEntries[i];

		// strip comments
		entry = entry.replace(/#.*/, '');
		entry = entry.trim();

		// strip status
		entry = entry.replace(/;.*/, '');
		entry = entry.trim();

		if (entry.length === 0) {
			// ignore empty lines
			continue;
		}

		var codes = entry.split(' ').map(function(code) {
			return parseInt(code, 16);
		});

		var str = 'some ';
		for (var j = 0; j < codes.length; j++) {
			str += String.fromCodePoint(codes[j]);
		}
		str += ' text';

		if (containsEmoji.test(str)) {
			// regex captures this input
			continue;
		}

		MISSING.push(original);
	//	MISSING.push('TEST STRING: <<' + str + '>>');

		// console.log(str);

		// String.fromCodePoint()

		// console.log(entry);

		// if (entry.indexOf(' ') > 0) {
		// 	// ignore combined
		// 	continue;
		// }

		// if (entry.length === 0) {
		// 	// ignore empty lines
		// 	continue;
		// }

		// emojiCodesMap[parseInt(entry, 16)] = true;
	}

	fs.writeFileSync('emoji-missed.txt', 'THE FOLLOWING ARE NOT CAPTURED BY THE REGEX: \n' + MISSING.join('\n'));

	// console.log(MISSING);
})();


function isEmoji(code, isInEmojiTest) {
	var block = getCodeBlock(code);

	// Exclude some codes in emoji-test.txt that don't look like emojis.

	if (block === 'Latin-1 Supplement') {
		// e.g. 00A9 © copyright
		return false;
	}
	if (block === 'General Punctuation') {
		// e.g. 203C ‼️ double exclamation mark
		return false;
	}
	if (block === 'Letterlike Symbols') {
		// e.g. 2122 ️️™️ trade mark
		return false;
	}
	if (block === 'Arrows') {
		// e.g. 2194 ↔ left-right arrow
		return false;
	}
	if (block === 'Miscellaneous Technical') {
		// U+2300 -> U+23FE
		if (code === 0x231A) { // ⌚ watch
			return true;
		}
		if (code === 0x231B) { // ⌛ hourglass
			return true;
		}
		if (code === 0x23F0) { // ⏰ alarm clock
			return true;
		}
		if (code === 0x23F3) { // ⏳ hourglass with flowing sand
			return true;
		}
		return false;
	}

	if (block === 'Enclosed Alphanumerics') {
		// e.g. 24C2 Ⓜ circled M
		return false;
	}
	if (block === 'Geometric Shapes') {
		// e.g. 25AA ▪ black small square
		return false;
	}
	if (block === 'Supplemental Arrows-B') {
		// e.g. 2934 ⤴ right arrow curving up
		return false;
	}
	if (block === 'Miscellaneous Symbols and Arrows') {
		if (code === 0x2B50) { // ⭐ white medium star
			return true;
		}
		if (code === 0x2B55) { // ⭕ heavy large circle
			return true;
		}
		return false;
	}
	if (block === 'CJK Symbols and Punctuation') {
		// e.g. 303D 〽 part alternation mark
		return false;
	}
	if (block === 'Enclosed CJK Letters and Months') {
		// e.g. 3297 ㊗ Japanese “congratulations” button
		return false;
	}
	if (block === 'Mahjong Tiles') {
		// e.g. 1F004 🀄 mahjong red dragon
		return false;
	}
	if (block === 'Playing Cards') {
		// e.g. 1F0CF 🃏 joker
		return false;
	}
	if (block === 'Enclosed Alphanumeric Supplement') {
		// e.g. 1F170 🅰 A button (blood type)
		return false;
	}
	if (block === 'Enclosed Ideographic Supplement') {
		// e.g. 1F201 🈁 Japanese “here” button
		return false;
	}



	// include some blocks that look like emojis
	if (block === 'Miscellaneous Symbols') {
		return true;
	}
	if (block === 'Dingbats') {
		return true;
	}
	if (block === 'Miscellaneous Symbols and Pictographs') {
		return true;
	}
	if (block === 'Emoticons') {
		return true;
	}
	if (block === 'Transport and Map Symbols') {
		return true;
	}
	if (block === 'Supplemental Symbols and Pictographs') {
		return true;
	}

	return isInEmojiTest;
}

// http://www.fileformat.info/info/unicode/block/index.htm
// replace ^([^\t]+)\tU\+([0-9A-Z]+)\tU\+([0-9A-Z]+)
// with if (code >= 0x$2 && code <= 0x$3) return '$1';
function getCodeBlock(code) {
	if (code >= 0x0000 && code <= 0x007F) return 'Basic Latin';
	if (code >= 0x0080 && code <= 0x00FF) return 'Latin-1 Supplement';
	if (code >= 0x0100 && code <= 0x017F) return 'Latin Extended-A';
	if (code >= 0x0180 && code <= 0x024F) return 'Latin Extended-B';
	if (code >= 0x0250 && code <= 0x02AF) return 'IPA Extensions';
	if (code >= 0x02B0 && code <= 0x02FF) return 'Spacing Modifier Letters';
	if (code >= 0x0300 && code <= 0x036F) return 'Combining Diacritical Marks';
	if (code >= 0x0370 && code <= 0x03FF) return 'Greek and Coptic';
	if (code >= 0x0400 && code <= 0x04FF) return 'Cyrillic';
	if (code >= 0x0500 && code <= 0x052F) return 'Cyrillic Supplement';
	if (code >= 0x0530 && code <= 0x058F) return 'Armenian';
	if (code >= 0x0590 && code <= 0x05FF) return 'Hebrew';
	if (code >= 0x0600 && code <= 0x06FF) return 'Arabic';
	if (code >= 0x0700 && code <= 0x074F) return 'Syriac';
	if (code >= 0x0750 && code <= 0x077F) return 'Arabic Supplement';
	if (code >= 0x0780 && code <= 0x07BF) return 'Thaana';
	if (code >= 0x07C0 && code <= 0x07FF) return 'NKo';
	if (code >= 0x0800 && code <= 0x083F) return 'Samaritan';
	if (code >= 0x0840 && code <= 0x085F) return 'Mandaic';
	if (code >= 0x08A0 && code <= 0x08FF) return 'Arabic Extended-A';
	if (code >= 0x0900 && code <= 0x097F) return 'Devanagari';
	if (code >= 0x0980 && code <= 0x09FF) return 'Bengali';
	if (code >= 0x0A00 && code <= 0x0A7F) return 'Gurmukhi';
	if (code >= 0x0A80 && code <= 0x0AFF) return 'Gujarati';
	if (code >= 0x0B00 && code <= 0x0B7F) return 'Oriya';
	if (code >= 0x0B80 && code <= 0x0BFF) return 'Tamil';
	if (code >= 0x0C00 && code <= 0x0C7F) return 'Telugu';
	if (code >= 0x0C80 && code <= 0x0CFF) return 'Kannada';
	if (code >= 0x0D00 && code <= 0x0D7F) return 'Malayalam';
	if (code >= 0x0D80 && code <= 0x0DFF) return 'Sinhala';
	if (code >= 0x0E00 && code <= 0x0E7F) return 'Thai';
	if (code >= 0x0E80 && code <= 0x0EFF) return 'Lao';
	if (code >= 0x0F00 && code <= 0x0FFF) return 'Tibetan';
	if (code >= 0x1000 && code <= 0x109F) return 'Myanmar';
	if (code >= 0x10A0 && code <= 0x10FF) return 'Georgian';
	if (code >= 0x1100 && code <= 0x11FF) return 'Hangul Jamo';
	if (code >= 0x1200 && code <= 0x137F) return 'Ethiopic';
	if (code >= 0x1380 && code <= 0x139F) return 'Ethiopic Supplement';
	if (code >= 0x13A0 && code <= 0x13FF) return 'Cherokee';
	if (code >= 0x1400 && code <= 0x167F) return 'Unified Canadian Aboriginal Syllabics';
	if (code >= 0x1680 && code <= 0x169F) return 'Ogham';
	if (code >= 0x16A0 && code <= 0x16FF) return 'Runic';
	if (code >= 0x1700 && code <= 0x171F) return 'Tagalog';
	if (code >= 0x1720 && code <= 0x173F) return 'Hanunoo';
	if (code >= 0x1740 && code <= 0x175F) return 'Buhid';
	if (code >= 0x1760 && code <= 0x177F) return 'Tagbanwa';
	if (code >= 0x1780 && code <= 0x17FF) return 'Khmer';
	if (code >= 0x1800 && code <= 0x18AF) return 'Mongolian';
	if (code >= 0x18B0 && code <= 0x18FF) return 'Unified Canadian Aboriginal Syllabics Extended';
	if (code >= 0x1900 && code <= 0x194F) return 'Limbu';
	if (code >= 0x1950 && code <= 0x197F) return 'Tai Le';
	if (code >= 0x1980 && code <= 0x19DF) return 'New Tai Lue';
	if (code >= 0x19E0 && code <= 0x19FF) return 'Khmer Symbols';
	if (code >= 0x1A00 && code <= 0x1A1F) return 'Buginese';
	if (code >= 0x1A20 && code <= 0x1AAF) return 'Tai Tham';
	if (code >= 0x1AB0 && code <= 0x1AFF) return 'Combining Diacritical Marks Extended';
	if (code >= 0x1B00 && code <= 0x1B7F) return 'Balinese';
	if (code >= 0x1B80 && code <= 0x1BBF) return 'Sundanese';
	if (code >= 0x1BC0 && code <= 0x1BFF) return 'Batak';
	if (code >= 0x1C00 && code <= 0x1C4F) return 'Lepcha';
	if (code >= 0x1C50 && code <= 0x1C7F) return 'Ol Chiki';
	if (code >= 0x1C80 && code <= 0x1C8F) return 'Cyrillic Extended-C';
	if (code >= 0x1CC0 && code <= 0x1CCF) return 'Sundanese Supplement';
	if (code >= 0x1CD0 && code <= 0x1CFF) return 'Vedic Extensions';
	if (code >= 0x1D00 && code <= 0x1D7F) return 'Phonetic Extensions';
	if (code >= 0x1D80 && code <= 0x1DBF) return 'Phonetic Extensions Supplement';
	if (code >= 0x1DC0 && code <= 0x1DFF) return 'Combining Diacritical Marks Supplement';
	if (code >= 0x1E00 && code <= 0x1EFF) return 'Latin Extended Additional';
	if (code >= 0x1F00 && code <= 0x1FFF) return 'Greek Extended';
	if (code >= 0x2000 && code <= 0x206F) return 'General Punctuation';
	if (code >= 0x2070 && code <= 0x209F) return 'Superscripts and Subscripts';
	if (code >= 0x20A0 && code <= 0x20CF) return 'Currency Symbols';
	if (code >= 0x20D0 && code <= 0x20FF) return 'Combining Diacritical Marks for Symbols';
	if (code >= 0x2100 && code <= 0x214F) return 'Letterlike Symbols';
	if (code >= 0x2150 && code <= 0x218F) return 'Number Forms';
	if (code >= 0x2190 && code <= 0x21FF) return 'Arrows';
	if (code >= 0x2200 && code <= 0x22FF) return 'Mathematical Operators';
	if (code >= 0x2300 && code <= 0x23FF) return 'Miscellaneous Technical';
	if (code >= 0x2400 && code <= 0x243F) return 'Control Pictures';
	if (code >= 0x2440 && code <= 0x245F) return 'Optical Character Recognition';
	if (code >= 0x2460 && code <= 0x24FF) return 'Enclosed Alphanumerics';
	if (code >= 0x2500 && code <= 0x257F) return 'Box Drawing';
	if (code >= 0x2580 && code <= 0x259F) return 'Block Elements';
	if (code >= 0x25A0 && code <= 0x25FF) return 'Geometric Shapes';
	if (code >= 0x2600 && code <= 0x26FF) return 'Miscellaneous Symbols';
	if (code >= 0x2700 && code <= 0x27BF) return 'Dingbats';
	if (code >= 0x27C0 && code <= 0x27EF) return 'Miscellaneous Mathematical Symbols-A';
	if (code >= 0x27F0 && code <= 0x27FF) return 'Supplemental Arrows-A';
	if (code >= 0x2800 && code <= 0x28FF) return 'Braille Patterns';
	if (code >= 0x2900 && code <= 0x297F) return 'Supplemental Arrows-B';
	if (code >= 0x2980 && code <= 0x29FF) return 'Miscellaneous Mathematical Symbols-B';
	if (code >= 0x2A00 && code <= 0x2AFF) return 'Supplemental Mathematical Operators';
	if (code >= 0x2B00 && code <= 0x2BFF) return 'Miscellaneous Symbols and Arrows';
	if (code >= 0x2C00 && code <= 0x2C5F) return 'Glagolitic';
	if (code >= 0x2C60 && code <= 0x2C7F) return 'Latin Extended-C';
	if (code >= 0x2C80 && code <= 0x2CFF) return 'Coptic';
	if (code >= 0x2D00 && code <= 0x2D2F) return 'Georgian Supplement';
	if (code >= 0x2D30 && code <= 0x2D7F) return 'Tifinagh';
	if (code >= 0x2D80 && code <= 0x2DDF) return 'Ethiopic Extended';
	if (code >= 0x2DE0 && code <= 0x2DFF) return 'Cyrillic Extended-A';
	if (code >= 0x2E00 && code <= 0x2E7F) return 'Supplemental Punctuation';
	if (code >= 0x2E80 && code <= 0x2EFF) return 'CJK Radicals Supplement';
	if (code >= 0x2F00 && code <= 0x2FDF) return 'Kangxi Radicals';
	if (code >= 0x2FF0 && code <= 0x2FFF) return 'Ideographic Description Characters';
	if (code >= 0x3000 && code <= 0x303F) return 'CJK Symbols and Punctuation';
	if (code >= 0x3040 && code <= 0x309F) return 'Hiragana';
	if (code >= 0x30A0 && code <= 0x30FF) return 'Katakana';
	if (code >= 0x3100 && code <= 0x312F) return 'Bopomofo';
	if (code >= 0x3130 && code <= 0x318F) return 'Hangul Compatibility Jamo';
	if (code >= 0x3190 && code <= 0x319F) return 'Kanbun';
	if (code >= 0x31A0 && code <= 0x31BF) return 'Bopomofo Extended';
	if (code >= 0x31C0 && code <= 0x31EF) return 'CJK Strokes';
	if (code >= 0x31F0 && code <= 0x31FF) return 'Katakana Phonetic Extensions';
	if (code >= 0x3200 && code <= 0x32FF) return 'Enclosed CJK Letters and Months';
	if (code >= 0x3300 && code <= 0x33FF) return 'CJK Compatibility';
	if (code >= 0x3400 && code <= 0x4DBF) return 'CJK Unified Ideographs Extension A';
	if (code >= 0x4DC0 && code <= 0x4DFF) return 'Yijing Hexagram Symbols';
	if (code >= 0x4E00 && code <= 0x9FFF) return 'CJK Unified Ideographs';
	if (code >= 0xA000 && code <= 0xA48F) return 'Yi Syllables';
	if (code >= 0xA490 && code <= 0xA4CF) return 'Yi Radicals';
	if (code >= 0xA4D0 && code <= 0xA4FF) return 'Lisu';
	if (code >= 0xA500 && code <= 0xA63F) return 'Vai';
	if (code >= 0xA640 && code <= 0xA69F) return 'Cyrillic Extended-B';
	if (code >= 0xA6A0 && code <= 0xA6FF) return 'Bamum';
	if (code >= 0xA700 && code <= 0xA71F) return 'Modifier Tone Letters';
	if (code >= 0xA720 && code <= 0xA7FF) return 'Latin Extended-D';
	if (code >= 0xA800 && code <= 0xA82F) return 'Syloti Nagri';
	if (code >= 0xA830 && code <= 0xA83F) return 'Common Indic Number Forms';
	if (code >= 0xA840 && code <= 0xA87F) return 'Phags-pa';
	if (code >= 0xA880 && code <= 0xA8DF) return 'Saurashtra';
	if (code >= 0xA8E0 && code <= 0xA8FF) return 'Devanagari Extended';
	if (code >= 0xA900 && code <= 0xA92F) return 'Kayah Li';
	if (code >= 0xA930 && code <= 0xA95F) return 'Rejang';
	if (code >= 0xA960 && code <= 0xA97F) return 'Hangul Jamo Extended-A';
	if (code >= 0xA980 && code <= 0xA9DF) return 'Javanese';
	if (code >= 0xA9E0 && code <= 0xA9FF) return 'Myanmar Extended-B';
	if (code >= 0xAA00 && code <= 0xAA5F) return 'Cham';
	if (code >= 0xAA60 && code <= 0xAA7F) return 'Myanmar Extended-A';
	if (code >= 0xAA80 && code <= 0xAADF) return 'Tai Viet';
	if (code >= 0xAAE0 && code <= 0xAAFF) return 'Meetei Mayek Extensions';
	if (code >= 0xAB00 && code <= 0xAB2F) return 'Ethiopic Extended-A';
	if (code >= 0xAB30 && code <= 0xAB6F) return 'Latin Extended-E';
	if (code >= 0xAB70 && code <= 0xABBF) return 'Cherokee Supplement';
	if (code >= 0xABC0 && code <= 0xABFF) return 'Meetei Mayek';
	if (code >= 0xAC00 && code <= 0xD7AF) return 'Hangul Syllables';
	if (code >= 0xD7B0 && code <= 0xD7FF) return 'Hangul Jamo Extended-B';
	if (code >= 0xD800 && code <= 0xDB7F) return 'High Surrogates';
	if (code >= 0xDB80 && code <= 0xDBFF) return 'High Private Use Surrogates';
	if (code >= 0xDC00 && code <= 0xDFFF) return 'Low Surrogates';
	if (code >= 0xE000 && code <= 0xF8FF) return 'Private Use Area';
	if (code >= 0xF900 && code <= 0xFAFF) return 'CJK Compatibility Ideographs';
	if (code >= 0xFB00 && code <= 0xFB4F) return 'Alphabetic Presentation Forms';
	if (code >= 0xFB50 && code <= 0xFDFF) return 'Arabic Presentation Forms-A';
	if (code >= 0xFE00 && code <= 0xFE0F) return 'Variation Selectors';
	if (code >= 0xFE10 && code <= 0xFE1F) return 'Vertical Forms';
	if (code >= 0xFE20 && code <= 0xFE2F) return 'Combining Half Marks';
	if (code >= 0xFE30 && code <= 0xFE4F) return 'CJK Compatibility Forms';
	if (code >= 0xFE50 && code <= 0xFE6F) return 'Small Form Variants';
	if (code >= 0xFE70 && code <= 0xFEFF) return 'Arabic Presentation Forms-B';
	if (code >= 0xFF00 && code <= 0xFFEF) return 'Halfwidth and Fullwidth Forms';
	if (code >= 0xFFF0 && code <= 0xFFFF) return 'Specials';
	if (code >= 0x10000 && code <= 0x1007F) return 'Linear B Syllabary';
	if (code >= 0x10080 && code <= 0x100FF) return 'Linear B Ideograms';
	if (code >= 0x10100 && code <= 0x1013F) return 'Aegean Numbers';
	if (code >= 0x10140 && code <= 0x1018F) return 'Ancient Greek Numbers';
	if (code >= 0x10190 && code <= 0x101CF) return 'Ancient Symbols';
	if (code >= 0x101D0 && code <= 0x101FF) return 'Phaistos Disc';
	if (code >= 0x10280 && code <= 0x1029F) return 'Lycian';
	if (code >= 0x102A0 && code <= 0x102DF) return 'Carian';
	if (code >= 0x102E0 && code <= 0x102FF) return 'Coptic Epact Numbers';
	if (code >= 0x10300 && code <= 0x1032F) return 'Old Italic';
	if (code >= 0x10330 && code <= 0x1034F) return 'Gothic';
	if (code >= 0x10350 && code <= 0x1037F) return 'Old Permic';
	if (code >= 0x10380 && code <= 0x1039F) return 'Ugaritic';
	if (code >= 0x103A0 && code <= 0x103DF) return 'Old Persian';
	if (code >= 0x10400 && code <= 0x1044F) return 'Deseret';
	if (code >= 0x10450 && code <= 0x1047F) return 'Shavian';
	if (code >= 0x10480 && code <= 0x104AF) return 'Osmanya';
	if (code >= 0x104B0 && code <= 0x104FF) return 'Osage';
	if (code >= 0x10500 && code <= 0x1052F) return 'Elbasan';
	if (code >= 0x10530 && code <= 0x1056F) return 'Caucasian Albanian';
	if (code >= 0x10600 && code <= 0x1077F) return 'Linear A';
	if (code >= 0x10800 && code <= 0x1083F) return 'Cypriot Syllabary';
	if (code >= 0x10840 && code <= 0x1085F) return 'Imperial Aramaic';
	if (code >= 0x10860 && code <= 0x1087F) return 'Palmyrene';
	if (code >= 0x10880 && code <= 0x108AF) return 'Nabataean';
	if (code >= 0x108E0 && code <= 0x108FF) return 'Hatran';
	if (code >= 0x10900 && code <= 0x1091F) return 'Phoenician';
	if (code >= 0x10920 && code <= 0x1093F) return 'Lydian';
	if (code >= 0x10980 && code <= 0x1099F) return 'Meroitic Hieroglyphs';
	if (code >= 0x109A0 && code <= 0x109FF) return 'Meroitic Cursive';
	if (code >= 0x10A00 && code <= 0x10A5F) return 'Kharoshthi';
	if (code >= 0x10A60 && code <= 0x10A7F) return 'Old South Arabian';
	if (code >= 0x10A80 && code <= 0x10A9F) return 'Old North Arabian';
	if (code >= 0x10AC0 && code <= 0x10AFF) return 'Manichaean';
	if (code >= 0x10B00 && code <= 0x10B3F) return 'Avestan';
	if (code >= 0x10B40 && code <= 0x10B5F) return 'Inscriptional Parthian';
	if (code >= 0x10B60 && code <= 0x10B7F) return 'Inscriptional Pahlavi';
	if (code >= 0x10B80 && code <= 0x10BAF) return 'Psalter Pahlavi';
	if (code >= 0x10C00 && code <= 0x10C4F) return 'Old Turkic';
	if (code >= 0x10C80 && code <= 0x10CFF) return 'Old Hungarian';
	if (code >= 0x10E60 && code <= 0x10E7F) return 'Rumi Numeral Symbols';
	if (code >= 0x11000 && code <= 0x1107F) return 'Brahmi';
	if (code >= 0x11080 && code <= 0x110CF) return 'Kaithi';
	if (code >= 0x110D0 && code <= 0x110FF) return 'Sora Sompeng';
	if (code >= 0x11100 && code <= 0x1114F) return 'Chakma';
	if (code >= 0x11150 && code <= 0x1117F) return 'Mahajani';
	if (code >= 0x11180 && code <= 0x111DF) return 'Sharada';
	if (code >= 0x111E0 && code <= 0x111FF) return 'Sinhala Archaic Numbers';
	if (code >= 0x11200 && code <= 0x1124F) return 'Khojki';
	if (code >= 0x11280 && code <= 0x112AF) return 'Multani';
	if (code >= 0x112B0 && code <= 0x112FF) return 'Khudawadi';
	if (code >= 0x11300 && code <= 0x1137F) return 'Grantha';
	if (code >= 0x11400 && code <= 0x1147F) return 'Newa';
	if (code >= 0x11480 && code <= 0x114DF) return 'Tirhuta';
	if (code >= 0x11580 && code <= 0x115FF) return 'Siddham';
	if (code >= 0x11600 && code <= 0x1165F) return 'Modi';
	if (code >= 0x11660 && code <= 0x1167F) return 'Mongolian Supplement';
	if (code >= 0x11680 && code <= 0x116CF) return 'Takri';
	if (code >= 0x11700 && code <= 0x1173F) return 'Ahom';
	if (code >= 0x118A0 && code <= 0x118FF) return 'Warang Citi';
	if (code >= 0x11AC0 && code <= 0x11AFF) return 'Pau Cin Hau';
	if (code >= 0x11C00 && code <= 0x11C6F) return 'Bhaiksuki';
	if (code >= 0x11C70 && code <= 0x11CBF) return 'Marchen';
	if (code >= 0x12000 && code <= 0x123FF) return 'Cuneiform';
	if (code >= 0x12400 && code <= 0x1247F) return 'Cuneiform Numbers and Punctuation';
	if (code >= 0x12480 && code <= 0x1254F) return 'Early Dynastic Cuneiform';
	if (code >= 0x13000 && code <= 0x1342F) return 'Egyptian Hieroglyphs';
	if (code >= 0x14400 && code <= 0x1467F) return 'Anatolian Hieroglyphs';
	if (code >= 0x16800 && code <= 0x16A3F) return 'Bamum Supplement';
	if (code >= 0x16A40 && code <= 0x16A6F) return 'Mro';
	if (code >= 0x16AD0 && code <= 0x16AFF) return 'Bassa Vah';
	if (code >= 0x16B00 && code <= 0x16B8F) return 'Pahawh Hmong';
	if (code >= 0x16F00 && code <= 0x16F9F) return 'Miao';
	if (code >= 0x16FE0 && code <= 0x16FFF) return 'Ideographic Symbols and Punctuation';
	if (code >= 0x17000 && code <= 0x187FF) return 'Tangut';
	if (code >= 0x18800 && code <= 0x18AFF) return 'Tangut Components';
	if (code >= 0x1B000 && code <= 0x1B0FF) return 'Kana Supplement';
	if (code >= 0x1BC00 && code <= 0x1BC9F) return 'Duployan';
	if (code >= 0x1BCA0 && code <= 0x1BCAF) return 'Shorthand Format Controls';
	if (code >= 0x1D000 && code <= 0x1D0FF) return 'Byzantine Musical Symbols';
	if (code >= 0x1D100 && code <= 0x1D1FF) return 'Musical Symbols';
	if (code >= 0x1D200 && code <= 0x1D24F) return 'Ancient Greek Musical Notation';
	if (code >= 0x1D300 && code <= 0x1D35F) return 'Tai Xuan Jing Symbols';
	if (code >= 0x1D360 && code <= 0x1D37F) return 'Counting Rod Numerals';
	if (code >= 0x1D400 && code <= 0x1D7FF) return 'Mathematical Alphanumeric Symbols';
	if (code >= 0x1D800 && code <= 0x1DAAF) return 'Sutton SignWriting';
	if (code >= 0x1E000 && code <= 0x1E02F) return 'Glagolitic Supplement';
	if (code >= 0x1E800 && code <= 0x1E8DF) return 'Mende Kikakui';
	if (code >= 0x1E900 && code <= 0x1E95F) return 'Adlam';
	if (code >= 0x1EE00 && code <= 0x1EEFF) return 'Arabic Mathematical Alphabetic Symbols';
	if (code >= 0x1F000 && code <= 0x1F02F) return 'Mahjong Tiles';
	if (code >= 0x1F030 && code <= 0x1F09F) return 'Domino Tiles';
	if (code >= 0x1F0A0 && code <= 0x1F0FF) return 'Playing Cards';
	if (code >= 0x1F100 && code <= 0x1F1FF) return 'Enclosed Alphanumeric Supplement';
	if (code >= 0x1F200 && code <= 0x1F2FF) return 'Enclosed Ideographic Supplement';
	if (code >= 0x1F300 && code <= 0x1F5FF) return 'Miscellaneous Symbols and Pictographs';
	if (code >= 0x1F600 && code <= 0x1F64F) return 'Emoticons';
	if (code >= 0x1F650 && code <= 0x1F67F) return 'Ornamental Dingbats';
	if (code >= 0x1F680 && code <= 0x1F6FF) return 'Transport and Map Symbols';
	if (code >= 0x1F700 && code <= 0x1F77F) return 'Alchemical Symbols';
	if (code >= 0x1F780 && code <= 0x1F7FF) return 'Geometric Shapes Extended';
	if (code >= 0x1F800 && code <= 0x1F8FF) return 'Supplemental Arrows-C';
	if (code >= 0x1F900 && code <= 0x1F9FF) return 'Supplemental Symbols and Pictographs';
	if (code >= 0x20000 && code <= 0x2A6DF) return 'CJK Unified Ideographs Extension B';
	if (code >= 0x2A700 && code <= 0x2B73F) return 'CJK Unified Ideographs Extension C';
	if (code >= 0x2B740 && code <= 0x2B81F) return 'CJK Unified Ideographs Extension D';
	if (code >= 0x2B820 && code <= 0x2CEAF) return 'CJK Unified Ideographs Extension E';
	if (code >= 0x2F800 && code <= 0x2FA1F) return 'CJK Compatibility Ideographs Supplement';
	if (code >= 0xE0000 && code <= 0xE007F) return 'Tags';
	if (code >= 0xE0100 && code <= 0xE01EF) return 'Variation Selectors Supplement';
	if (code >= 0xF0000 && code <= 0xFFFFF) return 'Supplementary Private Use Area-A';
	if (code >= 0x100000 && code <= 0x10FFFF) return 'Supplementary Private Use Area-B';
}

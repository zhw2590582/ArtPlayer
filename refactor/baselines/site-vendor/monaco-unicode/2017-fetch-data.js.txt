
var http = require('http');
var fs = require('fs');

function fetchFile(PATH, DEST) {

	var options = {
		hostname: 'www.unicode.org',
		port: 80,
		path: PATH,
		method: 'GET'
	};

	var req = http.request(options, (res) => {
		var dest = fs.createWriteStream(DEST);

		console.log(`STATUS: ${res.statusCode}`);
		console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
		res.pipe(dest);
	});

	req.on('error', (e) => {
		console.log(`problem with request: ${e.message}`);
	});

	// write data to request body
	req.end();
}

// fetchFile(`/Public/9.0.0/ucd/UnicodeData.txt`, './UnicodeData.txt');
// 10.0.0 is still a WIP, but some emojis only show up in 10.0.0
fetchFile(`/Public/10.0.0/ucd/UnicodeData-10.0.0d5.txt`, './UnicodeData.txt');

fetchFile(`/Public/emoji/5.0/emoji-test.txt`, './emoji-test.txt');

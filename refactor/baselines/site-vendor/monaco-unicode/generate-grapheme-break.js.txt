const fs = require('fs');
const assert = require('assert');

function parseLine(line) {
	line = line.replace(/#.*/, '');
	line = line.trim();
	if (line.length === 0) {
		return null;
	}

	let parts = line.split(';').map(s => s.trim());

	if (/\.\./.test(parts[0])) {
		const range = parts[0].split('..');
		return { from: parseInt(range[0], 16), to: parseInt(range[1], 16), type: parts[1] };
	}

	return { from: parseInt(parts[0], 16), to: parseInt(parts[0], 16), type: parts[1] };
}

function parseFile(filename) {
	const fileContents = fs.readFileSync(filename).toString('utf8');
	const lines = fileContents.split('\n');
	const result = [];
	for (let i = 0; i < lines.length; i++) {
		let line = parseLine(lines[i]);
		if (line) {
			result.push(line);
		}
	}
	return result;
}

const typeToInt = {
	'Prepend': 1,
	'CR': 2,
	'LF': 3,
	'Control': 4,
	'Extend': 5,
	'Regional_Indicator': 6,
	'SpacingMark': 7,
	'L': 8,
	'V': 9,
	'T': 10,
	'LV': 11,
	'LVT': 12,
	'ZWJ': 13,
	'Extended_Pictographic': 14
}

const tuples = [];
parseFile('./GraphemeBreakProperty.txt').forEach(item => tuples.push({ from:item.from, to:item.to, type: typeToInt[item.type] }));
parseFile('./emoji-data.txt').filter(item => item.type === 'Extended_Pictographic').forEach(item => tuples.push({ from:item.from, to:item.to, type: typeToInt[item.type] }));
tuples.sort((t1, t2) => t1.from - t2.from);

function pow2smallereq(n) {
	let pow = 0;
	let r = 1;
	while (r <= n) {
		r = r << 1;
		pow++;
	}
	return pow;
}

let tuplesTree = [];
function buildTree(fromIndex, toIndex, outIndex) {
	const elementCount = toIndex - fromIndex + 1;

	let midIndex;
	if (elementCount === 1) {
		midIndex = fromIndex;
	} else if (elementCount === 2) {
		midIndex = fromIndex + 1;
	} else {
		const subtreeDepth = pow2smallereq(elementCount) - 1;
		const minRightCount = (1 << (subtreeDepth - 1)) - 1;
		const idealLeftCount = (1 << subtreeDepth) - 1;
		const leftCount = Math.min(idealLeftCount, elementCount - 1 - minRightCount);
		// console.log(`elementCount: ${elementCount}, subtreeDepth: ${subtreeDepth}, idealLeftCount: ${idealLeftCount}, minRightCount: ${minRightCount} ==> leftCount: ${leftCount}`);
		midIndex = fromIndex + leftCount;
	}

	tuplesTree[outIndex] = tuples[midIndex];

	// if (outIndex !== 1) {
	// 	const parentIndex = (outIndex / 2) | 0;
	// 	if (outIndex === 2 * parentIndex) {
	// 		// I am left node
	// 		if (tuplesTree[outIndex].to >= tuplesTree[parentIndex].from) {
	// 			console.log(`illegal tree 1!`);
	// 		}
	// 	} else {
	// 		// I am right node
	// 		if (tuplesTree[outIndex].from <= tuplesTree[parentIndex].to) {
	// 			console.log(`illegal tree 2!`);
	// 		}
	// 	}
	// }

	if (fromIndex < midIndex) {
		// left subtree
		buildTree(fromIndex, midIndex - 1, 2 * outIndex);
	}
	if (midIndex < toIndex) {
		// right subtree
		buildTree(midIndex + 1, toIndex, 2 * outIndex + 1);
	}
}
buildTree(0, tuples.length - 1, 1);

// for (let i = 1; i < tuplesTree.length; i++) {
// 	if (tuplesTree[i]) {
// 		console.log(`${i} - ${tuplesTree[i].from},${tuplesTree[i].to},${tuplesTree[i].type}`);
// 	} else {
// 		console.log(`${i} - undefined`);
// 	}
// }

function validateNode(nodeIndex) {
	const node = tuplesTree[nodeIndex];

	const leftChildIndex = 2 * nodeIndex;
	if (leftChildIndex < tuplesTree.length) {
		const leftChild = tuplesTree[leftChildIndex];
		assert.ok(leftChild.to < node.from);
		validateNode(leftChildIndex);
	}

	const rightChildIndex = 2 * nodeIndex + 1;
	if (rightChildIndex < tuplesTree.length) {
		const rightChild = tuplesTree[rightChildIndex];
		assert.ok(rightChild.from > node.to);
		validateNode(rightChildIndex);
	}
}
validateNode(1);

let result = [0,0,0];
tuplesTree.forEach(t => result.push(t.from, t.to, t.type));

console.log(JSON.stringify(result));

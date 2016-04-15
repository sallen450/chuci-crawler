'use strict';

const songci = require('../data/chuci.json');
const path = require('path');
const fs = require('fs');

const checkedSognci = [];
const unCheckedSognci = [];

// const punctuationRe = /[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b ]/;
// const chineseRe = /^[\u4e00-\u9fa5]+$/g;
/**
 * 检查是否有不标准的字符
 */
function checkContent(text) {
	// avoid lastIndex bug
	let checkedRe = /^[\u4e00-\u9fa5： 。 ！；  ， ： “ ”（ ） 、 ？ 《 》 ·]+$/g;

	if (checkedRe.test(text)) {
		// □\/\\＿囗
		return true;
	}

	return false;
}

/**
 * 循环剔除脏数据
 */
songci.forEach(function (item) {
	if (checkContent(item.content)) {
		checkedSognci.push(item);
	} else {
		unCheckedSognci.push(item);
	}
});

/**
 * 将新的数据写入 checked.json
 */
const checkedFileFullPath = path.join(__dirname, '../data/checked.json');
const unCheckedFileFullPath = path.join(__dirname, '../data/unchecked.json');
fs.writeFileSync(checkedFileFullPath, JSON.stringify(checkedSognci), 'utf8', (err) => {
	if (err) {
		console.error(err);
	}
});
fs.writeFileSync(unCheckedFileFullPath, JSON.stringify(unCheckedSognci), 'utf8', (err) => {
	if (err) {
		console.error(err);
	}
});

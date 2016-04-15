'use strict';

var dict = require('../data/chuci.json');

/**
 * 含有不合法字符返回 false
 */
function checkSpecialChar(text) {
    var checkedRe = /^[\u4e00-\u9fa5： 。 ；  ， ： ！“ ”（ ） 、 ？ 《 》 ·]+$/g;

    if (checkedRe.test(text)) {
        return true;
    }
    return false;
}

function checkContent(str) {
	str = str || '';
	var i = 0;
	var length = str.length;
	for (var i = 0; i < length; i++) {
		if (!checkSpecialChar(str[i])) {
			console.log(str[i]);
		}
	}
}

dict.forEach(function (item) {
	if (!checkSpecialChar(item.content)) {
		console.log('========= begin ===========  ');
		console.log('      title: ', item.title);

		checkContent(item.content);

		console.log('=========  end  ===========  ');
		console.log('\n');
	}
});

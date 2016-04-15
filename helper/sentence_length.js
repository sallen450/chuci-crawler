'use strict';

const dict = require('../data/checked.json');
const _ = require('lodash');

const lengthObject = {};

function splitCi (ci) {
    ci = ci.replace(/[，。！？［］；《》、]/g, "$")
            .replace(/（.*）/g, "")
            .replace(/【.*】/g, "");
    ci = ci.split("$").map(function(s) {
        return s.trim();
    });
    return _.compact(ci);
}

dict.forEach(function (ci) {
    let ciArray = splitCi(ci.content);
    ciArray.forEach(function (sentence) {
        if (!lengthObject[sentence.length]) {
            lengthObject[sentence.length] = 1;
        } else {
            lengthObject[sentence.length]++;
        }
    });
});

console.log(lengthObject);

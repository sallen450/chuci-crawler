'use strict';

const spidex = require('spidex');
const cherrio = require('cheerio');
const Scarlet = require("scarlet-task");
const fs = require('fs');
require('sugar');

const chineseRe = /[\u4e00-\u9fa5]/;
const scarlet = new Scarlet(1);

const ChuCiDict = [];

/**
 * 字符串左边用特殊字符补全成固定长度
 * @param  {string} str          需要 pad 的字符串
 * @param  {Number} length       pad 后的长度
 * @param  {String} padCharactor 用于 pad 的字符
 * @return {String}              处理后的字符串
 */
function leftPad (str, length, padCharactor) {
    str = String(str) || '';
    padCharactor = String(padCharactor) || ' ';
    length = parseInt(length) || str.length;

    const padString = padCharactor.repeat(length - str.length);

    return padString + str;
}

/**
 * 爬取一页的数据并处理
 **/
function processor(taskObject) {
    let url = taskObject.task;
    console.log(`crawling url ${url}`);

    spidex.get(url, {
        charset: 'gb18030',
        header: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Referer': 'https://www.google.com.hk/',
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36'
        }
    }, function (content, statusCode, responseHeaders) {
        if (statusCode !== 200) {
            console.log('crawl page error...');
            return scarlet.taskDone(taskObject);
        }

        let $ = cherrio.load(content);
        let resultText = $('.body').text();
        let resultArray = resultText.split('\n');

        resultArray.forEach(function (line) {
            if (chineseRe.test(line)) {
                if (line.charCodeAt(0) === 9679) {
                    ChuCiDict.push({});
                    ChuCiDict[ChuCiDict.length - 1].author = '屈原';
                    ChuCiDict[ChuCiDict.length - 1].title = line.trim().substr(1);
                } else {
                    // 词
                    if (!ChuCiDict[ChuCiDict.length - 1].content) {
                        ChuCiDict[ChuCiDict.length - 1].content = '';
                    }

                    ChuCiDict[ChuCiDict.length - 1].content += line.trim();
                }
            }
        });

        let random = Number.random(2, 5);
        random = random * 1000;
        setTimeout(function () {
            return scarlet.taskDone(taskObject);
        }, random);
        console.log(`crawled url ${url}`);
    }).on("error", function errorCallback(err) {
        console.error(err);
        scarlet.taskDone(taskObject);
    });
}

/**
 * 入口函数
 * @param  {Number} pageCount 要爬取的页数
 * @param  {String} savedPath 爬取数据保存的路径
 */
function start(pageCount, savedPath) {
    for (let i = 2; i <= pageCount; i++) {
        scarlet.push(`http://www.guoxue.com/jibu/chuci/content/cc_${leftPad(i, 2, '0')}.htm`, processor);
    }

    scarlet.afterFinish(pageCount - 1, function() {
        fs.writeFileSync(savedPath, JSON.stringify(ChuCiDict), 'utf8', (err) => {
            if (err) {
                console.error(err);
            }
        });
    }, false)
}

/**
 * exec the crawle
 */
const savedPath = './data/chuci.json';
const pageCount = 67;
start(pageCount, savedPath);

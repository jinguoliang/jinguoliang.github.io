'use strict'
var fs = require('fs')
  , path = require('path')
  , fmt = require('util').format
  , readline = require('readline')
  , request = require('request')
  , cheerio = require('cheerio')
  , progress = require('request-progress')
  , ProgressBar = require('progress')
  , open = require('open')
  , colors = require('colors')
  , List = require('term-list');


var picDir = '../../public/img/';
function main() {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  console.log('请输入豆瓣书籍 url：');
  var ask = 'url:';
  rl.question(ask, function(answer) {
    getBookInfo(answer);
    rl.close();
  });

}

function readYaml(path, f) {
	fs.readFile(path, function(err, fileContents) {
		fileContents = fileContents.toString()
		// 1. 分行
		var lines = fileContents.split('\n');
		var root = {};
		var tree = root;
		var stack = [];
		stack.push(tree);
		for(var i = 0; i< lines.length; i++) {
			// 2. 分词， 一行的数据结构
			var s = / */.exec(lines[i]);
			var indent = s[0].length;
			var has = lines[i].indexOf('-') > -1;
			var content = lines[i].substring(indent + (has? 1:0));
			var kv = function(a) {
				var i = content.indexOf(':');
				return [content.substring(0,i), content.substring(i+2)];
			}(content);
			var key = kv[0].trim();
			var value = kv[1];
			var lineStruct = [indent, has, key, value];
			var lastArray;
			// 3. 逐行转化为json数据
			if (content == '--' || content == '') {
			} else {
				if (has) {
					var tr = {};
					lastArray.push(tr);
					tree = tr;
				}
				if(value.trim() !== '') {
					tree[key] = value;
				} else {
					if (i + 1 < lines.length) {
						if(lines[i+1].indexOf('-') > -1) {
							tree[key] = [];
							lastArray = tree[key];
							stack.push(tree);
						} else {
							tree[key] = value;
						}
					} else {
						tree[key] = value;
					}
				}

			}
		}
		f(root);
	})
}

function getBookInfo(url) {
	request(url, function (err, res, html) {
		// the whole of webpage data has been collected. parsing time!
		var $ = cheerio.load(html);
		var infoNode = $('div.subject.clearfix');
		var infoText = infoNode.find('div#info').text().replace(/\s+/g,'');
		console.log(infoText);
		var hints = getHints(infoNode.find('span.pl'), $);
		var infoMap = mapInfo(infoText, hints);
		var title = $('div#wrapper h1 span').text();
		var picUrl;
		infoNode.find('a.nbg').each(function($this){
			picUrl = $(this).attr('href');
			console.log("Get book face:" + picUrl);
		});
		
		var info = {};	
		info['title'] = title;
		info['status'] = '在读';
		info['author'] = infoMap['作者'];
		info['publisher'] = infoMap['出版社:'];
		info['language'] = '';
		info['link'] = url;
		info['cover'] = picUrl;

		var bookfile = '../../_posts/读书/2016-01-6-book_List.md';
		readYaml(bookfile, function(tree){
			tree['books'].push(info);
			console.log(tree);
		});
		
	});
}

function mapInfo(text, keys) {
	var start = 0;
	var poss = [];
	var infoMap = {};
	for(var i=0;i<keys.length;i++){
		var p = text.indexOf(keys[i], start);	
		start = p + 1;
		poss.push(p);
	}
	for(var i=0;i< keys.length;i++){
		var val;
		if (i == keys.length - 1) {
			val = text.substring(poss[i]+keys[i].length);	
		} else {
			val = text.substring(poss[i]+keys[i].length, poss[i+1]);	
		}
		infoMap[keys[i]] =  val;
	}
	return infoMap;
}

function getHints(nodes, $) {
	var hints = new Array();
	nodes.each(function($this){
		var author = $(this).text().trim();
		hints.push(author);
	});
	return hints;
}

main();


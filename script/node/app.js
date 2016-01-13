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

function getBookInfo(url) {
	request(url, function (err, res, html) {
		// the whole of webpage data has been collected. parsing time!
		var $ = cheerio.load(html);
		var infoNode = $('div.subject.clearfix');
		infoNode.find('a.nbg').each(function($this){
			var picUrl = $(this).attr('href');
			console.log("Get book face:" + picUrl);
			request(picUrl).pipe(fs.createWriteStream("./pic.jpg"));
		});
		var infoText = infoNode.find('div#info').text().replace(/\s+/g,'');
		console.log(infoText);
		var hints = getHints(infoNode.find('span.pl'), $);
		var infoMap = mapInfo(infoText, hints);
		
	});
}

function mapInfo(text, keys) {
	var start = 0;
	var poss = [];
	var infoMap = {};
	for(var i=0;i<keys.length;i++){
		var p = text.indexOf(keys[i], start);	
		start = p + 1;
		console.log(keys[i] +"--"+ p);
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


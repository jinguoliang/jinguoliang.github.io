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

  /*
	var bookfile = '../../_posts/读书/2016-01-6-book_List.md';
	var json = readYaml(bookfile);
	*/
}

function readYaml(path) {
	fs.readFile(path, function(err, fileContents) {
	  fileContents = fileContents.toString()
	  console.log('\n')
	  console.log(fileContents);
	  console.log('\noutputs:\n')
	  console.log(yaml.eval(fileContents))
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
		infoNode.find('a.nbg').each(function($this){
			var picUrl = $(this).attr('href');
			console.log("Get book face:" + picUrl);
			request(picUrl).pipe(fs.createWriteStream(picDir+ title +'.jpg'));
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
		console.log(keys[i] +"--"+ val);
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


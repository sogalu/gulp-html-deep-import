'use strict'
const gutil = require('gulp-util')
const through = require('through2')
const fs = require('fs')

module.exports = function (componentsUrl) {
	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file)
			return
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-html-import', 'Streaming not supported'))
			return
		}

		const fileReg = /@import\s"(.*)"/gi

		let data = file.contents.toString()
		while(data.indexOf("@import") >= 0) {
			console.log("-------->"+data.indexOf("@import"))
			data = data.replace(fileReg, (match, componentName) => {
					return fs.readFileSync(componentsUrl + componentName, {
						encoding: 'utf8'
					})
				})
		}

		file.contents = new Buffer(data)
		file.path = gutil.replaceExtension(file.path, '.html')
		console.log('Import finished.')
		cb(null, file)
	})
}

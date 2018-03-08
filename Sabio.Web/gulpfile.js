/// <binding ProjectOpened='watch' />
/*
This file is the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. https://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
const $ = require('gulp-load-plugins')();


const templatesSource = 'Scripts/components/**/*.html';
const publicJSDestination = 'Scripts/dest/public';


const workDir = 'Scripts/dest/temp';
const workDirThirdPartyJS = 'third-party.js';
const workDirOurJS = 'our.js';
const workDirTemplates = 'templates.js';


const thirdPartyJS = [
    'Scripts/jquery-3.1.1.js',
    'Scripts/angular.js',
    'Scripts/angular-ui-router.js',
    'node_modules/viz.js/viz-lite.js',
    'node_modules/idb/lib/idb.js',
    'Scripts/underscores-min.js',
    'Scripts/bootstrap.min.js',
    'Scripts/ng-tags-input.min.js',
    'Scripts/showdown.js',
    'Scripts/intro.js'
];

const ourJS = [
    'Scripts/index.js',
    'Scripts/index-routes.js',
    'Scripts/services/**/*.js',
    'Scripts/components/**/*.js' 
];

const workFiles = [
    workDir + '/' + workDirThirdPartyJS,
    workDir + '/' + workDirOurJS,
    workDir + '/' + workDirTemplates,
];

const css = [
    'Content/bootstrap.css',
    'Content/font-awesome.min.css',
    'Content/modal.css',
    'Content/roboto-slab.css',
    'Content/roboto.css',
    'Content/index.css',
    'Content/style/**/*.css',
    'Content/fonts/**/*.css',
    'Scripts/components/**/*.css'
];


//delete the output file(s)
gulp.task('clean', function () {
    $.del.sync(publicJSDestination);
});

gulp.task('third-party-js', function(){
    return gulp.src(thirdPartyJS)
        //.pipe($.uglify())
        .pipe($.wrap('\n//<%= file.relative %>\n<%= contents %>;'))
        .pipe($.concat(workDirThirdPartyJS))
        .pipe(gulp.dest(workDir));        
});

gulp.task('our-js', function(){
    return gulp.src(ourJS)
        .pipe($.babel({
            presets: [
                ['env', { modules: false } ]
            ]
        }))
        //.pipe($.uglify())
        .pipe($.wrap('\n//<%= file.relative %>\n<%= contents %>;'))
        .pipe($.concat(workDirOurJS))
        .pipe(gulp.dest(workDir));    
});

gulp.task('templates', function(){
	return gulp.src(templatesSource)
		.pipe($.ngTemplates({
			module: 'BananaPad',
			standalone: false,
            path: function(path, base){
                return path.replace(base, '').replace(/^/, '/Scripts/components/');
            }
		}))
		.pipe($.rename(workDirTemplates))
		.pipe(gulp.dest(workDir));
});

gulp.task('public-js', ['third-party-js', 'our-js', 'templates'], function () {
    return gulp.src(workFiles)
        .pipe($.concat('app.public.js'))
        .pipe(gulp.dest(publicJSDestination));        
})

gulp.task('css', function(){
    return gulp.src(css)
        .pipe($.wrap('\n/* <%= file.relative %> */\n<%= contents %>'))
        .pipe($.concat('app.public.css'))
        .pipe(gulp.dest(publicJSDestination));
});

gulp.task('watch', function () {
    gulp.start('public-js', 'css');

    const toWatch =
        thirdPartyJS
        .concat(ourJS)
        .concat(templatesSource)
        .concat(css);

    gulp.watch(toWatch, ['public-js', 'css']);
});


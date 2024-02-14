import gulp from 'gulp';
import './gulp/dev.js';
import './gulp/docs.js';

// Запуск сборки
gulp.task('default', gulp.series('clean:dev', gulp.parallel('includeFiles:dev', 'sass:dev', 'copyImages:dev',"copySvg:dev", 'fonts:dev', 'files:dev', 'js:dev'), gulp.parallel('server:dev', 'watch:dev')));

// Production
gulp.task('docs', gulp.series('clean:docs', gulp.parallel('includeFiles:docs', 'sass:docs', 'copyImages:docs', "copySvg:docs", 'fonts:docs', 'files:docs', 'js:docs'), gulp.parallel('server:docs')));

// gulp.series('clean', gulp.parallel('includeFiles', 'sass', 'copyImages', 'fonts', 'files', 'js'), gulp.parallel('server', 'watch'))

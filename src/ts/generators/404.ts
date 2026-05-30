import Hexo from 'hexo';

export function register404Generator(hexo: Hexo): void {
  hexo.extend.generator.register('404', function () {
    return {
      path: '404.html',
      layout: ['404'],
      data: {
        title: '404',
        type: '404',
      },
    };
  });
}

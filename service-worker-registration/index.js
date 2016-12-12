export const PROJECT_REVISION = '{{PROJECT_REVISION}}';

let SUCCESS_HANDLERS = [];
let ERROR_HANDLERS = [];

if ('serviceWorker' in navigator) {
  let config = {};
  try {
    config = JSON.parse(decodeURIComponent(document.querySelectorAll('meta[name*="/config/environment"]')[0].content));
  } catch (e) {}

  let rootUrl = config.ui_base_path || '{{ROOT_URL}}';
  if (rootUrl && !rootUrl.startsWith('/')) {
    rootUrl = '/' + rootUrl
  }
  if (rootUrl && !rootUrl.endsWith('/')) {
    rootUrl = rootUrl + '/'
  }

  navigator.serviceWorker.register(rootUrl + 'sw.js', { scope: rootUrl })
    .then(function(reg) {
      let current = Promise.resolve();

      for (let i = 0; i < SUCCESS_HANDLERS.length; i++) {
        current = current.then(function() {
          return SUCCESS_HANDLERS[i](reg);
        });
      }

      return current
        .then(function() {
          console.log('Service Worker registration succeeded. Scope is ' + reg.scope);
        });
    })
    .catch(function(error) {
      let current = Promise.resolve();

      for (let i = 0; i < ERROR_HANDLERS.length; i++) {
        current = current.then(function() {
          return ERROR_HANDLERS[i](error);
        });
      }

      return current
        .then(function() {
          console.log('Service Worker registration failed with ' + error);
        });
    });
}


export function addSuccessHandler(func) {
  SUCCESS_HANDLERS.push(func);
}

export function addErrorHandler(func) {
  ERROR_HANDLERS.push(func);
}

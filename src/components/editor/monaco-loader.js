function onGotAmdLoader(config, callback) {
  if (window.LOADER_PENDING) {
    window.require.config(config);
  }

  // Load monaco
  window.require(['vs/editor/editor.main'], () => {
    callback();
  });

  // Call the delayed callbacks when AMD loader has been loaded
  if (window.LOADER_PENDING) {
    window.LOADER_PENDING = false;

    const loaderCallbacks = window.LOADER_CALLBACKS;

    if (loaderCallbacks && loaderCallbacks.length) {
      let currentCallback = loaderCallbacks.shift();

      while (currentCallback) {
        currentCallback.fn.call(currentCallback.window);
        currentCallback = loaderCallbacks.shift();
      }
    }
  }
}

export default {
  load(path, callback) {
    let srcPath = '';

    if (path) {
      srcPath = path;
    } else {
      srcPath =
        'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.11.1/min';
    }

    if (window.monaco) {
      callback();
      return;
    }

    const config = {
      paths: {
        vs: `${srcPath}/vs`
      }
    };

    const loaderUrl = `${config.paths.vs}/loader.js`;

    // Load AMD loader if necessary
    if (window.LOADER_PENDING) {
      // We need to avoid loading multiple loader.js when there are multiple editors loading concurrently
      //  delay to call callbacks except the first one
      window.LOADER_CALLBACKS = window.LOADER_CALLBACKS || [];
      window.LOADER_CALLBACKS.push({
        window: this,
        fn: () => onGotAmdLoader(config, callback)
      });
    } else if (typeof window.require === 'undefined') {
      const loaderScript = window.document.createElement('script');

      loaderScript.type = 'text/javascript';
      loaderScript.src = loaderUrl;
      loaderScript.addEventListener('load', () =>
        onGotAmdLoader(config, callback)
      );

      window.document.body.appendChild(loaderScript);
      window.LOADER_PENDING = true;
    } else {
      onGotAmdLoader(config, callback);
    }
  }
};

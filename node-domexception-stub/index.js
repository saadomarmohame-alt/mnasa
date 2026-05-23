// Export the platform's native DOMException to resolve the deprecation warning
if (typeof globalThis !== 'undefined' && globalThis.DOMException) {
  module.exports = globalThis.DOMException;
} else if (typeof global !== 'undefined' && global.DOMException) {
  module.exports = global.DOMException;
} else {
  module.exports = class DOMException extends Error {
    constructor(message, name) {
      super(message);
      this.name = name || 'DOMException';
    }
  };
}

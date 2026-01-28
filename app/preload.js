(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./shared/types.ts":
/*!*************************!*\
  !*** ./shared/types.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IPC_CHANNELS: () => (/* binding */ IPC_CHANNELS)
/* harmony export */ });
// Voice Intelligence App - Shared Types
// This file contains TypeScript types shared between main and renderer processes

// ============================================================================
// IPC Channel Names
// ============================================================================

/** IPC channel names as const for type safety */
const IPC_CHANNELS = {
  PING: 'app:ping',
  SEND_AUDIO: 'audio:send-for-transcription',
  SET_WHISPER_MODE: 'whisper:set-mode',
  SET_API_KEY: 'settings:set-api-key',
  GET_WHISPER_MODE: 'whisper:get-mode'
};

// ============================================================================
// Whisper Types
// ============================================================================

/** Whisper transcription mode */

/** Result from transcription */

// ============================================================================
// IPC API Interface
// ============================================================================

/**
 * API exposed to renderer via contextBridge.
 * All methods use invoke/handle pattern (request/response).
 */

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./main/preload.ts ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _shared_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/types */ "./shared/types.ts");



// Secure IPC bridge
// CRITICAL: Never expose raw ipcRenderer to the renderer process
// All IPC communication must go through explicit, typed API methods

// Implement all API methods with explicit channel binding
const api = {
  ping: () => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke(_shared_types__WEBPACK_IMPORTED_MODULE_1__.IPC_CHANNELS.PING),
  sendAudioForTranscription: audioData => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke(_shared_types__WEBPACK_IMPORTED_MODULE_1__.IPC_CHANNELS.SEND_AUDIO, audioData),
  setWhisperMode: mode => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke(_shared_types__WEBPACK_IMPORTED_MODULE_1__.IPC_CHANNELS.SET_WHISPER_MODE, mode),
  getWhisperMode: () => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke(_shared_types__WEBPACK_IMPORTED_MODULE_1__.IPC_CHANNELS.GET_WHISPER_MODE),
  setApiKey: key => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke(_shared_types__WEBPACK_IMPORTED_MODULE_1__.IPC_CHANNELS.SET_API_KEY, key)
};
electron__WEBPACK_IMPORTED_MODULE_0__.contextBridge.exposeInMainWorld('electronAPI', api);
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlbG9hZC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7Ozs7Ozs7QUNWQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNPLE1BQU1BLFlBQVksR0FBRztFQUN4QkMsSUFBSSxFQUFFLFVBQVU7RUFDaEJDLFVBQVUsRUFBRSw4QkFBOEI7RUFDMUNDLGdCQUFnQixFQUFFLGtCQUFrQjtFQUNwQ0MsV0FBVyxFQUFFLHNCQUFzQjtFQUNuQ0MsZ0JBQWdCLEVBQUU7QUFDdEIsQ0FBVTs7QUFFVjtBQUNBO0FBQ0E7O0FBRUE7O0FBR0E7O0FBT0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEc7Ozs7Ozs7Ozs7QUNyQ0EscUM7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBLEU7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RCxFOzs7Ozs7Ozs7Ozs7OztBQ05zRDtBQUM2Qjs7QUFFbkY7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBTUcsR0FBZ0IsR0FBRztFQUNyQkMsSUFBSSxFQUFFQSxDQUFBLEtBQU1GLGlEQUFXLENBQUNHLE1BQU0sQ0FBQ1YsdURBQVksQ0FBQ0MsSUFBSSxDQUFDO0VBQ2pEVSx5QkFBeUIsRUFBR0MsU0FBc0IsSUFDOUNMLGlEQUFXLENBQUNHLE1BQU0sQ0FBQ1YsdURBQVksQ0FBQ0UsVUFBVSxFQUFFVSxTQUFTLENBQUM7RUFDMURDLGNBQWMsRUFBR0MsSUFBaUIsSUFDOUJQLGlEQUFXLENBQUNHLE1BQU0sQ0FBQ1YsdURBQVksQ0FBQ0csZ0JBQWdCLEVBQUVXLElBQUksQ0FBQztFQUMzREMsY0FBYyxFQUFFQSxDQUFBLEtBQ1pSLGlEQUFXLENBQUNHLE1BQU0sQ0FBQ1YsdURBQVksQ0FBQ0ssZ0JBQWdCLENBQUM7RUFDckRXLFNBQVMsRUFBR0MsR0FBVyxJQUNuQlYsaURBQVcsQ0FBQ0csTUFBTSxDQUFDVix1REFBWSxDQUFDSSxXQUFXLEVBQUVhLEdBQUc7QUFDeEQsQ0FBQztBQUVEWCxtREFBYSxDQUFDWSxpQkFBaUIsQ0FBQyxhQUFhLEVBQUVWLEdBQUcsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdm9pY2UtaW50ZWxsaWdlbmNlLWFwcC93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vdm9pY2UtaW50ZWxsaWdlbmNlLWFwcC8uL3NoYXJlZC90eXBlcy50cyIsIndlYnBhY2s6Ly92b2ljZS1pbnRlbGxpZ2VuY2UtYXBwL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJlbGVjdHJvblwiIiwid2VicGFjazovL3ZvaWNlLWludGVsbGlnZW5jZS1hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdm9pY2UtaW50ZWxsaWdlbmNlLWFwcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly92b2ljZS1pbnRlbGxpZ2VuY2UtYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly92b2ljZS1pbnRlbGxpZ2VuY2UtYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdm9pY2UtaW50ZWxsaWdlbmNlLWFwcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3ZvaWNlLWludGVsbGlnZW5jZS1hcHAvLi9tYWluL3ByZWxvYWQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKGdsb2JhbCwgKCkgPT4ge1xucmV0dXJuICIsIi8vIFZvaWNlIEludGVsbGlnZW5jZSBBcHAgLSBTaGFyZWQgVHlwZXNcbi8vIFRoaXMgZmlsZSBjb250YWlucyBUeXBlU2NyaXB0IHR5cGVzIHNoYXJlZCBiZXR3ZWVuIG1haW4gYW5kIHJlbmRlcmVyIHByb2Nlc3Nlc1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBJUEMgQ2hhbm5lbCBOYW1lc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKiogSVBDIGNoYW5uZWwgbmFtZXMgYXMgY29uc3QgZm9yIHR5cGUgc2FmZXR5ICovXG5leHBvcnQgY29uc3QgSVBDX0NIQU5ORUxTID0ge1xuICAgIFBJTkc6ICdhcHA6cGluZycsXG4gICAgU0VORF9BVURJTzogJ2F1ZGlvOnNlbmQtZm9yLXRyYW5zY3JpcHRpb24nLFxuICAgIFNFVF9XSElTUEVSX01PREU6ICd3aGlzcGVyOnNldC1tb2RlJyxcbiAgICBTRVRfQVBJX0tFWTogJ3NldHRpbmdzOnNldC1hcGkta2V5JyxcbiAgICBHRVRfV0hJU1BFUl9NT0RFOiAnd2hpc3BlcjpnZXQtbW9kZScsXG59IGFzIGNvbnN0O1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBXaGlzcGVyIFR5cGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKiBXaGlzcGVyIHRyYW5zY3JpcHRpb24gbW9kZSAqL1xuZXhwb3J0IHR5cGUgV2hpc3Blck1vZGUgPSAnbG9jYWwnIHwgJ2FwaSc7XG5cbi8qKiBSZXN1bHQgZnJvbSB0cmFuc2NyaXB0aW9uICovXG5leHBvcnQgaW50ZXJmYWNlIFRyYW5zY3JpcHRpb25SZXN1bHQge1xuICAgIHRleHQ6IHN0cmluZztcbiAgICBkdXJhdGlvbjogbnVtYmVyO1xuICAgIG1vZGU6IFdoaXNwZXJNb2RlO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBJUEMgQVBJIEludGVyZmFjZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIEFQSSBleHBvc2VkIHRvIHJlbmRlcmVyIHZpYSBjb250ZXh0QnJpZGdlLlxuICogQWxsIG1ldGhvZHMgdXNlIGludm9rZS9oYW5kbGUgcGF0dGVybiAocmVxdWVzdC9yZXNwb25zZSkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRWxlY3Ryb25BUEkge1xuICAgIC8qKlxuICAgICAqIFRlc3QgSVBDIGNvbW11bmljYXRpb24uXG4gICAgICogQHJldHVybnMgUHJvbWlzZSByZXNvbHZpbmcgdG8gJ3BvbmcnXG4gICAgICovXG4gICAgcGluZzogKCkgPT4gUHJvbWlzZTxzdHJpbmc+O1xuXG4gICAgLyoqXG4gICAgICogU2VuZCBhdWRpbyBkYXRhIHRvIG1haW4gcHJvY2VzcyBmb3IgdHJhbnNjcmlwdGlvbi5cbiAgICAgKiBAcGFyYW0gYXVkaW9EYXRhIC0gV0FWIGF1ZGlvIGFzIEFycmF5QnVmZmVyICgxNmtIeiBtb25vIDE2LWJpdCBQQ00pXG4gICAgICogQHJldHVybnMgUHJvbWlzZSByZXNvbHZpbmcgd2l0aCB0cmFuc2NyaXB0aW9uIHJlc3VsdFxuICAgICAqL1xuICAgIHNlbmRBdWRpb0ZvclRyYW5zY3JpcHRpb246IChhdWRpb0RhdGE6IEFycmF5QnVmZmVyKSA9PiBQcm9taXNlPFRyYW5zY3JpcHRpb25SZXN1bHQ+O1xuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBXaGlzcGVyIHRyYW5zY3JpcHRpb24gbW9kZS5cbiAgICAgKiBAcGFyYW0gbW9kZSAtICdsb2NhbCcgZm9yIHdoaXNwZXIuY3BwIG9yICdhcGknIGZvciBPcGVuQUlcbiAgICAgKi9cbiAgICBzZXRXaGlzcGVyTW9kZTogKG1vZGU6IFdoaXNwZXJNb2RlKSA9PiBQcm9taXNlPHZvaWQ+O1xuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBjdXJyZW50IFdoaXNwZXIgdHJhbnNjcmlwdGlvbiBtb2RlLlxuICAgICAqL1xuICAgIGdldFdoaXNwZXJNb2RlOiAoKSA9PiBQcm9taXNlPFdoaXNwZXJNb2RlPjtcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgT3BlbkFJIEFQSSBrZXkgZm9yIEFQSSBtb2RlLlxuICAgICAqIEBwYXJhbSBrZXkgLSBPcGVuQUkgQVBJIGtleVxuICAgICAqL1xuICAgIHNldEFwaUtleTogKGtleTogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGNvbnRleHRCcmlkZ2UsIGlwY1JlbmRlcmVyIH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IHsgSVBDX0NIQU5ORUxTLCB0eXBlIEVsZWN0cm9uQVBJLCB0eXBlIFdoaXNwZXJNb2RlIH0gZnJvbSAnLi4vc2hhcmVkL3R5cGVzJztcblxuLy8gU2VjdXJlIElQQyBicmlkZ2Vcbi8vIENSSVRJQ0FMOiBOZXZlciBleHBvc2UgcmF3IGlwY1JlbmRlcmVyIHRvIHRoZSByZW5kZXJlciBwcm9jZXNzXG4vLyBBbGwgSVBDIGNvbW11bmljYXRpb24gbXVzdCBnbyB0aHJvdWdoIGV4cGxpY2l0LCB0eXBlZCBBUEkgbWV0aG9kc1xuXG4vLyBJbXBsZW1lbnQgYWxsIEFQSSBtZXRob2RzIHdpdGggZXhwbGljaXQgY2hhbm5lbCBiaW5kaW5nXG5jb25zdCBhcGk6IEVsZWN0cm9uQVBJID0ge1xuICAgIHBpbmc6ICgpID0+IGlwY1JlbmRlcmVyLmludm9rZShJUENfQ0hBTk5FTFMuUElORyksXG4gICAgc2VuZEF1ZGlvRm9yVHJhbnNjcmlwdGlvbjogKGF1ZGlvRGF0YTogQXJyYXlCdWZmZXIpID0+XG4gICAgICAgIGlwY1JlbmRlcmVyLmludm9rZShJUENfQ0hBTk5FTFMuU0VORF9BVURJTywgYXVkaW9EYXRhKSxcbiAgICBzZXRXaGlzcGVyTW9kZTogKG1vZGU6IFdoaXNwZXJNb2RlKSA9PlxuICAgICAgICBpcGNSZW5kZXJlci5pbnZva2UoSVBDX0NIQU5ORUxTLlNFVF9XSElTUEVSX01PREUsIG1vZGUpLFxuICAgIGdldFdoaXNwZXJNb2RlOiAoKSA9PlxuICAgICAgICBpcGNSZW5kZXJlci5pbnZva2UoSVBDX0NIQU5ORUxTLkdFVF9XSElTUEVSX01PREUpLFxuICAgIHNldEFwaUtleTogKGtleTogc3RyaW5nKSA9PlxuICAgICAgICBpcGNSZW5kZXJlci5pbnZva2UoSVBDX0NIQU5ORUxTLlNFVF9BUElfS0VZLCBrZXkpLFxufTtcblxuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZCgnZWxlY3Ryb25BUEknLCBhcGkpO1xuIl0sIm5hbWVzIjpbIklQQ19DSEFOTkVMUyIsIlBJTkciLCJTRU5EX0FVRElPIiwiU0VUX1dISVNQRVJfTU9ERSIsIlNFVF9BUElfS0VZIiwiR0VUX1dISVNQRVJfTU9ERSIsImNvbnRleHRCcmlkZ2UiLCJpcGNSZW5kZXJlciIsImFwaSIsInBpbmciLCJpbnZva2UiLCJzZW5kQXVkaW9Gb3JUcmFuc2NyaXB0aW9uIiwiYXVkaW9EYXRhIiwic2V0V2hpc3Blck1vZGUiLCJtb2RlIiwiZ2V0V2hpc3Blck1vZGUiLCJzZXRBcGlLZXkiLCJrZXkiLCJleHBvc2VJbk1haW5Xb3JsZCJdLCJzb3VyY2VSb290IjoiIn0=
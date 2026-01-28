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
  GET_WHISPER_MODE: 'whisper:get-mode',
  TOGGLE_RECORDING: 'recording:toggle',
  GET_RECORDING_STATE: 'recording:get-state',
  SET_RECORDING_STATE: 'recording:set-state'
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
  setApiKey: key => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke(_shared_types__WEBPACK_IMPORTED_MODULE_1__.IPC_CHANNELS.SET_API_KEY, key),
  onRecordingToggle: callback => {
    const handler = () => callback();
    electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.on(_shared_types__WEBPACK_IMPORTED_MODULE_1__.IPC_CHANNELS.TOGGLE_RECORDING, handler);
    // Return cleanup function
    return () => {
      electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.removeListener(_shared_types__WEBPACK_IMPORTED_MODULE_1__.IPC_CHANNELS.TOGGLE_RECORDING, handler);
    };
  },
  getRecordingState: () => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke(_shared_types__WEBPACK_IMPORTED_MODULE_1__.IPC_CHANNELS.GET_RECORDING_STATE),
  setRecordingState: isRecording => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke(_shared_types__WEBPACK_IMPORTED_MODULE_1__.IPC_CHANNELS.SET_RECORDING_STATE, isRecording)
};
electron__WEBPACK_IMPORTED_MODULE_0__.contextBridge.exposeInMainWorld('electronAPI', api);
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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dW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly92b2ljZS1pbnRlbGxpZ2VuY2UtYXBwLy4vc2hhcmVkL3R5cGVzLnRzIiwid2VicGFjazovL3ZvaWNlLWludGVsbGlnZW5jZS1hcHAvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImVsZWN0cm9uXCIiLCJ3ZWJwYWNrOi8vdm9pY2UtaW50ZWxsaWdlbmNlLWFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly92b2ljZS1pbnRlbGxpZ2VuY2UtYXBwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3ZvaWNlLWludGVsbGlnZW5jZS1hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3ZvaWNlLWludGVsbGlnZW5jZS1hcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly92b2ljZS1pbnRlbGxpZ2VuY2UtYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdm9pY2UtaW50ZWxsaWdlbmNlLWFwcC8uL21haW4vcHJlbG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoZ2xvYmFsLCAoKSA9PiB7XG5yZXR1cm4gIiwiLy8gVm9pY2UgSW50ZWxsaWdlbmNlIEFwcCAtIFNoYXJlZCBUeXBlc1xuLy8gVGhpcyBmaWxlIGNvbnRhaW5zIFR5cGVTY3JpcHQgdHlwZXMgc2hhcmVkIGJldHdlZW4gbWFpbiBhbmQgcmVuZGVyZXIgcHJvY2Vzc2VzXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIElQQyBDaGFubmVsIE5hbWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKiBJUEMgY2hhbm5lbCBuYW1lcyBhcyBjb25zdCBmb3IgdHlwZSBzYWZldHkgKi9cbmV4cG9ydCBjb25zdCBJUENfQ0hBTk5FTFMgPSB7XG4gICAgUElORzogJ2FwcDpwaW5nJyxcbiAgICBTRU5EX0FVRElPOiAnYXVkaW86c2VuZC1mb3ItdHJhbnNjcmlwdGlvbicsXG4gICAgU0VUX1dISVNQRVJfTU9ERTogJ3doaXNwZXI6c2V0LW1vZGUnLFxuICAgIFNFVF9BUElfS0VZOiAnc2V0dGluZ3M6c2V0LWFwaS1rZXknLFxuICAgIEdFVF9XSElTUEVSX01PREU6ICd3aGlzcGVyOmdldC1tb2RlJyxcbiAgICBUT0dHTEVfUkVDT1JESU5HOiAncmVjb3JkaW5nOnRvZ2dsZScsXG4gICAgR0VUX1JFQ09SRElOR19TVEFURTogJ3JlY29yZGluZzpnZXQtc3RhdGUnLFxuICAgIFNFVF9SRUNPUkRJTkdfU1RBVEU6ICdyZWNvcmRpbmc6c2V0LXN0YXRlJyxcbn0gYXMgY29uc3Q7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFdoaXNwZXIgVHlwZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLyoqIFdoaXNwZXIgdHJhbnNjcmlwdGlvbiBtb2RlICovXG5leHBvcnQgdHlwZSBXaGlzcGVyTW9kZSA9ICdsb2NhbCcgfCAnYXBpJztcblxuLyoqIFJlc3VsdCBmcm9tIHRyYW5zY3JpcHRpb24gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNjcmlwdGlvblJlc3VsdCB7XG4gICAgdGV4dDogc3RyaW5nO1xuICAgIGR1cmF0aW9uOiBudW1iZXI7XG4gICAgbW9kZTogV2hpc3Blck1vZGU7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIElQQyBBUEkgSW50ZXJmYWNlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogQVBJIGV4cG9zZWQgdG8gcmVuZGVyZXIgdmlhIGNvbnRleHRCcmlkZ2UuXG4gKiBBbGwgbWV0aG9kcyB1c2UgaW52b2tlL2hhbmRsZSBwYXR0ZXJuIChyZXF1ZXN0L3Jlc3BvbnNlKS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbGVjdHJvbkFQSSB7XG4gICAgLyoqXG4gICAgICogVGVzdCBJUEMgY29tbXVuaWNhdGlvbi5cbiAgICAgKiBAcmV0dXJucyBQcm9taXNlIHJlc29sdmluZyB0byAncG9uZydcbiAgICAgKi9cbiAgICBwaW5nOiAoKSA9PiBQcm9taXNlPHN0cmluZz47XG5cbiAgICAvKipcbiAgICAgKiBTZW5kIGF1ZGlvIGRhdGEgdG8gbWFpbiBwcm9jZXNzIGZvciB0cmFuc2NyaXB0aW9uLlxuICAgICAqIEBwYXJhbSBhdWRpb0RhdGEgLSBXQVYgYXVkaW8gYXMgQXJyYXlCdWZmZXIgKDE2a0h6IG1vbm8gMTYtYml0IFBDTSlcbiAgICAgKiBAcmV0dXJucyBQcm9taXNlIHJlc29sdmluZyB3aXRoIHRyYW5zY3JpcHRpb24gcmVzdWx0XG4gICAgICovXG4gICAgc2VuZEF1ZGlvRm9yVHJhbnNjcmlwdGlvbjogKGF1ZGlvRGF0YTogQXJyYXlCdWZmZXIpID0+IFByb21pc2U8VHJhbnNjcmlwdGlvblJlc3VsdD47XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIFdoaXNwZXIgdHJhbnNjcmlwdGlvbiBtb2RlLlxuICAgICAqIEBwYXJhbSBtb2RlIC0gJ2xvY2FsJyBmb3Igd2hpc3Blci5jcHAgb3IgJ2FwaScgZm9yIE9wZW5BSVxuICAgICAqL1xuICAgIHNldFdoaXNwZXJNb2RlOiAobW9kZTogV2hpc3Blck1vZGUpID0+IFByb21pc2U8dm9pZD47XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGN1cnJlbnQgV2hpc3BlciB0cmFuc2NyaXB0aW9uIG1vZGUuXG4gICAgICovXG4gICAgZ2V0V2hpc3Blck1vZGU6ICgpID0+IFByb21pc2U8V2hpc3Blck1vZGU+O1xuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBPcGVuQUkgQVBJIGtleSBmb3IgQVBJIG1vZGUuXG4gICAgICogQHBhcmFtIGtleSAtIE9wZW5BSSBBUEkga2V5XG4gICAgICovXG4gICAgc2V0QXBpS2V5OiAoa2V5OiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD47XG5cbiAgICAvKipcbiAgICAgKiBMaXN0ZW4gZm9yIHJlY29yZGluZyB0b2dnbGUgZXZlbnRzIGZyb20gZ2xvYmFsIGhvdGtleS5cbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgLSBGdW5jdGlvbiBjYWxsZWQgd2hlbiB0b2dnbGUgaXMgdHJpZ2dlcmVkXG4gICAgICogQHJldHVybnMgQ2xlYW51cCBmdW5jdGlvbiB0byByZW1vdmUgbGlzdGVuZXJcbiAgICAgKi9cbiAgICBvblJlY29yZGluZ1RvZ2dsZTogKGNhbGxiYWNrOiAoKSA9PiB2b2lkKSA9PiAoKSA9PiB2b2lkO1xuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBjdXJyZW50IHJlY29yZGluZyBzdGF0ZSBmcm9tIG1haW4gcHJvY2Vzcy5cbiAgICAgKi9cbiAgICBnZXRSZWNvcmRpbmdTdGF0ZTogKCkgPT4gUHJvbWlzZTxib29sZWFuPjtcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgcmVjb3JkaW5nIHN0YXRlIGluIG1haW4gcHJvY2Vzcy5cbiAgICAgKiBAcGFyYW0gaXNSZWNvcmRpbmcgLSBXaGV0aGVyIHJlY29yZGluZyBpcyBhY3RpdmVcbiAgICAgKi9cbiAgICBzZXRSZWNvcmRpbmdTdGF0ZTogKGlzUmVjb3JkaW5nOiBib29sZWFuKSA9PiBQcm9taXNlPHZvaWQ+O1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGNvbnRleHRCcmlkZ2UsIGlwY1JlbmRlcmVyIH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IHsgSVBDX0NIQU5ORUxTLCB0eXBlIEVsZWN0cm9uQVBJLCB0eXBlIFdoaXNwZXJNb2RlIH0gZnJvbSAnLi4vc2hhcmVkL3R5cGVzJztcblxuLy8gU2VjdXJlIElQQyBicmlkZ2Vcbi8vIENSSVRJQ0FMOiBOZXZlciBleHBvc2UgcmF3IGlwY1JlbmRlcmVyIHRvIHRoZSByZW5kZXJlciBwcm9jZXNzXG4vLyBBbGwgSVBDIGNvbW11bmljYXRpb24gbXVzdCBnbyB0aHJvdWdoIGV4cGxpY2l0LCB0eXBlZCBBUEkgbWV0aG9kc1xuXG4vLyBJbXBsZW1lbnQgYWxsIEFQSSBtZXRob2RzIHdpdGggZXhwbGljaXQgY2hhbm5lbCBiaW5kaW5nXG5jb25zdCBhcGk6IEVsZWN0cm9uQVBJID0ge1xuICAgIHBpbmc6ICgpID0+IGlwY1JlbmRlcmVyLmludm9rZShJUENfQ0hBTk5FTFMuUElORyksXG5cbiAgICBzZW5kQXVkaW9Gb3JUcmFuc2NyaXB0aW9uOiAoYXVkaW9EYXRhOiBBcnJheUJ1ZmZlcikgPT5cbiAgICAgICAgaXBjUmVuZGVyZXIuaW52b2tlKElQQ19DSEFOTkVMUy5TRU5EX0FVRElPLCBhdWRpb0RhdGEpLFxuXG4gICAgc2V0V2hpc3Blck1vZGU6IChtb2RlOiBXaGlzcGVyTW9kZSkgPT5cbiAgICAgICAgaXBjUmVuZGVyZXIuaW52b2tlKElQQ19DSEFOTkVMUy5TRVRfV0hJU1BFUl9NT0RFLCBtb2RlKSxcblxuICAgIGdldFdoaXNwZXJNb2RlOiAoKSA9PlxuICAgICAgICBpcGNSZW5kZXJlci5pbnZva2UoSVBDX0NIQU5ORUxTLkdFVF9XSElTUEVSX01PREUpLFxuXG4gICAgc2V0QXBpS2V5OiAoa2V5OiBzdHJpbmcpID0+XG4gICAgICAgIGlwY1JlbmRlcmVyLmludm9rZShJUENfQ0hBTk5FTFMuU0VUX0FQSV9LRVksIGtleSksXG5cbiAgICBvblJlY29yZGluZ1RvZ2dsZTogKGNhbGxiYWNrOiAoKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSAoKSA9PiBjYWxsYmFjaygpO1xuICAgICAgICBpcGNSZW5kZXJlci5vbihJUENfQ0hBTk5FTFMuVE9HR0xFX1JFQ09SRElORywgaGFuZGxlcik7XG4gICAgICAgIC8vIFJldHVybiBjbGVhbnVwIGZ1bmN0aW9uXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBpcGNSZW5kZXJlci5yZW1vdmVMaXN0ZW5lcihJUENfQ0hBTk5FTFMuVE9HR0xFX1JFQ09SRElORywgaGFuZGxlcik7XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGdldFJlY29yZGluZ1N0YXRlOiAoKSA9PlxuICAgICAgICBpcGNSZW5kZXJlci5pbnZva2UoSVBDX0NIQU5ORUxTLkdFVF9SRUNPUkRJTkdfU1RBVEUpLFxuXG4gICAgc2V0UmVjb3JkaW5nU3RhdGU6IChpc1JlY29yZGluZzogYm9vbGVhbikgPT5cbiAgICAgICAgaXBjUmVuZGVyZXIuaW52b2tlKElQQ19DSEFOTkVMUy5TRVRfUkVDT1JESU5HX1NUQVRFLCBpc1JlY29yZGluZyksXG59O1xuXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdlbGVjdHJvbkFQSScsIGFwaSk7XG4iXSwibmFtZXMiOlsiSVBDX0NIQU5ORUxTIiwiUElORyIsIlNFTkRfQVVESU8iLCJTRVRfV0hJU1BFUl9NT0RFIiwiU0VUX0FQSV9LRVkiLCJHRVRfV0hJU1BFUl9NT0RFIiwiVE9HR0xFX1JFQ09SRElORyIsIkdFVF9SRUNPUkRJTkdfU1RBVEUiLCJTRVRfUkVDT1JESU5HX1NUQVRFIiwiY29udGV4dEJyaWRnZSIsImlwY1JlbmRlcmVyIiwiYXBpIiwicGluZyIsImludm9rZSIsInNlbmRBdWRpb0ZvclRyYW5zY3JpcHRpb24iLCJhdWRpb0RhdGEiLCJzZXRXaGlzcGVyTW9kZSIsIm1vZGUiLCJnZXRXaGlzcGVyTW9kZSIsInNldEFwaUtleSIsImtleSIsIm9uUmVjb3JkaW5nVG9nZ2xlIiwiY2FsbGJhY2siLCJoYW5kbGVyIiwib24iLCJyZW1vdmVMaXN0ZW5lciIsImdldFJlY29yZGluZ1N0YXRlIiwic2V0UmVjb3JkaW5nU3RhdGUiLCJpc1JlY29yZGluZyIsImV4cG9zZUluTWFpbldvcmxkIl0sInNvdXJjZVJvb3QiOiIifQ==
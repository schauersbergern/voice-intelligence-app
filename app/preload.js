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
  SEND_AUDIO: 'audio:send-for-transcription'
  // Future channels (Mission 4+):
  // WHISPER_TRANSCRIBE: 'whisper:transcribe',
  // SETTINGS_GET: 'settings:get',
  // SETTINGS_SET: 'settings:set',
};

// ============================================================================
// IPC API Interface
// ============================================================================

/**
 * API exposed to renderer via contextBridge.
 * All methods use invoke/handle pattern (request/response).
 */

// ============================================================================
// Domain Types
// ============================================================================

// Future types for Mission 4+:
// export interface TranscriptionResult {
//   text: string;
//   confidence: number;
//   segments?: TranscriptionSegment[];
// }

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
  sendAudioForTranscription: audioData => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke(_shared_types__WEBPACK_IMPORTED_MODULE_1__.IPC_CHANNELS.SEND_AUDIO, audioData)
};
electron__WEBPACK_IMPORTED_MODULE_0__.contextBridge.exposeInMainWorld('electronAPI', api);
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlbG9hZC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7Ozs7Ozs7QUNWQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNPLE1BQU1BLFlBQVksR0FBRztFQUN4QkMsSUFBSSxFQUFFLFVBQVU7RUFDaEJDLFVBQVUsRUFBRTtFQUNaO0VBQ0E7RUFDQTtFQUNBO0FBQ0osQ0FBVTs7QUFFVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBZ0JBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSTs7Ozs7Ozs7OztBQ2pEQSxxQzs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0EsRTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdELEU7Ozs7Ozs7Ozs7Ozs7O0FDTnNEO0FBQ1c7O0FBRWpFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQU1HLEdBQWdCLEdBQUc7RUFDckJDLElBQUksRUFBRUEsQ0FBQSxLQUFNRixpREFBVyxDQUFDRyxNQUFNLENBQUNQLHVEQUFZLENBQUNDLElBQUksQ0FBQztFQUNqRE8seUJBQXlCLEVBQUdDLFNBQXNCLElBQzlDTCxpREFBVyxDQUFDRyxNQUFNLENBQUNQLHVEQUFZLENBQUNFLFVBQVUsRUFBRU8sU0FBUztBQUM3RCxDQUFDO0FBRUROLG1EQUFhLENBQUNPLGlCQUFpQixDQUFDLGFBQWEsRUFBRUwsR0FBRyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92b2ljZS1pbnRlbGxpZ2VuY2UtYXBwL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly92b2ljZS1pbnRlbGxpZ2VuY2UtYXBwLy4vc2hhcmVkL3R5cGVzLnRzIiwid2VicGFjazovL3ZvaWNlLWludGVsbGlnZW5jZS1hcHAvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImVsZWN0cm9uXCIiLCJ3ZWJwYWNrOi8vdm9pY2UtaW50ZWxsaWdlbmNlLWFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly92b2ljZS1pbnRlbGxpZ2VuY2UtYXBwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3ZvaWNlLWludGVsbGlnZW5jZS1hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3ZvaWNlLWludGVsbGlnZW5jZS1hcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly92b2ljZS1pbnRlbGxpZ2VuY2UtYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdm9pY2UtaW50ZWxsaWdlbmNlLWFwcC8uL21haW4vcHJlbG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoZ2xvYmFsLCAoKSA9PiB7XG5yZXR1cm4gIiwiLy8gVm9pY2UgSW50ZWxsaWdlbmNlIEFwcCAtIFNoYXJlZCBUeXBlc1xuLy8gVGhpcyBmaWxlIGNvbnRhaW5zIFR5cGVTY3JpcHQgdHlwZXMgc2hhcmVkIGJldHdlZW4gbWFpbiBhbmQgcmVuZGVyZXIgcHJvY2Vzc2VzXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIElQQyBDaGFubmVsIE5hbWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKiBJUEMgY2hhbm5lbCBuYW1lcyBhcyBjb25zdCBmb3IgdHlwZSBzYWZldHkgKi9cbmV4cG9ydCBjb25zdCBJUENfQ0hBTk5FTFMgPSB7XG4gICAgUElORzogJ2FwcDpwaW5nJyxcbiAgICBTRU5EX0FVRElPOiAnYXVkaW86c2VuZC1mb3ItdHJhbnNjcmlwdGlvbicsXG4gICAgLy8gRnV0dXJlIGNoYW5uZWxzIChNaXNzaW9uIDQrKTpcbiAgICAvLyBXSElTUEVSX1RSQU5TQ1JJQkU6ICd3aGlzcGVyOnRyYW5zY3JpYmUnLFxuICAgIC8vIFNFVFRJTkdTX0dFVDogJ3NldHRpbmdzOmdldCcsXG4gICAgLy8gU0VUVElOR1NfU0VUOiAnc2V0dGluZ3M6c2V0Jyxcbn0gYXMgY29uc3Q7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIElQQyBBUEkgSW50ZXJmYWNlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogQVBJIGV4cG9zZWQgdG8gcmVuZGVyZXIgdmlhIGNvbnRleHRCcmlkZ2UuXG4gKiBBbGwgbWV0aG9kcyB1c2UgaW52b2tlL2hhbmRsZSBwYXR0ZXJuIChyZXF1ZXN0L3Jlc3BvbnNlKS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbGVjdHJvbkFQSSB7XG4gICAgLyoqXG4gICAgICogVGVzdCBJUEMgY29tbXVuaWNhdGlvbi5cbiAgICAgKiBAcmV0dXJucyBQcm9taXNlIHJlc29sdmluZyB0byAncG9uZydcbiAgICAgKi9cbiAgICBwaW5nOiAoKSA9PiBQcm9taXNlPHN0cmluZz47XG5cbiAgICAvKipcbiAgICAgKiBTZW5kIGF1ZGlvIGRhdGEgdG8gbWFpbiBwcm9jZXNzIGZvciB0cmFuc2NyaXB0aW9uLlxuICAgICAqIEBwYXJhbSBhdWRpb0RhdGEgLSBXQVYgYXVkaW8gYXMgQXJyYXlCdWZmZXIgKDE2a0h6IG1vbm8gMTYtYml0IFBDTSlcbiAgICAgKiBAcmV0dXJucyBQcm9taXNlIHJlc29sdmluZyB3aGVuIGF1ZGlvIGlzIHJlY2VpdmVkXG4gICAgICovXG4gICAgc2VuZEF1ZGlvRm9yVHJhbnNjcmlwdGlvbjogKGF1ZGlvRGF0YTogQXJyYXlCdWZmZXIpID0+IFByb21pc2U8dm9pZD47XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERvbWFpbiBUeXBlc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBGdXR1cmUgdHlwZXMgZm9yIE1pc3Npb24gNCs6XG4vLyBleHBvcnQgaW50ZXJmYWNlIFRyYW5zY3JpcHRpb25SZXN1bHQge1xuLy8gICB0ZXh0OiBzdHJpbmc7XG4vLyAgIGNvbmZpZGVuY2U6IG51bWJlcjtcbi8vICAgc2VnbWVudHM/OiBUcmFuc2NyaXB0aW9uU2VnbWVudFtdO1xuLy8gfVxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgY29udGV4dEJyaWRnZSwgaXBjUmVuZGVyZXIgfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgeyBJUENfQ0hBTk5FTFMsIHR5cGUgRWxlY3Ryb25BUEkgfSBmcm9tICcuLi9zaGFyZWQvdHlwZXMnO1xuXG4vLyBTZWN1cmUgSVBDIGJyaWRnZVxuLy8gQ1JJVElDQUw6IE5ldmVyIGV4cG9zZSByYXcgaXBjUmVuZGVyZXIgdG8gdGhlIHJlbmRlcmVyIHByb2Nlc3Ncbi8vIEFsbCBJUEMgY29tbXVuaWNhdGlvbiBtdXN0IGdvIHRocm91Z2ggZXhwbGljaXQsIHR5cGVkIEFQSSBtZXRob2RzXG5cbi8vIEltcGxlbWVudCBhbGwgQVBJIG1ldGhvZHMgd2l0aCBleHBsaWNpdCBjaGFubmVsIGJpbmRpbmdcbmNvbnN0IGFwaTogRWxlY3Ryb25BUEkgPSB7XG4gICAgcGluZzogKCkgPT4gaXBjUmVuZGVyZXIuaW52b2tlKElQQ19DSEFOTkVMUy5QSU5HKSxcbiAgICBzZW5kQXVkaW9Gb3JUcmFuc2NyaXB0aW9uOiAoYXVkaW9EYXRhOiBBcnJheUJ1ZmZlcikgPT5cbiAgICAgICAgaXBjUmVuZGVyZXIuaW52b2tlKElQQ19DSEFOTkVMUy5TRU5EX0FVRElPLCBhdWRpb0RhdGEpLFxufTtcblxuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZCgnZWxlY3Ryb25BUEknLCBhcGkpO1xuIl0sIm5hbWVzIjpbIklQQ19DSEFOTkVMUyIsIlBJTkciLCJTRU5EX0FVRElPIiwiY29udGV4dEJyaWRnZSIsImlwY1JlbmRlcmVyIiwiYXBpIiwicGluZyIsImludm9rZSIsInNlbmRBdWRpb0ZvclRyYW5zY3JpcHRpb24iLCJhdWRpb0RhdGEiLCJleHBvc2VJbk1haW5Xb3JsZCJdLCJzb3VyY2VSb290IjoiIn0=
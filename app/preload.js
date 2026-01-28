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
  SET_RECORDING_STATE: 'recording:set-state',
  SET_ENRICHMENT_MODE: 'enrichment:set-mode',
  GET_ENRICHMENT_MODE: 'enrichment:get-mode',
  SET_LLM_PROVIDER: 'enrichment:set-provider'
};

// ============================================================================
// Whisper Types
// ============================================================================

/** Whisper transcription mode */

/** Result from transcription */

/** Raw result from whisper transcription (before enrichment) */

// ============================================================================
// Enrichment Types
// ============================================================================

/** LLM enrichment processing modes */

/** LLM provider options */

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
  setRecordingState: isRecording => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke(_shared_types__WEBPACK_IMPORTED_MODULE_1__.IPC_CHANNELS.SET_RECORDING_STATE, isRecording),
  setEnrichmentMode: mode => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke(_shared_types__WEBPACK_IMPORTED_MODULE_1__.IPC_CHANNELS.SET_ENRICHMENT_MODE, mode),
  getEnrichmentMode: () => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke(_shared_types__WEBPACK_IMPORTED_MODULE_1__.IPC_CHANNELS.GET_ENRICHMENT_MODE),
  setLLMProvider: (provider, apiKey) => electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke(_shared_types__WEBPACK_IMPORTED_MODULE_1__.IPC_CHANNELS.SET_LLM_PROVIDER, provider, apiKey)
};
electron__WEBPACK_IMPORTED_MODULE_0__.contextBridge.exposeInMainWorld('electronAPI', api);
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VyxDQUFDO0VBRXJFQyxpQkFBaUIsRUFBR1osSUFBb0IsSUFDcENQLGlEQUFXLENBQUNHLE1BQU0sQ0FBQ2hCLHVEQUFZLENBQUNTLG1CQUFtQixFQUFFVyxJQUFJLENBQUM7RUFFOURhLGlCQUFpQixFQUFFQSxDQUFBLEtBQ2ZwQixpREFBVyxDQUFDRyxNQUFNLENBQUNoQix1REFBWSxDQUFDVSxtQkFBbUIsQ0FBQztFQUV4RHdCLGNBQWMsRUFBRUEsQ0FBQ0MsUUFBcUIsRUFBRUMsTUFBYyxLQUNsRHZCLGlEQUFXLENBQUNHLE1BQU0sQ0FBQ2hCLHVEQUFZLENBQUNXLGdCQUFnQixFQUFFd0IsUUFBUSxFQUFFQyxNQUFNO0FBQzFFLENBQUM7QUFFRHhCLG1EQUFhLENBQUN5QixpQkFBaUIsQ0FBQyxhQUFhLEVBQUV2QixHQUFHLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3ZvaWNlLWludGVsbGlnZW5jZS1hcHAvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL3ZvaWNlLWludGVsbGlnZW5jZS1hcHAvLi9zaGFyZWQvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vdm9pY2UtaW50ZWxsaWdlbmNlLWFwcC9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly92b2ljZS1pbnRlbGxpZ2VuY2UtYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3ZvaWNlLWludGVsbGlnZW5jZS1hcHAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vdm9pY2UtaW50ZWxsaWdlbmNlLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdm9pY2UtaW50ZWxsaWdlbmNlLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3ZvaWNlLWludGVsbGlnZW5jZS1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92b2ljZS1pbnRlbGxpZ2VuY2UtYXBwLy4vbWFpbi9wcmVsb2FkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShnbG9iYWwsICgpID0+IHtcbnJldHVybiAiLCIvLyBWb2ljZSBJbnRlbGxpZ2VuY2UgQXBwIC0gU2hhcmVkIFR5cGVzXG4vLyBUaGlzIGZpbGUgY29udGFpbnMgVHlwZVNjcmlwdCB0eXBlcyBzaGFyZWQgYmV0d2VlbiBtYWluIGFuZCByZW5kZXJlciBwcm9jZXNzZXNcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSVBDIENoYW5uZWwgTmFtZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLyoqIElQQyBjaGFubmVsIG5hbWVzIGFzIGNvbnN0IGZvciB0eXBlIHNhZmV0eSAqL1xuZXhwb3J0IGNvbnN0IElQQ19DSEFOTkVMUyA9IHtcbiAgICBQSU5HOiAnYXBwOnBpbmcnLFxuICAgIFNFTkRfQVVESU86ICdhdWRpbzpzZW5kLWZvci10cmFuc2NyaXB0aW9uJyxcbiAgICBTRVRfV0hJU1BFUl9NT0RFOiAnd2hpc3BlcjpzZXQtbW9kZScsXG4gICAgU0VUX0FQSV9LRVk6ICdzZXR0aW5nczpzZXQtYXBpLWtleScsXG4gICAgR0VUX1dISVNQRVJfTU9ERTogJ3doaXNwZXI6Z2V0LW1vZGUnLFxuICAgIFRPR0dMRV9SRUNPUkRJTkc6ICdyZWNvcmRpbmc6dG9nZ2xlJyxcbiAgICBHRVRfUkVDT1JESU5HX1NUQVRFOiAncmVjb3JkaW5nOmdldC1zdGF0ZScsXG4gICAgU0VUX1JFQ09SRElOR19TVEFURTogJ3JlY29yZGluZzpzZXQtc3RhdGUnLFxuICAgIFNFVF9FTlJJQ0hNRU5UX01PREU6ICdlbnJpY2htZW50OnNldC1tb2RlJyxcbiAgICBHRVRfRU5SSUNITUVOVF9NT0RFOiAnZW5yaWNobWVudDpnZXQtbW9kZScsXG4gICAgU0VUX0xMTV9QUk9WSURFUjogJ2VucmljaG1lbnQ6c2V0LXByb3ZpZGVyJyxcbn0gYXMgY29uc3Q7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFdoaXNwZXIgVHlwZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLyoqIFdoaXNwZXIgdHJhbnNjcmlwdGlvbiBtb2RlICovXG5leHBvcnQgdHlwZSBXaGlzcGVyTW9kZSA9ICdsb2NhbCcgfCAnYXBpJztcblxuLyoqIFJlc3VsdCBmcm9tIHRyYW5zY3JpcHRpb24gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVHJhbnNjcmlwdGlvblJlc3VsdCB7XG4gICAgdGV4dDogc3RyaW5nO1xuICAgIGVucmljaGVkVGV4dDogc3RyaW5nO1xuICAgIHdhc0VucmljaGVkOiBib29sZWFuO1xuICAgIGR1cmF0aW9uOiBudW1iZXI7XG4gICAgbW9kZTogV2hpc3Blck1vZGU7XG59XG5cbi8qKiBSYXcgcmVzdWx0IGZyb20gd2hpc3BlciB0cmFuc2NyaXB0aW9uIChiZWZvcmUgZW5yaWNobWVudCkgKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmF3VHJhbnNjcmlwdGlvblJlc3VsdCB7XG4gICAgdGV4dDogc3RyaW5nO1xuICAgIGR1cmF0aW9uOiBudW1iZXI7XG4gICAgbW9kZTogV2hpc3Blck1vZGU7XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEVucmljaG1lbnQgVHlwZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLyoqIExMTSBlbnJpY2htZW50IHByb2Nlc3NpbmcgbW9kZXMgKi9cbmV4cG9ydCB0eXBlIEVucmljaG1lbnRNb2RlID0gJ2NsZWFuJyB8ICdmb3JtYXQnIHwgJ3N1bW1hcml6ZScgfCAnYWN0aW9uJyB8ICdlbWFpbCcgfCAnbm90ZXMnIHwgJ25vbmUnO1xuXG4vKiogTExNIHByb3ZpZGVyIG9wdGlvbnMgKi9cbmV4cG9ydCB0eXBlIExMTVByb3ZpZGVyID0gJ29wZW5haScgfCAnYW50aHJvcGljJztcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSVBDIEFQSSBJbnRlcmZhY2Vcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLyoqXG4gKiBBUEkgZXhwb3NlZCB0byByZW5kZXJlciB2aWEgY29udGV4dEJyaWRnZS5cbiAqIEFsbCBtZXRob2RzIHVzZSBpbnZva2UvaGFuZGxlIHBhdHRlcm4gKHJlcXVlc3QvcmVzcG9uc2UpLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVsZWN0cm9uQVBJIHtcbiAgICAvKipcbiAgICAgKiBUZXN0IElQQyBjb21tdW5pY2F0aW9uLlxuICAgICAqIEByZXR1cm5zIFByb21pc2UgcmVzb2x2aW5nIHRvICdwb25nJ1xuICAgICAqL1xuICAgIHBpbmc6ICgpID0+IFByb21pc2U8c3RyaW5nPjtcblxuICAgIC8qKlxuICAgICAqIFNlbmQgYXVkaW8gZGF0YSB0byBtYWluIHByb2Nlc3MgZm9yIHRyYW5zY3JpcHRpb24uXG4gICAgICogQHBhcmFtIGF1ZGlvRGF0YSAtIFdBViBhdWRpbyBhcyBBcnJheUJ1ZmZlciAoMTZrSHogbW9ubyAxNi1iaXQgUENNKVxuICAgICAqIEByZXR1cm5zIFByb21pc2UgcmVzb2x2aW5nIHdpdGggdHJhbnNjcmlwdGlvbiByZXN1bHRcbiAgICAgKi9cbiAgICBzZW5kQXVkaW9Gb3JUcmFuc2NyaXB0aW9uOiAoYXVkaW9EYXRhOiBBcnJheUJ1ZmZlcikgPT4gUHJvbWlzZTxUcmFuc2NyaXB0aW9uUmVzdWx0PjtcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgV2hpc3BlciB0cmFuc2NyaXB0aW9uIG1vZGUuXG4gICAgICogQHBhcmFtIG1vZGUgLSAnbG9jYWwnIGZvciB3aGlzcGVyLmNwcCBvciAnYXBpJyBmb3IgT3BlbkFJXG4gICAgICovXG4gICAgc2V0V2hpc3Blck1vZGU6IChtb2RlOiBXaGlzcGVyTW9kZSkgPT4gUHJvbWlzZTx2b2lkPjtcblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgY3VycmVudCBXaGlzcGVyIHRyYW5zY3JpcHRpb24gbW9kZS5cbiAgICAgKi9cbiAgICBnZXRXaGlzcGVyTW9kZTogKCkgPT4gUHJvbWlzZTxXaGlzcGVyTW9kZT47XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIE9wZW5BSSBBUEkga2V5IGZvciBBUEkgbW9kZS5cbiAgICAgKiBAcGFyYW0ga2V5IC0gT3BlbkFJIEFQSSBrZXlcbiAgICAgKi9cbiAgICBzZXRBcGlLZXk6IChrZXk6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcblxuICAgIC8qKlxuICAgICAqIExpc3RlbiBmb3IgcmVjb3JkaW5nIHRvZ2dsZSBldmVudHMgZnJvbSBnbG9iYWwgaG90a2V5LlxuICAgICAqIEBwYXJhbSBjYWxsYmFjayAtIEZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRvZ2dsZSBpcyB0cmlnZ2VyZWRcbiAgICAgKiBAcmV0dXJucyBDbGVhbnVwIGZ1bmN0aW9uIHRvIHJlbW92ZSBsaXN0ZW5lclxuICAgICAqL1xuICAgIG9uUmVjb3JkaW5nVG9nZ2xlOiAoY2FsbGJhY2s6ICgpID0+IHZvaWQpID0+ICgpID0+IHZvaWQ7XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGN1cnJlbnQgcmVjb3JkaW5nIHN0YXRlIGZyb20gbWFpbiBwcm9jZXNzLlxuICAgICAqL1xuICAgIGdldFJlY29yZGluZ1N0YXRlOiAoKSA9PiBQcm9taXNlPGJvb2xlYW4+O1xuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSByZWNvcmRpbmcgc3RhdGUgaW4gbWFpbiBwcm9jZXNzLlxuICAgICAqIEBwYXJhbSBpc1JlY29yZGluZyAtIFdoZXRoZXIgcmVjb3JkaW5nIGlzIGFjdGl2ZVxuICAgICAqL1xuICAgIHNldFJlY29yZGluZ1N0YXRlOiAoaXNSZWNvcmRpbmc6IGJvb2xlYW4pID0+IFByb21pc2U8dm9pZD47XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIExMTSBlbnJpY2htZW50IG1vZGUuXG4gICAgICovXG4gICAgc2V0RW5yaWNobWVudE1vZGU6IChtb2RlOiBFbnJpY2htZW50TW9kZSkgPT4gUHJvbWlzZTx2b2lkPjtcblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgY3VycmVudCBlbnJpY2htZW50IG1vZGUuXG4gICAgICovXG4gICAgZ2V0RW5yaWNobWVudE1vZGU6ICgpID0+IFByb21pc2U8RW5yaWNobWVudE1vZGU+O1xuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBMTE0gcHJvdmlkZXIgYW5kIEFQSSBrZXkuXG4gICAgICovXG4gICAgc2V0TExNUHJvdmlkZXI6IChwcm92aWRlcjogTExNUHJvdmlkZXIsIGFwaUtleTogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGNvbnRleHRCcmlkZ2UsIGlwY1JlbmRlcmVyIH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IHsgSVBDX0NIQU5ORUxTLCB0eXBlIEVsZWN0cm9uQVBJLCB0eXBlIFdoaXNwZXJNb2RlLCB0eXBlIEVucmljaG1lbnRNb2RlLCB0eXBlIExMTVByb3ZpZGVyIH0gZnJvbSAnLi4vc2hhcmVkL3R5cGVzJztcblxuLy8gU2VjdXJlIElQQyBicmlkZ2Vcbi8vIENSSVRJQ0FMOiBOZXZlciBleHBvc2UgcmF3IGlwY1JlbmRlcmVyIHRvIHRoZSByZW5kZXJlciBwcm9jZXNzXG4vLyBBbGwgSVBDIGNvbW11bmljYXRpb24gbXVzdCBnbyB0aHJvdWdoIGV4cGxpY2l0LCB0eXBlZCBBUEkgbWV0aG9kc1xuXG4vLyBJbXBsZW1lbnQgYWxsIEFQSSBtZXRob2RzIHdpdGggZXhwbGljaXQgY2hhbm5lbCBiaW5kaW5nXG5jb25zdCBhcGk6IEVsZWN0cm9uQVBJID0ge1xuICAgIHBpbmc6ICgpID0+IGlwY1JlbmRlcmVyLmludm9rZShJUENfQ0hBTk5FTFMuUElORyksXG5cbiAgICBzZW5kQXVkaW9Gb3JUcmFuc2NyaXB0aW9uOiAoYXVkaW9EYXRhOiBBcnJheUJ1ZmZlcikgPT5cbiAgICAgICAgaXBjUmVuZGVyZXIuaW52b2tlKElQQ19DSEFOTkVMUy5TRU5EX0FVRElPLCBhdWRpb0RhdGEpLFxuXG4gICAgc2V0V2hpc3Blck1vZGU6IChtb2RlOiBXaGlzcGVyTW9kZSkgPT5cbiAgICAgICAgaXBjUmVuZGVyZXIuaW52b2tlKElQQ19DSEFOTkVMUy5TRVRfV0hJU1BFUl9NT0RFLCBtb2RlKSxcblxuICAgIGdldFdoaXNwZXJNb2RlOiAoKSA9PlxuICAgICAgICBpcGNSZW5kZXJlci5pbnZva2UoSVBDX0NIQU5ORUxTLkdFVF9XSElTUEVSX01PREUpLFxuXG4gICAgc2V0QXBpS2V5OiAoa2V5OiBzdHJpbmcpID0+XG4gICAgICAgIGlwY1JlbmRlcmVyLmludm9rZShJUENfQ0hBTk5FTFMuU0VUX0FQSV9LRVksIGtleSksXG5cbiAgICBvblJlY29yZGluZ1RvZ2dsZTogKGNhbGxiYWNrOiAoKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSAoKSA9PiBjYWxsYmFjaygpO1xuICAgICAgICBpcGNSZW5kZXJlci5vbihJUENfQ0hBTk5FTFMuVE9HR0xFX1JFQ09SRElORywgaGFuZGxlcik7XG4gICAgICAgIC8vIFJldHVybiBjbGVhbnVwIGZ1bmN0aW9uXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBpcGNSZW5kZXJlci5yZW1vdmVMaXN0ZW5lcihJUENfQ0hBTk5FTFMuVE9HR0xFX1JFQ09SRElORywgaGFuZGxlcik7XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIGdldFJlY29yZGluZ1N0YXRlOiAoKSA9PlxuICAgICAgICBpcGNSZW5kZXJlci5pbnZva2UoSVBDX0NIQU5ORUxTLkdFVF9SRUNPUkRJTkdfU1RBVEUpLFxuXG4gICAgc2V0UmVjb3JkaW5nU3RhdGU6IChpc1JlY29yZGluZzogYm9vbGVhbikgPT5cbiAgICAgICAgaXBjUmVuZGVyZXIuaW52b2tlKElQQ19DSEFOTkVMUy5TRVRfUkVDT1JESU5HX1NUQVRFLCBpc1JlY29yZGluZyksXG5cbiAgICBzZXRFbnJpY2htZW50TW9kZTogKG1vZGU6IEVucmljaG1lbnRNb2RlKSA9PlxuICAgICAgICBpcGNSZW5kZXJlci5pbnZva2UoSVBDX0NIQU5ORUxTLlNFVF9FTlJJQ0hNRU5UX01PREUsIG1vZGUpLFxuXG4gICAgZ2V0RW5yaWNobWVudE1vZGU6ICgpID0+XG4gICAgICAgIGlwY1JlbmRlcmVyLmludm9rZShJUENfQ0hBTk5FTFMuR0VUX0VOUklDSE1FTlRfTU9ERSksXG5cbiAgICBzZXRMTE1Qcm92aWRlcjogKHByb3ZpZGVyOiBMTE1Qcm92aWRlciwgYXBpS2V5OiBzdHJpbmcpID0+XG4gICAgICAgIGlwY1JlbmRlcmVyLmludm9rZShJUENfQ0hBTk5FTFMuU0VUX0xMTV9QUk9WSURFUiwgcHJvdmlkZXIsIGFwaUtleSksXG59O1xuXG5jb250ZXh0QnJpZGdlLmV4cG9zZUluTWFpbldvcmxkKCdlbGVjdHJvbkFQSScsIGFwaSk7XG4iXSwibmFtZXMiOlsiSVBDX0NIQU5ORUxTIiwiUElORyIsIlNFTkRfQVVESU8iLCJTRVRfV0hJU1BFUl9NT0RFIiwiU0VUX0FQSV9LRVkiLCJHRVRfV0hJU1BFUl9NT0RFIiwiVE9HR0xFX1JFQ09SRElORyIsIkdFVF9SRUNPUkRJTkdfU1RBVEUiLCJTRVRfUkVDT1JESU5HX1NUQVRFIiwiU0VUX0VOUklDSE1FTlRfTU9ERSIsIkdFVF9FTlJJQ0hNRU5UX01PREUiLCJTRVRfTExNX1BST1ZJREVSIiwiY29udGV4dEJyaWRnZSIsImlwY1JlbmRlcmVyIiwiYXBpIiwicGluZyIsImludm9rZSIsInNlbmRBdWRpb0ZvclRyYW5zY3JpcHRpb24iLCJhdWRpb0RhdGEiLCJzZXRXaGlzcGVyTW9kZSIsIm1vZGUiLCJnZXRXaGlzcGVyTW9kZSIsInNldEFwaUtleSIsImtleSIsIm9uUmVjb3JkaW5nVG9nZ2xlIiwiY2FsbGJhY2siLCJoYW5kbGVyIiwib24iLCJyZW1vdmVMaXN0ZW5lciIsImdldFJlY29yZGluZ1N0YXRlIiwic2V0UmVjb3JkaW5nU3RhdGUiLCJpc1JlY29yZGluZyIsInNldEVucmljaG1lbnRNb2RlIiwiZ2V0RW5yaWNobWVudE1vZGUiLCJzZXRMTE1Qcm92aWRlciIsInByb3ZpZGVyIiwiYXBpS2V5IiwiZXhwb3NlSW5NYWluV29ybGQiXSwic291cmNlUm9vdCI6IiJ9
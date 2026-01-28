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

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

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
/*!****************************!*\
  !*** ./main/background.ts ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _shared_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/types */ "./shared/types.ts");



const isDev = !electron__WEBPACK_IMPORTED_MODULE_1__.app.isPackaged;
let mainWindow = null;

// ============================================================================
// IPC Handlers
// ============================================================================

function registerIpcHandlers() {
  electron__WEBPACK_IMPORTED_MODULE_1__.ipcMain.handle(_shared_types__WEBPACK_IMPORTED_MODULE_2__.IPC_CHANNELS.PING, async () => {
    return 'pong';
  });
  electron__WEBPACK_IMPORTED_MODULE_1__.ipcMain.handle(_shared_types__WEBPACK_IMPORTED_MODULE_2__.IPC_CHANNELS.SEND_AUDIO, async (_event, audioData) => {
    // Log audio receipt (Mission 4 will add transcription here)
    console.log(`Received audio: ${audioData.byteLength} bytes`);
  });
}

// ============================================================================
// Window Management
// ============================================================================

function createWindow() {
  mainWindow = new electron__WEBPACK_IMPORTED_MODULE_1__.BrowserWindow({
    width: 400,
    height: 600,
    resizable: true,
    center: true,
    title: 'Voice Intelligence',
    webPreferences: {
      preload: path__WEBPACK_IMPORTED_MODULE_0___default().join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  const url = isDev ? 'http://localhost:8888' : `file://${path__WEBPACK_IMPORTED_MODULE_0___default().join(__dirname, '../renderer/out/index.html')}`;
  mainWindow.loadURL(url);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools({
      mode: 'detach'
    });
  }
}

// ============================================================================
// App Lifecycle
// ============================================================================

electron__WEBPACK_IMPORTED_MODULE_1__.app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
});
electron__WEBPACK_IMPORTED_MODULE_1__.app.on('window-all-closed', () => {
  // On macOS, keep app in dock unless explicitly quit
  if (process.platform !== 'darwin') {
    electron__WEBPACK_IMPORTED_MODULE_1__.app.quit();
  }
});
electron__WEBPACK_IMPORTED_MODULE_1__.app.on('activate', () => {
  // On macOS, re-create window when dock icon clicked and no windows exist
  if (mainWindow === null) {
    createWindow();
  }
});
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7Ozs7Ozs7QUNWQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNPLE1BQU1BLFlBQVksR0FBRztFQUN4QkMsSUFBSSxFQUFFLFVBQVU7RUFDaEJDLFVBQVUsRUFBRTtFQUNaO0VBQ0E7RUFDQTtFQUNBO0FBQ0osQ0FBVTs7QUFFVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBZ0JBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSTs7Ozs7Ozs7OztBQ2pEQSxxQzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQSxFOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0QsRTs7Ozs7Ozs7Ozs7Ozs7OztBQ053QjtBQUMrQjtBQUNSO0FBRS9DLE1BQU1LLEtBQUssR0FBRyxDQUFDSCx5Q0FBRyxDQUFDSSxVQUFVO0FBRTdCLElBQUlDLFVBQWdDLEdBQUcsSUFBSTs7QUFFM0M7QUFDQTtBQUNBOztBQUVBLFNBQVNDLG1CQUFtQkEsQ0FBQSxFQUFTO0VBQ2pDSiw2Q0FBTyxDQUFDSyxNQUFNLENBQUNYLHVEQUFZLENBQUNDLElBQUksRUFBRSxZQUFZO0lBQzFDLE9BQU8sTUFBTTtFQUNqQixDQUFDLENBQUM7RUFFRkssNkNBQU8sQ0FBQ0ssTUFBTSxDQUFDWCx1REFBWSxDQUFDRSxVQUFVLEVBQUUsT0FBT1UsTUFBTSxFQUFFQyxTQUFzQixLQUFLO0lBQzlFO0lBQ0FDLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLG1CQUFtQkYsU0FBUyxDQUFDRyxVQUFVLFFBQVEsQ0FBQztFQUNoRSxDQUFDLENBQUM7QUFDTjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsU0FBU0MsWUFBWUEsQ0FBQSxFQUFTO0VBQzFCUixVQUFVLEdBQUcsSUFBSUosbURBQWEsQ0FBQztJQUMzQmEsS0FBSyxFQUFFLEdBQUc7SUFDVkMsTUFBTSxFQUFFLEdBQUc7SUFDWEMsU0FBUyxFQUFFLElBQUk7SUFDZkMsTUFBTSxFQUFFLElBQUk7SUFDWkMsS0FBSyxFQUFFLG9CQUFvQjtJQUMzQkMsY0FBYyxFQUFFO01BQ1pDLE9BQU8sRUFBRXJCLGdEQUFTLENBQUN1QixTQUFTLEVBQUUsWUFBWSxDQUFDO01BQzNDQyxnQkFBZ0IsRUFBRSxJQUFJO01BQ3RCQyxlQUFlLEVBQUU7SUFDckI7RUFDSixDQUFDLENBQUM7RUFFRixNQUFNQyxHQUFHLEdBQUd0QixLQUFLLEdBQ1gsdUJBQXVCLEdBQ3ZCLFVBQVVKLGdEQUFTLENBQUN1QixTQUFTLEVBQUUsNEJBQTRCLENBQUMsRUFBRTtFQUVwRWpCLFVBQVUsQ0FBQ3FCLE9BQU8sQ0FBQ0QsR0FBRyxDQUFDO0VBRXZCcEIsVUFBVSxDQUFDc0IsRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNO0lBQzFCdEIsVUFBVSxHQUFHLElBQUk7RUFDckIsQ0FBQyxDQUFDOztFQUVGO0VBQ0EsSUFBSUYsS0FBSyxFQUFFO0lBQ1BFLFVBQVUsQ0FBQ3VCLFdBQVcsQ0FBQ0MsWUFBWSxDQUFDO01BQUVDLElBQUksRUFBRTtJQUFTLENBQUMsQ0FBQztFQUMzRDtBQUNKOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTlCLHlDQUFHLENBQUMrQixTQUFTLENBQUMsQ0FBQyxDQUFDQyxJQUFJLENBQUMsTUFBTTtFQUN2QjFCLG1CQUFtQixDQUFDLENBQUM7RUFDckJPLFlBQVksQ0FBQyxDQUFDO0FBQ2xCLENBQUMsQ0FBQztBQUVGYix5Q0FBRyxDQUFDMkIsRUFBRSxDQUFDLG1CQUFtQixFQUFFLE1BQU07RUFDOUI7RUFDQSxJQUFJTSxPQUFPLENBQUNDLFFBQVEsS0FBSyxRQUFRLEVBQUU7SUFDL0JsQyx5Q0FBRyxDQUFDbUMsSUFBSSxDQUFDLENBQUM7RUFDZDtBQUNKLENBQUMsQ0FBQztBQUVGbkMseUNBQUcsQ0FBQzJCLEVBQUUsQ0FBQyxVQUFVLEVBQUUsTUFBTTtFQUNyQjtFQUNBLElBQUl0QixVQUFVLEtBQUssSUFBSSxFQUFFO0lBQ3JCUSxZQUFZLENBQUMsQ0FBQztFQUNsQjtBQUNKLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdm9pY2UtaW50ZWxsaWdlbmNlLWFwcC93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vdm9pY2UtaW50ZWxsaWdlbmNlLWFwcC8uL3NoYXJlZC90eXBlcy50cyIsIndlYnBhY2s6Ly92b2ljZS1pbnRlbGxpZ2VuY2UtYXBwL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJlbGVjdHJvblwiIiwid2VicGFjazovL3ZvaWNlLWludGVsbGlnZW5jZS1hcHAvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInBhdGhcIiIsIndlYnBhY2s6Ly92b2ljZS1pbnRlbGxpZ2VuY2UtYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3ZvaWNlLWludGVsbGlnZW5jZS1hcHAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vdm9pY2UtaW50ZWxsaWdlbmNlLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdm9pY2UtaW50ZWxsaWdlbmNlLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3ZvaWNlLWludGVsbGlnZW5jZS1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92b2ljZS1pbnRlbGxpZ2VuY2UtYXBwLy4vbWFpbi9iYWNrZ3JvdW5kLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShnbG9iYWwsICgpID0+IHtcbnJldHVybiAiLCIvLyBWb2ljZSBJbnRlbGxpZ2VuY2UgQXBwIC0gU2hhcmVkIFR5cGVzXG4vLyBUaGlzIGZpbGUgY29udGFpbnMgVHlwZVNjcmlwdCB0eXBlcyBzaGFyZWQgYmV0d2VlbiBtYWluIGFuZCByZW5kZXJlciBwcm9jZXNzZXNcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSVBDIENoYW5uZWwgTmFtZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLyoqIElQQyBjaGFubmVsIG5hbWVzIGFzIGNvbnN0IGZvciB0eXBlIHNhZmV0eSAqL1xuZXhwb3J0IGNvbnN0IElQQ19DSEFOTkVMUyA9IHtcbiAgICBQSU5HOiAnYXBwOnBpbmcnLFxuICAgIFNFTkRfQVVESU86ICdhdWRpbzpzZW5kLWZvci10cmFuc2NyaXB0aW9uJyxcbiAgICAvLyBGdXR1cmUgY2hhbm5lbHMgKE1pc3Npb24gNCspOlxuICAgIC8vIFdISVNQRVJfVFJBTlNDUklCRTogJ3doaXNwZXI6dHJhbnNjcmliZScsXG4gICAgLy8gU0VUVElOR1NfR0VUOiAnc2V0dGluZ3M6Z2V0JyxcbiAgICAvLyBTRVRUSU5HU19TRVQ6ICdzZXR0aW5nczpzZXQnLFxufSBhcyBjb25zdDtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSVBDIEFQSSBJbnRlcmZhY2Vcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLyoqXG4gKiBBUEkgZXhwb3NlZCB0byByZW5kZXJlciB2aWEgY29udGV4dEJyaWRnZS5cbiAqIEFsbCBtZXRob2RzIHVzZSBpbnZva2UvaGFuZGxlIHBhdHRlcm4gKHJlcXVlc3QvcmVzcG9uc2UpLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVsZWN0cm9uQVBJIHtcbiAgICAvKipcbiAgICAgKiBUZXN0IElQQyBjb21tdW5pY2F0aW9uLlxuICAgICAqIEByZXR1cm5zIFByb21pc2UgcmVzb2x2aW5nIHRvICdwb25nJ1xuICAgICAqL1xuICAgIHBpbmc6ICgpID0+IFByb21pc2U8c3RyaW5nPjtcblxuICAgIC8qKlxuICAgICAqIFNlbmQgYXVkaW8gZGF0YSB0byBtYWluIHByb2Nlc3MgZm9yIHRyYW5zY3JpcHRpb24uXG4gICAgICogQHBhcmFtIGF1ZGlvRGF0YSAtIFdBViBhdWRpbyBhcyBBcnJheUJ1ZmZlciAoMTZrSHogbW9ubyAxNi1iaXQgUENNKVxuICAgICAqIEByZXR1cm5zIFByb21pc2UgcmVzb2x2aW5nIHdoZW4gYXVkaW8gaXMgcmVjZWl2ZWRcbiAgICAgKi9cbiAgICBzZW5kQXVkaW9Gb3JUcmFuc2NyaXB0aW9uOiAoYXVkaW9EYXRhOiBBcnJheUJ1ZmZlcikgPT4gUHJvbWlzZTx2b2lkPjtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRG9tYWluIFR5cGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIEZ1dHVyZSB0eXBlcyBmb3IgTWlzc2lvbiA0Kzpcbi8vIGV4cG9ydCBpbnRlcmZhY2UgVHJhbnNjcmlwdGlvblJlc3VsdCB7XG4vLyAgIHRleHQ6IHN0cmluZztcbi8vICAgY29uZmlkZW5jZTogbnVtYmVyO1xuLy8gICBzZWdtZW50cz86IFRyYW5zY3JpcHRpb25TZWdtZW50W107XG4vLyB9XG5cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgYXBwLCBCcm93c2VyV2luZG93LCBpcGNNYWluIH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IHsgSVBDX0NIQU5ORUxTIH0gZnJvbSAnLi4vc2hhcmVkL3R5cGVzJztcblxuY29uc3QgaXNEZXYgPSAhYXBwLmlzUGFja2FnZWQ7XG5cbmxldCBtYWluV2luZG93OiBCcm93c2VyV2luZG93IHwgbnVsbCA9IG51bGw7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIElQQyBIYW5kbGVyc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiByZWdpc3RlcklwY0hhbmRsZXJzKCk6IHZvaWQge1xuICAgIGlwY01haW4uaGFuZGxlKElQQ19DSEFOTkVMUy5QSU5HLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIHJldHVybiAncG9uZyc7XG4gICAgfSk7XG5cbiAgICBpcGNNYWluLmhhbmRsZShJUENfQ0hBTk5FTFMuU0VORF9BVURJTywgYXN5bmMgKF9ldmVudCwgYXVkaW9EYXRhOiBBcnJheUJ1ZmZlcikgPT4ge1xuICAgICAgICAvLyBMb2cgYXVkaW8gcmVjZWlwdCAoTWlzc2lvbiA0IHdpbGwgYWRkIHRyYW5zY3JpcHRpb24gaGVyZSlcbiAgICAgICAgY29uc29sZS5sb2coYFJlY2VpdmVkIGF1ZGlvOiAke2F1ZGlvRGF0YS5ieXRlTGVuZ3RofSBieXRlc2ApO1xuICAgIH0pO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBXaW5kb3cgTWFuYWdlbWVudFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBjcmVhdGVXaW5kb3coKTogdm9pZCB7XG4gICAgbWFpbldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcbiAgICAgICAgd2lkdGg6IDQwMCxcbiAgICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZSxcbiAgICAgICAgY2VudGVyOiB0cnVlLFxuICAgICAgICB0aXRsZTogJ1ZvaWNlIEludGVsbGlnZW5jZScsXG4gICAgICAgIHdlYlByZWZlcmVuY2VzOiB7XG4gICAgICAgICAgICBwcmVsb2FkOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAncHJlbG9hZC5qcycpLFxuICAgICAgICAgICAgY29udGV4dElzb2xhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIG5vZGVJbnRlZ3JhdGlvbjogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCB1cmwgPSBpc0RldlxuICAgICAgICA/ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgnXG4gICAgICAgIDogYGZpbGU6Ly8ke3BhdGguam9pbihfX2Rpcm5hbWUsICcuLi9yZW5kZXJlci9vdXQvaW5kZXguaHRtbCcpfWA7XG5cbiAgICBtYWluV2luZG93LmxvYWRVUkwodXJsKTtcblxuICAgIG1haW5XaW5kb3cub24oJ2Nsb3NlZCcsICgpID0+IHtcbiAgICAgICAgbWFpbldpbmRvdyA9IG51bGw7XG4gICAgfSk7XG5cbiAgICAvLyBPcGVuIERldlRvb2xzIGluIGRldmVsb3BtZW50XG4gICAgaWYgKGlzRGV2KSB7XG4gICAgICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMub3BlbkRldlRvb2xzKHsgbW9kZTogJ2RldGFjaCcgfSk7XG4gICAgfVxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBBcHAgTGlmZWN5Y2xlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmFwcC53aGVuUmVhZHkoKS50aGVuKCgpID0+IHtcbiAgICByZWdpc3RlcklwY0hhbmRsZXJzKCk7XG4gICAgY3JlYXRlV2luZG93KCk7XG59KTtcblxuYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsICgpID0+IHtcbiAgICAvLyBPbiBtYWNPUywga2VlcCBhcHAgaW4gZG9jayB1bmxlc3MgZXhwbGljaXRseSBxdWl0XG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG4gICAgICAgIGFwcC5xdWl0KCk7XG4gICAgfVxufSk7XG5cbmFwcC5vbignYWN0aXZhdGUnLCAoKSA9PiB7XG4gICAgLy8gT24gbWFjT1MsIHJlLWNyZWF0ZSB3aW5kb3cgd2hlbiBkb2NrIGljb24gY2xpY2tlZCBhbmQgbm8gd2luZG93cyBleGlzdFxuICAgIGlmIChtYWluV2luZG93ID09PSBudWxsKSB7XG4gICAgICAgIGNyZWF0ZVdpbmRvdygpO1xuICAgIH1cbn0pO1xuIl0sIm5hbWVzIjpbIklQQ19DSEFOTkVMUyIsIlBJTkciLCJTRU5EX0FVRElPIiwicGF0aCIsImFwcCIsIkJyb3dzZXJXaW5kb3ciLCJpcGNNYWluIiwiaXNEZXYiLCJpc1BhY2thZ2VkIiwibWFpbldpbmRvdyIsInJlZ2lzdGVySXBjSGFuZGxlcnMiLCJoYW5kbGUiLCJfZXZlbnQiLCJhdWRpb0RhdGEiLCJjb25zb2xlIiwibG9nIiwiYnl0ZUxlbmd0aCIsImNyZWF0ZVdpbmRvdyIsIndpZHRoIiwiaGVpZ2h0IiwicmVzaXphYmxlIiwiY2VudGVyIiwidGl0bGUiLCJ3ZWJQcmVmZXJlbmNlcyIsInByZWxvYWQiLCJqb2luIiwiX19kaXJuYW1lIiwiY29udGV4dElzb2xhdGlvbiIsIm5vZGVJbnRlZ3JhdGlvbiIsInVybCIsImxvYWRVUkwiLCJvbiIsIndlYkNvbnRlbnRzIiwib3BlbkRldlRvb2xzIiwibW9kZSIsIndoZW5SZWFkeSIsInRoZW4iLCJwcm9jZXNzIiwicGxhdGZvcm0iLCJxdWl0Il0sInNvdXJjZVJvb3QiOiIifQ==
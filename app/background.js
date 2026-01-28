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
  PING: 'app:ping'
  // Future channels (Mission 3+):
  // AUDIO_START: 'audio:start-recording',
  // AUDIO_STOP: 'audio:stop-recording',
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
// Domain Types (placeholder for future missions)
// ============================================================================

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
    console.log('Ping received'); // Debug log - remove after verification
    return 'pong';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0MsUUFBUSxLQUFLLFFBQVEsRUFBRTtJQUMvQi9CLHlDQUFHLENBQUNnQyxJQUFJLENBQUMsQ0FBQztFQUNkO0FBQ0osQ0FBQyxDQUFDO0FBRUZoQyx5Q0FBRyxDQUFDd0IsRUFBRSxDQUFDLFVBQVUsRUFBRSxNQUFNO0VBQ3JCO0VBQ0EsSUFBSW5CLFVBQVUsS0FBSyxJQUFJLEVBQUU7SUFDckJLLFlBQVksQ0FBQyxDQUFDO0VBQ2xCO0FBQ0osQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92b2ljZS1pbnRlbGxpZ2VuY2UtYXBwL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly92b2ljZS1pbnRlbGxpZ2VuY2UtYXBwLy4vc2hhcmVkL3R5cGVzLnRzIiwid2VicGFjazovL3ZvaWNlLWludGVsbGlnZW5jZS1hcHAvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImVsZWN0cm9uXCIiLCJ3ZWJwYWNrOi8vdm9pY2UtaW50ZWxsaWdlbmNlLWFwcC9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwicGF0aFwiIiwid2VicGFjazovL3ZvaWNlLWludGVsbGlnZW5jZS1hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdm9pY2UtaW50ZWxsaWdlbmNlLWFwcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly92b2ljZS1pbnRlbGxpZ2VuY2UtYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly92b2ljZS1pbnRlbGxpZ2VuY2UtYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdm9pY2UtaW50ZWxsaWdlbmNlLWFwcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3ZvaWNlLWludGVsbGlnZW5jZS1hcHAvLi9tYWluL2JhY2tncm91bmQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKGdsb2JhbCwgKCkgPT4ge1xucmV0dXJuICIsIi8vIFZvaWNlIEludGVsbGlnZW5jZSBBcHAgLSBTaGFyZWQgVHlwZXNcbi8vIFRoaXMgZmlsZSBjb250YWlucyBUeXBlU2NyaXB0IHR5cGVzIHNoYXJlZCBiZXR3ZWVuIG1haW4gYW5kIHJlbmRlcmVyIHByb2Nlc3Nlc1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBJUEMgQ2hhbm5lbCBOYW1lc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKiogSVBDIGNoYW5uZWwgbmFtZXMgYXMgY29uc3QgZm9yIHR5cGUgc2FmZXR5ICovXG5leHBvcnQgY29uc3QgSVBDX0NIQU5ORUxTID0ge1xuICAgIFBJTkc6ICdhcHA6cGluZycsXG4gICAgLy8gRnV0dXJlIGNoYW5uZWxzIChNaXNzaW9uIDMrKTpcbiAgICAvLyBBVURJT19TVEFSVDogJ2F1ZGlvOnN0YXJ0LXJlY29yZGluZycsXG4gICAgLy8gQVVESU9fU1RPUDogJ2F1ZGlvOnN0b3AtcmVjb3JkaW5nJyxcbiAgICAvLyBXSElTUEVSX1RSQU5TQ1JJQkU6ICd3aGlzcGVyOnRyYW5zY3JpYmUnLFxuICAgIC8vIFNFVFRJTkdTX0dFVDogJ3NldHRpbmdzOmdldCcsXG4gICAgLy8gU0VUVElOR1NfU0VUOiAnc2V0dGluZ3M6c2V0Jyxcbn0gYXMgY29uc3Q7XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIElQQyBBUEkgSW50ZXJmYWNlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogQVBJIGV4cG9zZWQgdG8gcmVuZGVyZXIgdmlhIGNvbnRleHRCcmlkZ2UuXG4gKiBBbGwgbWV0aG9kcyB1c2UgaW52b2tlL2hhbmRsZSBwYXR0ZXJuIChyZXF1ZXN0L3Jlc3BvbnNlKS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbGVjdHJvbkFQSSB7XG4gICAgLyoqXG4gICAgICogVGVzdCBJUEMgY29tbXVuaWNhdGlvbi5cbiAgICAgKiBAcmV0dXJucyBQcm9taXNlIHJlc29sdmluZyB0byAncG9uZydcbiAgICAgKi9cbiAgICBwaW5nOiAoKSA9PiBQcm9taXNlPHN0cmluZz47XG5cbiAgICAvLyBGdXR1cmUgbWV0aG9kcyAoTWlzc2lvbiAzKyk6XG4gICAgLy8gc3RhcnRSZWNvcmRpbmc6ICgpID0+IFByb21pc2U8dm9pZD47XG4gICAgLy8gc3RvcFJlY29yZGluZzogKCkgPT4gUHJvbWlzZTxBdWRpb0J1ZmZlcj47XG4gICAgLy8gdHJhbnNjcmliZTogKGF1ZGlvOiBBcnJheUJ1ZmZlcikgPT4gUHJvbWlzZTxUcmFuc2NyaXB0aW9uUmVzdWx0Pjtcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRG9tYWluIFR5cGVzIChwbGFjZWhvbGRlciBmb3IgZnV0dXJlIG1pc3Npb25zKVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBleHBvcnQgaW50ZXJmYWNlIFRyYW5zY3JpcHRpb25SZXN1bHQge1xuLy8gICB0ZXh0OiBzdHJpbmc7XG4vLyAgIGNvbmZpZGVuY2U6IG51bWJlcjtcbi8vICAgc2VnbWVudHM/OiBUcmFuc2NyaXB0aW9uU2VnbWVudFtdO1xuLy8gfVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBhcHAsIEJyb3dzZXJXaW5kb3csIGlwY01haW4gfSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgeyBJUENfQ0hBTk5FTFMgfSBmcm9tICcuLi9zaGFyZWQvdHlwZXMnO1xuXG5jb25zdCBpc0RldiA9ICFhcHAuaXNQYWNrYWdlZDtcblxubGV0IG1haW5XaW5kb3c6IEJyb3dzZXJXaW5kb3cgfCBudWxsID0gbnVsbDtcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSVBDIEhhbmRsZXJzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIHJlZ2lzdGVySXBjSGFuZGxlcnMoKTogdm9pZCB7XG4gICAgaXBjTWFpbi5oYW5kbGUoSVBDX0NIQU5ORUxTLlBJTkcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ1BpbmcgcmVjZWl2ZWQnKTsgLy8gRGVidWcgbG9nIC0gcmVtb3ZlIGFmdGVyIHZlcmlmaWNhdGlvblxuICAgICAgICByZXR1cm4gJ3BvbmcnO1xuICAgIH0pO1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBXaW5kb3cgTWFuYWdlbWVudFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBjcmVhdGVXaW5kb3coKTogdm9pZCB7XG4gICAgbWFpbldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcbiAgICAgICAgd2lkdGg6IDQwMCxcbiAgICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICAgIHJlc2l6YWJsZTogdHJ1ZSxcbiAgICAgICAgY2VudGVyOiB0cnVlLFxuICAgICAgICB0aXRsZTogJ1ZvaWNlIEludGVsbGlnZW5jZScsXG4gICAgICAgIHdlYlByZWZlcmVuY2VzOiB7XG4gICAgICAgICAgICBwcmVsb2FkOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAncHJlbG9hZC5qcycpLFxuICAgICAgICAgICAgY29udGV4dElzb2xhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIG5vZGVJbnRlZ3JhdGlvbjogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCB1cmwgPSBpc0RldlxuICAgICAgICA/ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgnXG4gICAgICAgIDogYGZpbGU6Ly8ke3BhdGguam9pbihfX2Rpcm5hbWUsICcuLi9yZW5kZXJlci9vdXQvaW5kZXguaHRtbCcpfWA7XG5cbiAgICBtYWluV2luZG93LmxvYWRVUkwodXJsKTtcblxuICAgIG1haW5XaW5kb3cub24oJ2Nsb3NlZCcsICgpID0+IHtcbiAgICAgICAgbWFpbldpbmRvdyA9IG51bGw7XG4gICAgfSk7XG5cbiAgICAvLyBPcGVuIERldlRvb2xzIGluIGRldmVsb3BtZW50XG4gICAgaWYgKGlzRGV2KSB7XG4gICAgICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMub3BlbkRldlRvb2xzKHsgbW9kZTogJ2RldGFjaCcgfSk7XG4gICAgfVxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBBcHAgTGlmZWN5Y2xlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmFwcC53aGVuUmVhZHkoKS50aGVuKCgpID0+IHtcbiAgICByZWdpc3RlcklwY0hhbmRsZXJzKCk7XG4gICAgY3JlYXRlV2luZG93KCk7XG59KTtcblxuYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsICgpID0+IHtcbiAgICAvLyBPbiBtYWNPUywga2VlcCBhcHAgaW4gZG9jayB1bmxlc3MgZXhwbGljaXRseSBxdWl0XG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG4gICAgICAgIGFwcC5xdWl0KCk7XG4gICAgfVxufSk7XG5cbmFwcC5vbignYWN0aXZhdGUnLCAoKSA9PiB7XG4gICAgLy8gT24gbWFjT1MsIHJlLWNyZWF0ZSB3aW5kb3cgd2hlbiBkb2NrIGljb24gY2xpY2tlZCBhbmQgbm8gd2luZG93cyBleGlzdFxuICAgIGlmIChtYWluV2luZG93ID09PSBudWxsKSB7XG4gICAgICAgIGNyZWF0ZVdpbmRvdygpO1xuICAgIH1cbn0pO1xuIl0sIm5hbWVzIjpbIklQQ19DSEFOTkVMUyIsIlBJTkciLCJwYXRoIiwiYXBwIiwiQnJvd3NlcldpbmRvdyIsImlwY01haW4iLCJpc0RldiIsImlzUGFja2FnZWQiLCJtYWluV2luZG93IiwicmVnaXN0ZXJJcGNIYW5kbGVycyIsImhhbmRsZSIsImNvbnNvbGUiLCJsb2ciLCJjcmVhdGVXaW5kb3ciLCJ3aWR0aCIsImhlaWdodCIsInJlc2l6YWJsZSIsImNlbnRlciIsInRpdGxlIiwid2ViUHJlZmVyZW5jZXMiLCJwcmVsb2FkIiwiam9pbiIsIl9fZGlybmFtZSIsImNvbnRleHRJc29sYXRpb24iLCJub2RlSW50ZWdyYXRpb24iLCJ1cmwiLCJsb2FkVVJMIiwib24iLCJ3ZWJDb250ZW50cyIsIm9wZW5EZXZUb29scyIsIm1vZGUiLCJ3aGVuUmVhZHkiLCJ0aGVuIiwicHJvY2VzcyIsInBsYXRmb3JtIiwicXVpdCJdLCJzb3VyY2VSb290IjoiIn0=
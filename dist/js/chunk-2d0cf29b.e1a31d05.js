(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0cf29b"],{6319:function(e,n,t){"use strict";t.r(n),t.d(n,"default",(function(){return a}));t("caad"),t("277d"),t("13d5"),t("b0c0"),t("a9e3"),t("b64b"),t("2532");var u=t("6116"),r={string:"AInput",number:"AInputNumber",boolean:"ASwitch",array:"InputJson",object:"InputJson"};function a(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return Object.keys(e).reduce((function(t,u){return n.hasOwnProperty(u)?n[u]&&t.push(n[u]):t.push(f(u,e[u])),t}),[])}function i(e){var n=e.name,t=e.valueType,u=e.defaultValue,a=r[t.toLowerCase()];if(!a)return{name:n,exprOnly:!0};var i={name:n,component:a};return void 0!==u&&(i.initialValue=u),i}function o(e,n){if(!n||"function"!==n.toLowerCase())return"function"===typeof e["default"]?e["default"]():e["default"]}function c(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return e.includes(String)&&e.includes(Number)?String.name:e[0].name}function f(e,n){if("function"===typeof n&&Object(u["l"])(n))return i({name:e,valueType:n.name});if("object"===Object(u["r"])(n)){var t=void 0,r=void 0,a=n.hasOwnProperty("default");if(Array.isArray(n.type))a?n.type.includes(Function)?r=Function.name:(t=o(n),r=Object(u["r"])(t)):r=c(n.type);else{if(!n.type)return f(e,n["default"]);r=n.type.name,t=o(n,r)}return i({name:e,valueType:r,defaultValue:t})}return Array.isArray(n)?i({name:e,valueType:c(n)}):i({name:e,valueType:Object(u["r"])(n),defaultValue:n})}}}]);
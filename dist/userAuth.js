! function (e, o) {
	"object" == typeof exports && "object" == typeof module ? module.exports = o() : "function" == typeof define && define.amd ? define("userAuth", [], o) : "object" == typeof exports ? exports.userAuth = o() : e.userAuth = o()
}(window, (function () {
	return function (e) {
		var o = {};

		function t(n) {
			if (o[n]) return o[n].exports;
			var r = o[n] = {
				i: n,
				l: !1,
				exports: {}
			};
			return e[n].call(r.exports, r, r.exports, t), r.l = !0, r.exports
		}
		return t.m = e, t.c = o, t.d = function (e, o, n) {
			t.o(e, o) || Object.defineProperty(e, o, {
				enumerable: !0,
				get: n
			})
		}, t.r = function (e) {
			"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
				value: "Module"
			}), Object.defineProperty(e, "__esModule", {
				value: !0
			})
		}, t.t = function (e, o) {
			if (1 & o && (e = t(e)), 8 & o) return e;
			if (4 & o && "object" == typeof e && e && e.__esModule) return e;
			var n = Object.create(null);
			if (t.r(n), Object.defineProperty(n, "default", {
					enumerable: !0,
					value: e
				}), 2 & o && "string" != typeof e)
				for (var r in e) t.d(n, r, function (o) {
					return e[o]
				}.bind(null, r));
			return n
		}, t.n = function (e) {
			var o = e && e.__esModule ? function () {
				return e.default
			} : function () {
				return e
			};
			return t.d(o, "a", o), o
		}, t.o = function (e, o) {
			return Object.prototype.hasOwnProperty.call(e, o)
		}, t.p = "", t(t.s = 0)
	}([function (e, o, t) {
		function n(e, o, t, n, l, i) {
			window.yl.call("getAuthcode", {}, {
				onSuccess: n => {
					const c = `${t}/unite/${o.itemNo}/${n.param.authCode}?srcCode=${o.channelCode}&applicationId=${o.applicationId}&kg=1`;
					i ? e.ajax({
						url: c,
						type: "post",
						xhrFields: {
							withCredentials: !0
						},
						data: o,
						crossDomain: !0,
						success: function (e) {
							r(e, null)
						}
					}) : e.post(c, o).then(e => {
						console.log("userAuth res", e), r(e, l)
					})
				},
				onFail: e => {
					console.log("获取authCode失败"), l()
				}
			})
		}

		function r(e, o) {
			"0" === e.errorCode.toString() ? callback(o) : "10001" === e.errorCode.toString() ? window.yl.call("getAuthcode", {}, {
				onSuccess: function (e) {
					window.yl.call("closeWebview")
				},
				onFail: function (e) {
					window.yl.call("closeWebview")
				}
			}) : "10002" === e.errorCode.toString() ? window.yl.call("requireAuth", {}, {
				onSuccess: function (e) {
					window.yl.call("closeWebview")
				},
				onFail: function (e) {
					window.yl.call("closeWebview")
				}
			}) : "10003" === e.errorCode.toString() ? window.yl.call("faceDetection", {}, {
				onSuccess: function (e) {
					window.yl.call("closeWebview")
				},
				onFail: function (e) {
					window.yl.call("closeWebview")
				}
			}) : o ? o({
				path: "/submitFail",
				query: {
					errorMsg: res.value
				}
			}) : console.log("用户权限，暂时没处理失败")
		}
		o.appAuth = (e, o, t, r, l, i, c) => {
			! function (e, o, t, n, r, l, i, c) {
				const u = `${t}/unite/${o.itemNo}?srcCode=${o.channelCode}&applicationId=${o.applicationId}&kg=1`;
				c ? e.ajax({
					url: u,
					type: "post",
					xhrFields: {
						withCredentials: !0
					},
					data: o,
					crossDomain: !0,
					success: function (l) {
						"0" === l.errorCode.toString() ? "0" === l.data.flag && "1" === l.data.loginFlag && n(e, o, t, r, i, c) : console.log("事项权限，暂时没处理失败")
					}
				}) : e.post(u, o).then(c => {
					console.log("itemAuth res", c), "0" === c.errorCode.toString() ? "0" === c.data.flag && "1" === c.data.loginFlag ? n(e, o, t, r, i) : i() : i({
						path: l,
						query: {
							errorMsg: c.value
						}
					})
				})
			}(o, e, l, n, t, r, i, c)
		}, o.h5Auth = () => {}
	}])
}));
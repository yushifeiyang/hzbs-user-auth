/*
内容:权限文件
作用:为了统一代码,将这个文件发包到npm,供其他项目使用
*/
// 在app里验证权限
 const appAuth = (urlParams, axios, callback, errorPage, domain, next, isJQuery) => {
	// 获取事项权限
	getItemInfo(axios, urlParams, domain, vertifyUserAuth, callback, errorPage, next, isJQuery);
}

// 非app验证权限
const h5Auth = () => {}

// 获取事项权限
function getItemInfo(axios, urlParams, domain, callback, topCallback, errorPage, next, isJQuery) {
	const url = `${domain}/unite/${urlParams.itemNo}?srcCode=${urlParams.channelCode}&applicationId=${urlParams.applicationId}&kg=1`;
	// 异常统一在axios里处理,这里不做处理
	if (isJQuery) {
		axios.ajax({
			url: url,
			type: 'post',
			xhrFields: {
				withCredentials: true
			},
			data: urlParams,
			crossDomain: true,
			success: function (itemAuth) {
				if (itemAuth.errorCode.toString() === '0') {
					if (itemAuth.data.flag === '0') { // 状态有效
						if (itemAuth.data.loginFlag === '1') { // {1:需要登入，0：不需要}
							callback(axios, urlParams, domain, topCallback, next, isJQuery);
						}
					}
				} else {
					console.log('事项权限，暂时没处理失败');
				}
			}
		});
	} else {
		axios.post(url, urlParams).then(itemAuth => {
			console.log('itemAuth res', itemAuth);
			if (itemAuth.errorCode.toString() === '0') {
				if (itemAuth.data.flag === '0') { // 状态有效
					if (itemAuth.data.loginFlag === '1') { // {1:需要登入，0：不需要}
						callback(axios, urlParams, domain, topCallback, next);
					} else { // 游客登入
						next()
					}
				} else {
					next()
				}
			} else {
				next({
					path: errorPage,
					query: {
						errorMsg: itemAuth.value
					}
				})
			}
		});
	}
}
// 获取用户权限
function vertifyUserAuth(axios, urlParams, domain, callback, next, isJQuery) {
	if (process.env.NODE_ENV === 'development') {
		const url = `${domain}/unite/${urlParams.itemNo}/11111111?srcCode=${urlParams.channelCode}&applicationId=${urlParams.applicationId}&kg=1`;
		axios.post(url, urlParams).then(userAuth => {
			console.log('userAuth res', userAuth);
			userAuthHanddle(userAuth, callback, next);
		})
	} else {
		window.yl.call('getAuthcode', {}, {
			onSuccess: (res) => {
				const url = `${domain}/unite/${urlParams.itemNo}/${res.param.authCode}?srcCode=${urlParams.channelCode}&applicationId=${urlParams.applicationId}&kg=1`;
				// 异常统一在axios里处理,这里不做处理
				if (isJQuery) {
					axios.ajax({
						url: url,
						type: 'post',
						xhrFields: {
							withCredentials: true
						},
						data: urlParams,
						crossDomain: true,
						success: function (userAuth) {
							userAuthHanddle(userAuth, callback, null);
						}
					});
				} else {
					axios.post(url, urlParams).then(userAuth => {
						console.log('userAuth res', userAuth);
						userAuthHanddle(userAuth, callback, next);
					});
				}
			},
			onFail: (e) => {
				console.log('获取authCode失败');
				next();
			}
		});
	}
}

function userAuthHanddle(userAuth, callback, next) {
	console.log('userAuthHanddle');
	if (userAuth.errorCode.toString() === '0') {
		callback(next);
	} else if (userAuth.errorCode.toString() === '10001') {
		// // 需先登录
		window.yl.call('getAuthcode', {}, {
			onSuccess: function (e) {
				window.yl.call('closeWebview')
			},
			onFail: function (e) {
				window.yl.call('closeWebview')
			}
		})
	} else if (userAuth.errorCode.toString() === '10002') {
		// 需先实名登记
		window.yl.call('requireAuth', {}, {
			onSuccess: function (e) {
				window.yl.call('closeWebview')
			},
			onFail: function (e) {
				window.yl.call('closeWebview')
			}
		})
	} else if (userAuth.errorCode.toString() === '10003') {
		window.yl.call('faceDetection', {}, {
			onSuccess: function (e) {
				window.yl.call('closeWebview')
			},
			onFail: function (e) {
				window.yl.call('closeWebview')
			}
		})
	} else {
		if (next) {
			next({
				path: '/submitFail',
				query: {
					errorMsg: userAuth.value
				}
			})
		} else {
			console.log('用户权限，暂时没处理失败');
		}
	}
}

exports.appAuth = appAuth;
exports.h5Auth = h5Auth;
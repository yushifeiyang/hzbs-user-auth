/*
内容:权限文件
作用:为了统一代码,将这个文件发包到npm,供其他项目使用
*/
 const appAuth = (urlParams, axios, callback, errorPage, domain, next) => {
	// 获取事项权限
	getItemInfo(axios, urlParams, domain, vertifyUserAuth, callback, errorPage, next);
}

// 获取事项权限
function getItemInfo(axios, urlParams, domain, callback, topCallback, errorPage, next) {
	const url = `${domain}/unite/${urlParams.itemNo}?srcCode=${urlParams.channelCode || 'hzeg'}&applicationId=${urlParams.applicationId || ''}&kg=1`;
	// 异常统一在axios里处理,这里不做处理
	axios.post(url, urlParams).then(itemAuth => {
		console.log('itemAuth res', itemAuth);
		if (itemAuth.errorCode.toString() === '0') {
			if (itemAuth.data.flag === '0') { // 状态有效
				if (itemAuth.data.loginFlag === '1') { // {1:需要登入，0：不需要}
					// verifyApi(itemNo, channelCode, to.path, next, applicationId, to)
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
// 获取用户权限
function vertifyUserAuth(axios, urlParams, domain, callback, next) {
	if (process.env.NODE_ENV === 'development') {
		const url = `${domain}/unite/${urlParams.itemNo}/11111111?srcCode=${urlParams.channelCode || 'hzeg'}&applicationId=${urlParams.applicationId || ''}&kg=1`;
		axios.post(url, urlParams).then(userAuth => {
			console.log('userAuth res', userAuth);
		})
	} else {
		window.yl.call('getAuthcode', {}, {
			onSuccess: (res) => {
				const url = `${domain}/unite/${urlParams.itemNo}/${res.param.authCode}?srcCode=${urlParams.channelCode || 'hzeg'}&applicationId=${urlParams.applicationId || ''}&kg=1`;
				// 异常统一在axios里处理,这里不做处理
				axios.post(url, urlParams).then(userAuth => {
					console.log('userAuth res', userAuth);
					if (userAuth.errorCode.toString() === '0') {
						callback(next);
					} else if (res.errorCode.toString() === '10001') {
						// // 需先登录
						window.yl.call('getAuthcode', {}, {
							onSuccess: function (res) {
								window.yl.call('closeWebview')
							},
							onFail: function (res) {
								window.yl.call('closeWebview')
							}
						})
					} else if (res.errorCode.toString() === '10002') {
						// 需先实名登记
						window.yl.call('requireAuth', {}, {
							onSuccess: function (res) {
								window.yl.call('closeWebview')
							},
							onFail: function (res) {
								window.yl.call('closeWebview')
							}
						})
					} else if (res.errorCode.toString() === '10003') {
						window.yl.call('faceDetection', {}, {
							onSuccess: function (res) {
								window.yl.call('closeWebview')
							},
							onFail: function (res) {
								window.yl.call('closeWebview')
							}
						})
					} else {
						next({
							path: '/submitFail',
							query: {
								errorMsg: res.value
							}
						})
					}
				})
			},
			onFail: (e) => {
				console.log('获取authCode失败');
				next();
			}
		});
	}
}

exports.appAuth = appAuth;
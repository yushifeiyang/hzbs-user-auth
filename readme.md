## hzbs前端权限获取
> 此项目仅方便统一管理,调试需要在具体项目调试
> dist里可以用于script引用

> vue项目引用 
> npm i hzbs-user-auth --save
`
import { appAuth, h5Auth } from 'hzbs-user-auth';
appAuth(urlParams, axios, callback, errorPage, domain, next)

`
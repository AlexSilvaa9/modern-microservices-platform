import { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
    // We clone the request and set withCredentials to true to ensure 
    // HttpOnly cookies are attached properly since backend uses cross-origin cookies.
    const credentialsReq = req.clone({
        withCredentials: true
    });

    return next(credentialsReq);
};

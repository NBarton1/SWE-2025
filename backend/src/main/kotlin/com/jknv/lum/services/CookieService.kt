package com.jknv.lum.services

import org.apache.tomcat.util.http.SameSiteCookies
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseCookie
import org.springframework.stereotype.Service

@Service
class CookieService(
    @param:Value($$"${lum.cookie.name}")
    private val cookieName: String,

    @param:Value($$"${lum.cookie.expires-in}")
    private val cookieExpiration: Long,
) {

    fun giveCookie(jwt: String): ResponseCookie {
        return ResponseCookie.from(cookieName, jwt)
            .httpOnly(true)
            .secure(true)
            .path("/")
            .maxAge(cookieExpiration)
            .sameSite(SameSiteCookies.STRICT.toString())
            .build()
    }
}
package com.jknv.lum.services

import org.apache.tomcat.util.http.SameSiteCookies
import org.junit.jupiter.api.Test
import org.springframework.http.ResponseCookie
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class CookieServiceTest {

    val cookieName = "authCookie"
    val cookieExpiration = 3600L

    var cookieService: CookieService = CookieService(cookieName, cookieExpiration)

    @Test
    fun giveCookieTest() {
        val jwt = "token"
        val cookie: ResponseCookie = cookieService.giveCookie(jwt)

        assertEquals(cookieName, cookie.name)
        assertEquals(jwt, cookie.value)
        assertEquals("/", cookie.path)
        assertEquals(SameSiteCookies.STRICT.toString(), cookie.sameSite)
        assertTrue(cookie.isHttpOnly)
        assertTrue(cookie.isSecure)
    }

    @Test
    fun getNameTest() {
        val name = cookieService.getCookieName()
        assertEquals(cookieName, name)
    }
}

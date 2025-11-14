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
        val cookie: ResponseCookie = cookieService.giveLoginCookie(jwt)

        assertEquals(cookieName, cookie.name)
        assertEquals(cookieExpiration, cookie.maxAge.seconds)
        assertEquals(jwt, cookie.value)
        assertEquals("/", cookie.path)
        assertEquals(SameSiteCookies.STRICT.toString(), cookie.sameSite)
        assertTrue(cookie.isHttpOnly)
        assertTrue(cookie.isSecure)
    }

    @Test
    fun giveLogoutCookieTest() {
        val cookie = cookieService.giveLogoutCookie()

        assertEquals(cookieName, cookie.name)
        assertEquals(0, cookie.maxAge.seconds)
        assertEquals("", cookie.value)
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

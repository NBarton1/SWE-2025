package com.jknv.lum.security

import com.jknv.lum.services.AccountDetailsService
import com.jknv.lum.services.JwtService
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.security.core.context.SecurityContextHolder
import kotlin.test.assertNotNull
import kotlin.test.assertNull

class JwtTokenFilterTest {

    val accountDetailsService: AccountDetailsService = mockk()
    val jwtService: JwtService = mockk()

    val filter: JwtTokenFilter = JwtTokenFilter(accountDetailsService, jwtService)

    lateinit var request: HttpServletRequest
    lateinit var response: HttpServletResponse
    lateinit var filterChain: FilterChain

    @BeforeEach
    fun setup() {
        request = mockk(relaxed = true)
        response = mockk(relaxed = true)
        filterChain = mockk(relaxed = true)

        SecurityContextHolder.clearContext()
    }

    @Test
    fun doFilterInternalTest() {
        val jwt = "DK"
        val username = "username"

        val accountDetails = mockk<AccountDetails>(relaxed = true)

        every { request.getHeader("Authorization") } returns "Bearer $jwt"
        every { jwtService.getClaimsFromJwt(jwt) } returns mockk {
            every { subject } returns username
        }
        every { accountDetailsService.loadUserByUsername(username) } returns accountDetails
        every { jwtService.isValidToken(any(), accountDetails) } returns true

        filter.doFilterInternal(request, response, filterChain)

        val auth = SecurityContextHolder.getContext().authentication
        assertNotNull(auth)
        verify { filterChain.doFilter(request, response) }
    }

    @Test
    fun doFilterInternalNoAuthTest() {
        every { request.getHeader("Authorization") } returns null

        filter.doFilterInternal(request, response, filterChain)

        val auth = SecurityContextHolder.getContext().authentication
        assertNull(auth)
        verify { filterChain.doFilter(request, response) }
    }
}

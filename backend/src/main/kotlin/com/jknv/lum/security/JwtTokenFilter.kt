package com.jknv.lum.security

import com.jknv.lum.services.AccountDetailsService
import com.jknv.lum.services.CookieService
import com.jknv.lum.services.JwtService
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpHeaders
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter


@Component
class JwtTokenFilter(
    private val accountDetailsService: AccountDetailsService,
    private val jwtService: JwtService,
    private val cookieService: CookieService,
) : OncePerRequestFilter() {

    public override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val jwt = parseJwtHeader(request)
        val claims = if (jwt != null) jwtService.getClaimsFromJwt(jwt) else null

        if (claims != null) {
            val id = claims.subject.toLongOrNull()

            if (id != null) {
                val accountDetails = accountDetailsService.loadUserById(id)
                if (jwtService.isValidToken(claims, accountDetails)) {
                    val token = UsernamePasswordAuthenticationToken(
                        accountDetails,
                        null,
                        accountDetails.authorities
                    )
                    token.details = WebAuthenticationDetailsSource().buildDetails(request)
                    SecurityContextHolder.getContext().authentication = token
                }
            }
        }

        filterChain.doFilter(request, response)
    }


    private fun parseJwtHeader(request: HttpServletRequest): String? {
        val cookieJwt = request.cookies?.firstOrNull { it.name == cookieService.getCookieName() }?.value
        if (cookieJwt != null) {
            return cookieJwt
        }

        return null
    }
}
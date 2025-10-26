package com.jknv.lum.security

import com.jknv.lum.services.AccountDetailsService
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
class JwtTokenFilter(private val accountDetailsService: AccountDetailsService, private val jwtService: JwtService) : OncePerRequestFilter() {


    companion object {
        const val JWT_BEARER_AUTH_HEADER_START = "Bearer "
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val jwt = parseJwtHeader(request)
        val claims = if (jwt != null) jwtService.getClaimsFromJwt(jwt) else null

        if (claims != null) {
            val username = claims.subject
            val accountDetails = accountDetailsService.loadUserByUsername(username)
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

        filterChain.doFilter(request, response)
    }


    private fun parseJwtHeader(request: HttpServletRequest): String? {
        val headerAuth = request.getHeader(HttpHeaders.AUTHORIZATION)
        if (headerAuth != null && headerAuth.startsWith(JWT_BEARER_AUTH_HEADER_START)) {
            return headerAuth.substring(JWT_BEARER_AUTH_HEADER_START.length)
        }
        return null
    }
}
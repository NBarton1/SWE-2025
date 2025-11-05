package com.jknv.lum.services

import com.jknv.lum.security.AccountDetails
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*
import javax.crypto.SecretKey
import kotlin.io.encoding.Base64

@Service
class JwtService(
    @param:Value($$"${lum.jwt.secret}")
    private val jwtSecret: String,

    @param:Value($$"${lum.jwt.expiration}")
    private val jwtExpiration: Long,

    @param:Value($$"${lum.jwt.issuer}")
    private val jwtIssuer: String,
) {
    fun giveToken(id: Long): String {
        val claims = mapOf<String, Any>()

        val issuedAt = Date.from(Instant.now())
        val expiration = Date.from(Instant.now().plus(jwtExpiration, ChronoUnit.SECONDS))

        return Jwts.builder()
            .claims()
            .add(claims)
            .subject(id.toString())
            .issuedAt(issuedAt)
            .issuer(jwtIssuer)
            .expiration(expiration)
            .and()
            .signWith(getKey())
            .compact()
    }

    private fun getKey(): SecretKey {
        val keyBytes = Base64.decode(jwtSecret)
        return Keys.hmacShaKeyFor(keyBytes)
    }

    fun getClaimsFromJwt(token: String): Claims? {
        return runCatching {
            Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .payload
        }.getOrNull()
    }

    fun isValidToken(jwt: Claims, accountDetails: AccountDetails): Boolean {
        return jwt.subject == accountDetails.id.toString() &&
                jwt.issuer == jwtIssuer &&
                !isTokenExpired(jwt)
    }

    private fun isTokenExpired(jwt: Claims): Boolean {
        val now = Date.from(Instant.now())
        return jwt.expiration.before(now)
    }
}
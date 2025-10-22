package com.jknv.lum.services

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import io.jsonwebtoken.security.SignatureAlgorithm
import org.springframework.cache.interceptor.KeyGenerator
import org.springframework.stereotype.Service
import java.security.Key
import java.time.temporal.ChronoUnit
import java.util.Date
import java.util.Objects
import kotlin.io.encoding.Base64
import java.time.Instant

@Service
class JwtService(

) {


    private val secretKey: String = ""

    fun giveToken(username: String): String {
        val claims = mapOf<String, Objects>()


        val issuedAt = Date.from(Instant.now())
        val expiration = Date.from(Instant.now().plus(1, ChronoUnit.HOURS))

        return Jwts.builder()
            .claims()
            .add(claims)
            .subject(username)
            .issuedAt(issuedAt)
            .expiration(expiration)
            .and()
            .signWith(getKey())
            .compact()

    }

    private fun getKey(): Key {
        val keyBytes = Base64.decode(secretKey)
        return Keys.hmacShaKeyFor(keyBytes)
    }
}
package com.jknv.lum.services

import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.type.Role
import com.jknv.lum.security.AccountDetails
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertNotNull
import org.junit.jupiter.api.assertNull
import java.util.Base64
import kotlin.test.assertFalse

class JwtServiceTest {
    val jwtService: JwtService = JwtService(
        jwtSecret = Base64.getEncoder().encodeToString("secretsecretsecretsecretsecretsecret".toByteArray()),
        jwtExpiration = 3600,
        jwtIssuer = "test"
    )
    lateinit var account: Account

    @BeforeEach
    fun setup() {
        account = Account(
            name = "abc",
            username = "abc",
            password = "abc",
            role = Role.ADMIN,
        )
    }

    @Test
    fun giveTokenTest() {
        val token = jwtService.giveToken(account.username)

        assertNotNull(token)
    }

    @Test
    fun getClaimsFromValidJwtTest() {
        val token = jwtService.giveToken(account.username)

        val claims = jwtService.getClaimsFromJwt(token)

        assertTrue(claims?.subject.equals(account.username))
    }

    @Test
    fun getClaimsFromInvalidJwtTest() {
        val token = jwtService.giveToken(account.username)

        val claims = jwtService.getClaimsFromJwt(token + " ")

        assertNull(claims)
    }

    @Test
    fun validTokenTest() {
        val token = jwtService.giveToken(account.username)

        val claims = jwtService.getClaimsFromJwt(token)!!

        assertTrue(jwtService.isValidToken(claims, AccountDetails(account)))
    }

    @Test
    fun invalidTokenTest() {
        val token = jwtService.giveToken(account.username)

        val claims = jwtService.getClaimsFromJwt(token)!!

        account.username = " "

        assertFalse(jwtService.isValidToken(claims, AccountDetails(account)))
    }
}

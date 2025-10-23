package com.jknv.lum.services

import com.jknv.lum.model.entity.Account
import com.jknv.lum.repository.AccountRepository
import com.jknv.lum.security.AccountDetails
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertNotNull
import org.junit.jupiter.api.assertNull
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import kotlin.test.assertEquals
import kotlin.test.assertFalse

class JwtServiceTest {
    val jwtService: JwtService = JwtService(
        jwtSecret = "YWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWE=",
    )
    lateinit var account: Account

    @BeforeEach
    fun setup() {
        account = Account(
            name = "abc",
            username = "abc",
            password = "abc",
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
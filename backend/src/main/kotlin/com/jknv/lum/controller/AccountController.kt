package com.jknv.lum.controller

import com.jknv.lum.LOGGER
import com.jknv.lum.model.Account
import com.jknv.lum.services.AccountService
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class AccountController(
    private val accountService: AccountService
) {

    @PostMapping("/api/auth/signup")
    fun signup(@RequestBody account: Account): ResponseEntity<Account> {
        LOGGER.info("Received signup")
        val newAccount = accountService.createAccount(account)
        return ResponseEntity.status(HttpStatus.CREATED).body(newAccount)
    }

    @GetMapping("/")
    fun greet(request: HttpServletRequest): String {
        LOGGER.info("You are authenticated!")
        return "Hello World" + request.session.id
    }

}
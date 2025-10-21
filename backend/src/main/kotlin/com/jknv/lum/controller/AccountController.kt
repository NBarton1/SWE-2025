package com.jknv.lum.controller

import com.jknv.lum.LOGGER
import com.jknv.lum.LeagueOfUnitedMinorsApplication
import com.jknv.lum.model.Account
import com.jknv.lum.repository.AccountRepository
import com.jknv.lum.services.AccountService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("api")
class AccountController(
    private val accountService: AccountService
) {

//    @PostMapping("/login")
//    fun login(@RequestBody account: Account): ResponseEntity<Account> {
//        val foundAccount =
//            accountRepository.findAccountByUsername(account.username) ?: return ResponseEntity(HttpStatus.UNAUTHORIZED)
//
//        return ResponseEntity.ok(foundAccount)
//    }

    @PostMapping("/auth/signup")
    fun signup(@RequestBody account: Account): ResponseEntity<Account> {
        LOGGER.info("Received signup")
        val newAccount = accountService.createAccount(account)
        return ResponseEntity.status(HttpStatus.CREATED).body(newAccount)
    }

    @GetMapping("/me")
    fun me(): ResponseEntity<String> {
        LOGGER.info("You are authenticated!")
        return ResponseEntity.status(HttpStatus.OK).body("You are logged in!")
    }

}
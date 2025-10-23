package com.jknv.lum.controller

import com.jknv.lum.model.entity.Account
import com.jknv.lum.request.AccountLoginRequest
import com.jknv.lum.request.AccountUpdateRequest
import com.jknv.lum.services.AccountService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/accounts")
class AccountController(
    private val accountService: AccountService,
) {

    @PostMapping
    fun create(@RequestBody account: Account): ResponseEntity<Account> {
        val newAccount = accountService.createAccount(account)
        return ResponseEntity.status(HttpStatus.CREATED).body(newAccount)
    }

    @GetMapping
    fun findAll(): ResponseEntity<List<Account>> =
        ResponseEntity.ok(accountService.getAccounts())

    @GetMapping("/{id}")
    fun find(@PathVariable id: Long): ResponseEntity<Account> =
        ResponseEntity.ok(accountService.getAccount(id))

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: Long,
        @RequestBody updateInfo: AccountUpdateRequest
    ): ResponseEntity<Account> {
        val updatedAccount = accountService.updateAccount(id, updateInfo) ?: return ResponseEntity.notFound().build()
        return ResponseEntity.accepted().body(updatedAccount)
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        accountService.deleteAccount(id)
        return ResponseEntity.ok().build()
    }

    @PostMapping("/login")
    fun login(@RequestBody loginRequest: AccountLoginRequest): ResponseEntity<String> {
        val token = accountService.verifyLogin(loginRequest) ?: return ResponseEntity.notFound().build()
        return ResponseEntity.accepted().body(token)
    }
}

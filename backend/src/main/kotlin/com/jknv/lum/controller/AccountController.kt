package com.jknv.lum.controller

import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.request.account.AccountLoginRequest
import com.jknv.lum.model.request.account.AccountUpdateRequest
import com.jknv.lum.services.AccountService
import com.jknv.lum.services.CookieService
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/accounts")
class AccountController(
    private val accountService: AccountService,
    private val cookieService: CookieService,
) {

    @PostMapping
    fun create(@RequestBody account: Account): ResponseEntity<Account> {
        return ResponseEntity.status(HttpStatus.CREATED).body(accountService.createAccount(account))
    }

    @GetMapping
    fun getAll(): ResponseEntity<List<Account>> =
        ResponseEntity.ok(accountService.getAccounts())

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ResponseEntity<Account> =
        ResponseEntity.ok(accountService.getAccountById(id))

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
    fun login(@RequestBody loginRequest: AccountLoginRequest, response: HttpServletResponse): ResponseEntity<String> {
        val token = accountService.verifyLogin(loginRequest) ?: return ResponseEntity.notFound().build()

        val cookie = cookieService.giveCookie(token)

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // TODO: make response dto, not return cookie
        return ResponseEntity.ok(token)
    }
}

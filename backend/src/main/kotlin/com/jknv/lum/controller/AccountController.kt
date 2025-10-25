package com.jknv.lum.controller

import com.jknv.lum.model.dto.AccountDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.request.account.AccountCreateRequest
import com.jknv.lum.model.request.account.AccountLoginRequest
import com.jknv.lum.model.request.account.AccountUpdateRequest
import com.jknv.lum.services.AccountService
import com.jknv.lum.services.CookieService
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
@RequestMapping("/api/accounts")
class AccountController(
    private val accountService: AccountService,
    private val cookieService: CookieService,
) {

    @PostMapping
    fun create(@RequestBody req: AccountCreateRequest): ResponseEntity<AccountDTO> {
        val response = accountService.createAccountWithRoles(req)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @GetMapping
    fun getAll(): ResponseEntity<List<AccountDTO>> {
        val response = accountService.getAccounts()
        return ResponseEntity.ok(response)
    }

    @PutMapping
    fun update(
        @RequestBody updateInfo: AccountUpdateRequest,
        principal: Principal,
    ): ResponseEntity<AccountDTO> {
        val response = accountService.updateAccount(principal.name, updateInfo)
        return ResponseEntity.accepted().body(response)
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

package com.jknv.lum.controller

import com.jknv.lum.config.PreAuthorizeGuardian
import com.jknv.lum.model.dto.AccountDTO
import com.jknv.lum.model.dto.PlayerDTO
import com.jknv.lum.model.request.account.AccountCreateRequest
import com.jknv.lum.model.request.account.AccountLoginRequest
import com.jknv.lum.model.request.account.AccountUpdateRequest
import com.jknv.lum.security.AccountDetails
import com.jknv.lum.services.AccountService
import com.jknv.lum.services.CookieService
import com.jknv.lum.services.GuardianService
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/accounts")
class AccountController(
    private val accountService: AccountService,
    private val cookieService: CookieService,
    private val guardianService: GuardianService,
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

    @GetMapping("/{id}")
    fun get(@PathVariable id: Long): ResponseEntity<AccountDTO?> {
        val response = accountService.getAccount(id)
        return ResponseEntity.ok(response)
    }

    @PutMapping
    fun update(
        @RequestBody updateInfo: AccountUpdateRequest,
        @AuthenticationPrincipal details: AccountDetails,
    ): ResponseEntity<AccountDTO> {
        val response = accountService.updateAccount(details.id, updateInfo)
        return ResponseEntity.accepted().body(response)
    }

    @GetMapping("/dependents")
    @PreAuthorizeGuardian
    fun getDependents(@AuthenticationPrincipal details: AccountDetails): ResponseEntity<List<PlayerDTO>> {
        val response = guardianService.getDependentsOf(details.id)
        return ResponseEntity.ok(response)
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        accountService.deleteAccount(id)
        return ResponseEntity.ok().build()
    }

    @PostMapping("/login")
    fun login(@RequestBody loginRequest: AccountLoginRequest, response: HttpServletResponse): ResponseEntity<Long> {
        val token = accountService.verifyLogin(loginRequest) ?: return ResponseEntity.notFound().build()

        val id = accountService.getAccountByUsername(loginRequest.username).id

        val cookie = cookieService.giveLoginCookie(token)

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString())

        return ResponseEntity.ok(id)
    }

    @PostMapping("/logout")
    fun logout(response: HttpServletResponse): ResponseEntity<Void> {

        val cookie = cookieService.giveLogoutCookie()
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString())
        return ResponseEntity.ok().build()
    }
}

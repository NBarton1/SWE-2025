package com.jknv.lum.controller

import com.jknv.lum.LOGGER
import com.jknv.lum.config.PreAuthorizeGuardian
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Player
import com.jknv.lum.model.request.AccountLoginRequest
import com.jknv.lum.model.request.AccountUpdateRequest
import com.jknv.lum.model.request.PlayerCreateRequest
import com.jknv.lum.model.type.Role
import com.jknv.lum.services.AccountService
import com.jknv.lum.services.PlayerService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
@RequestMapping("/api/accounts")
class AccountController(
    private val accountService: AccountService,
    private val playerService: PlayerService,
) {

    @PostMapping
    fun create(@RequestBody account: Account): ResponseEntity<Account> {
        return ResponseEntity.status(HttpStatus.CREATED).body(accountService.createAccount(account))
    }

    @PostMapping("/player")
    @PreAuthorizeGuardian
    fun createPlayer(@RequestBody req: PlayerCreateRequest, principal: Principal): ResponseEntity<Player> {
        LOGGER.info("creating player")
        val player = Account(name = req.name, username = req.username, password = req.password, role = Role.PLAYER)
        val guardian = accountService.getAccountByUsername(principal.name)
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.status(HttpStatus.CREATED).body(accountService.createPlayerAccount(player, guardian))
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

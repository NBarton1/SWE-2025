package com.jknv.lum.controller

import com.jknv.lum.LOGGER
import com.jknv.lum.config.PreAuthorizeGuardian
import com.jknv.lum.config.PreAuthorizeAdminOrAccountOwner
import com.jknv.lum.model.dto.AccountDTO
import com.jknv.lum.model.dto.PlayerDTO
import com.jknv.lum.model.dto.ContentDTO
import com.jknv.lum.model.request.account.AccountCreateRequest
import com.jknv.lum.model.request.account.AccountLoginRequest
import com.jknv.lum.model.request.account.AccountUpdateRequest
import com.jknv.lum.model.type.Role
import com.jknv.lum.security.AccountDetails
import com.jknv.lum.services.AccountService
import com.jknv.lum.services.ContentService
import com.jknv.lum.services.CookieService
import com.jknv.lum.services.GuardianService
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/accounts")
class AccountController(
    private val accountService: AccountService,
    private val cookieService: CookieService,
    private val guardianService: GuardianService,
    private val contentService: ContentService,
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

    @PutMapping("/{id}")
    @PreAuthorizeAdminOrAccountOwner
    fun update(
        @RequestBody updateInfo: AccountUpdateRequest,
        @PathVariable id: Long,
        @AuthenticationPrincipal details: AccountDetails,
    ): ResponseEntity<AccountDTO> {
        val response = accountService.updateAccount(details.id, updateInfo)
        if (details.role != Role.ADMIN && updateInfo.role != null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }
        return ResponseEntity.accepted().body(response)
    }

    @GetMapping("/dependents")
    @PreAuthorizeGuardian
    fun getDependents(@AuthenticationPrincipal details: AccountDetails): ResponseEntity<List<PlayerDTO>> {
        val response = guardianService.getDependentsOf(details.id)
        return ResponseEntity.ok(response)
    }

    @PatchMapping("/picture", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    @PreAuthorizeAdminOrAccountOwner
    fun updatePicture(
        @AuthenticationPrincipal details: AccountDetails,
        @RequestParam("image") image: MultipartFile
    ): ResponseEntity<ContentDTO> {
        val picture = contentService.upload(image)
        LOGGER.info("${picture.id}")
        accountService.updatePictureForAccount(details.account, picture)
        return ResponseEntity.ok().body(picture.toDTO())
    }

    @DeleteMapping("/{id}")
    @PreAuthorizeAdminOrAccountOwner
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

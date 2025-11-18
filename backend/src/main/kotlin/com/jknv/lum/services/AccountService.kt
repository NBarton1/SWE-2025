package com.jknv.lum.services

import com.jknv.lum.LOGGER
import com.jknv.lum.model.dto.AccountDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.request.account.AccountCreateRequest
import com.jknv.lum.model.type.Role
import com.jknv.lum.model.request.account.AccountUpdateRequest
import com.jknv.lum.repository.AccountRepository
import com.jknv.lum.model.request.account.AccountLoginRequest
import com.jknv.lum.security.AccountDetails
import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

@Service
@Transactional
class AccountService(
    private val accountRepository: AccountRepository,
    private val authenticationManager: AuthenticationManager,
    private val bCryptPasswordEncoder: BCryptPasswordEncoder,
    private val jwtService: JwtService,
    private val contentService: ContentService,
    private val accountRoleService: AccountRoleService,
) {
    fun createAccountWithRoles(req: AccountCreateRequest): AccountDTO {
        val account = createAccount(req)
        accountRoleService.createAccount(account)

        return account.toDTO()
    }

    fun getAccount(id: Long): AccountDTO =
        getAccountById(id).toDTO()

    fun getAccounts(): List<AccountDTO> =
        accountRepository.findAll().map { it.toDTO() }

    fun updateAccount(id: Long, requesterId: Long, req: AccountUpdateRequest): AccountDTO {
        val account = getAccountById(id)
        val requester =
            if (id == requesterId)
                account
            else getAccountById(requesterId)

        if (id != requester.id && requester.role != Role.ADMIN)
            throw IllegalAccessException("You cannot update account $id")

        if (req.role != null && requester.role != Role.ADMIN)
            throw IllegalAccessException("You cannot update the role of $id")

        if (account.role != Role.PLAYER)
            req.email?.let { account.email = it }
        req.name?.let { account.name = it }
        req.username?.let { account.username = it }
        req.password?.let { account.password = bCryptPasswordEncoder.encode(it) }
        req.role?.let { accountRoleService.updateRole(account, it) }

        return updateAccount(account)
    }

    fun updatePictureForAccount(id: Long, image: MultipartFile): AccountDTO {
        val picture = contentService.uploadContent(image)
        val account = getAccountById(id)
        account.picture = picture

        LOGGER.info("Account $id added picture ${picture.toDTO()}")

        return updateAccount(account)
    }

    fun deleteAccount(id: Long) =
        accountRepository.deleteById(id)

    fun verifyLogin(loginRequest: AccountLoginRequest): String? {
        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(
                loginRequest.username,
                loginRequest.password
            )
        )

        if (!authentication.isAuthenticated)
            return null

        val userId = (authentication.principal as? AccountDetails)?.account?.id ?: return null
        return jwtService.giveToken(userId)
    }

    internal fun updateAccount(account: Account): AccountDTO =
        accountRepository.save(account).toDTO()

    internal fun createAccount(req: AccountCreateRequest): Account =
        accountRepository.save(req.toEntity())

    internal fun getAccountByUsername(username: String): Account =
        accountRepository.findByUsername(username).orElseThrow { EntityNotFoundException("User $username not found") }

    internal fun getAccountById(id: Long): Account =
        accountRepository.findById(id).orElseThrow { EntityNotFoundException("User $id not found") }
}

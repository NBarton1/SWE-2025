package com.jknv.lum.services

import com.jknv.lum.model.dto.AccountDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.request.account.AccountCreateRequest
import com.jknv.lum.model.type.Role
import com.jknv.lum.model.request.account.AccountUpdateRequest
import com.jknv.lum.repository.AccountRepository
import com.jknv.lum.model.request.account.AccountLoginRequest
import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import kotlin.jvm.optionals.getOrNull

@Service
@Transactional
class AccountService(
    private val accountRepository: AccountRepository,
    private val authenticationManager: AuthenticationManager,
    private val bCryptPasswordEncoder: BCryptPasswordEncoder,
    private val jwtService: JwtService,
    private val coachService: CoachService,
    private val guardianService: GuardianService,
    private val adminService: AdminService,
) {

    private fun createAdmin(account: Account) = adminService.createAdmin(account)
    private fun createCoach(account: Account) = coachService.createCoach(account)
    private fun createGuardian(account: Account) = guardianService.createGuardian(account)

    internal fun createAccount(req: AccountCreateRequest): Account =
        accountRepository.save(req.toEntity())

    fun createAccountWithRoles(req: AccountCreateRequest): AccountDTO {
        val account = createAccount(req)
        roleHierarchy(account.role).forEach { role ->
            when (role) {
                Role.ADMIN -> { createAdmin(account) }
                Role.COACH -> { createCoach(account) }
                Role.GUARDIAN -> { createGuardian(account) }
                Role.PLAYER -> {} // player is created directly by guardian
            }
        }

        return account.toDTO()
    }

    internal fun getAccountByUsername(username: String): Account? =
        accountRepository.findByUsername(username)

    fun getAccounts(): List<AccountDTO> =
        accountRepository.findAll().map { it.toDTO() }

    fun getAccount(id: Long): AccountDTO? =
        accountRepository.findById(id).getOrNull()?.toDTO()

    fun updateAccount(username: String, req: AccountUpdateRequest): AccountDTO {
        val account = getAccountByUsername(username)
            ?: throw EntityNotFoundException("Account not found")

        req.name?.let { account.name = it }
        req.username?.let { account.username = it }
        req.picture?.let { account.picture = it }
        req.password?.let { account.password = bCryptPasswordEncoder.encode(it) }

        return accountRepository.save(account).toDTO()
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

        if (authentication.isAuthenticated) {
            return jwtService.giveToken(loginRequest.username)
        }

        return null
    }

    fun countAccounts(): Long =
         accountRepository.count()

    private fun roleHierarchy(role: Role): Set<Role> =
        when (role) {
            Role.ADMIN -> setOf(Role.ADMIN, Role.COACH, Role.GUARDIAN)
            Role.COACH -> setOf(Role.COACH, Role.GUARDIAN)
            Role.GUARDIAN -> setOf(Role.GUARDIAN)
            Role.PLAYER -> setOf(Role.PLAYER)
        }
}
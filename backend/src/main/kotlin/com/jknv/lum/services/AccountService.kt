package com.jknv.lum.services

import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Coach
import com.jknv.lum.model.entity.Guardian
import com.jknv.lum.model.type.Role
import com.jknv.lum.model.request.account.AccountUpdateRequest
import com.jknv.lum.repository.AccountRepository
import com.jknv.lum.model.request.account.AccountLoginRequest
import jakarta.transaction.Transactional
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service

@Service
@Transactional
class AccountService(
    private val accountRepository: AccountRepository,
    private val authenticationManager: AuthenticationManager,
    private val bCryptPasswordEncoder: BCryptPasswordEncoder,
    private val jwtService: JwtService,
    private val coachService: CoachService,
    private val guardianService: GuardianService,
) {

    fun createAccount(account: Account): Account {
        account.password = bCryptPasswordEncoder.encode(account.password)
        val newAccount = accountRepository.save(account)
        roleHierarchy(newAccount.role).forEach { role ->
            when (role) {
                Role.ADMIN -> {}
                Role.COACH -> coachService.createCoach(Coach(account = newAccount))
                Role.GUARDIAN -> guardianService.createGuardian(Guardian(account = newAccount))
                Role.PLAYER -> {}
            }
        }
        return newAccount
    }

    fun getAccountById(id: Long): Account? {
        return accountRepository.findById(id).orElse(null)
    }

    fun getAccountByUsername(username: String): Account? {
        return accountRepository.findByUsername(username)
    }

    fun getAccounts(): List<Account> {
        return accountRepository.findAll()
    }

    fun updateAccount(id: Long, updateInfo: AccountUpdateRequest): Account? {

        val account = getAccountById(id) ?: return null
        account.updateFromRequest(updateInfo, bCryptPasswordEncoder)
        return accountRepository.save(account)
    }

    fun deleteAccount(id: Long) {
        accountRepository.deleteById(id)
    }

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

    fun countAccounts(): Long {
        return accountRepository.count()
    }

    private fun roleHierarchy(role: Role): Set<Role> {
        return when (role) {
            Role.ADMIN -> setOf(Role.ADMIN, Role.COACH, Role.GUARDIAN)
            Role.COACH -> setOf(Role.COACH, Role.GUARDIAN)
            Role.GUARDIAN -> setOf(Role.GUARDIAN)
            Role.PLAYER -> setOf(Role.PLAYER)
        }
    }
}
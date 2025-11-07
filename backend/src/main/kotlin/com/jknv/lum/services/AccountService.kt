package com.jknv.lum.services

import com.jknv.lum.LOGGER
import com.jknv.lum.model.dto.AccountDTO
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Content
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
    private val playerService: PlayerService,
) {
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

    private fun setAccountToRole(account: Account, newRole: Role) {
        LOGGER.info("TEST ${account.role} $newRole")
        if (account.role == newRole) return

        val currentRoles = roleHierarchy(account.role)
        val newRoles = roleHierarchy(newRole)

        val rolesToRemove = currentRoles - newRoles
        val rolesToAdd = newRoles - currentRoles

        LOGGER.info("TEST $rolesToRemove and $rolesToAdd")

        rolesToRemove.forEach { role ->
            when (role) {
                Role.ADMIN -> account.admin = null
                Role.COACH -> account.coach = null
                Role.GUARDIAN -> account.guardian = null
                Role.PLAYER -> account.player = null
            }
        }

        rolesToAdd.forEach { role ->
            if (getRoleEntity(account, role) == null) {
                when (role) {
                    Role.ADMIN -> createAdmin(account)
                    Role.COACH -> createCoach(account)
                    Role.GUARDIAN -> createGuardian(account)
                    Role.PLAYER -> createPlayer(account)
                }
            }
        }

        account.role = newRole
    }

    private fun getRoleEntity(account: Account, role: Role): Any? = when (role) {
        Role.ADMIN -> account.admin
        Role.COACH -> account.coach
        Role.GUARDIAN -> account.guardian
        Role.PLAYER -> account.player
    }

    fun getAccount(id: Long): AccountDTO =
        getAccountById(id).toDTO()

    fun getAccounts(): List<AccountDTO> =
        accountRepository.findAll().map { it.toDTO() }

    fun updateAccount(id: Long, req: AccountUpdateRequest): AccountDTO {

        val account = getAccountById(id)

        req.name?.let { account.name = it }
        req.username?.let { account.username = it }
        req.email?.let { account.email = it }

        LOGGER.info("TEST $req")
        req.role?.let {
            setAccountToRole(account, it)
        }

        req.password?.let { account.password = bCryptPasswordEncoder.encode(it) }

        return accountRepository.save(account).toDTO()
    }

    fun updatePictureForAccount(account: Account, picture: Content): AccountDTO {
        account.picture = picture
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
            val userId = (authentication.principal as? AccountDetails)?.id ?: return null
            return jwtService.giveToken(userId)
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

    private fun createAdmin(account: Account) = adminService.createAdmin(account)
    private fun createCoach(account: Account) = coachService.createCoach(account)
    private fun createGuardian(account: Account) = guardianService.createGuardian(account)
    private fun createPlayer(account: Account) = playerService.createPlayer(account)

    internal fun createAccount(req: AccountCreateRequest): Account =
        accountRepository.save(req.toEntity())

    internal fun getAccountByUsername(username: String): Account =
        accountRepository.findByUsername(username).orElseThrow { EntityNotFoundException("User $username not found") }

    internal fun getAccountById(id: Long): Account =
        accountRepository.findById(id).orElseThrow { EntityNotFoundException("User $id not found") }
}

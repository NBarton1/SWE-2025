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
    private val coachService: CoachService,
    private val guardianService: GuardianService,
    private val adminService: AdminService,
    private val playerService: PlayerService,
    private val contentService: ContentService,
) {
    fun createAccountWithRoles(req: AccountCreateRequest): AccountDTO {
        val account = createAccount(req)

        val roles = roleHierarchy(req.role)
        createAccountsForRoles(account, roles)

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
        req.role?.let { updateRole(account, it) }

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

    private fun createAdmin(account: Account) = adminService.createAdmin(account)
    private fun createCoach(account: Account) = coachService.createCoach(account)
    private fun createGuardian(account: Account) = guardianService.createGuardian(account)
    private fun createPlayer(account: Account) = playerService.createPlayer(account)

    private fun deleteAdmin(account: Account) { account.admin = null }
    private fun deleteCoach(account: Account) { account.coach = null }
    private fun deleteGuardian(account: Account) { account.guardian = null }
    private fun deletePlayer(account: Account) { account.player = null }

    private fun roleHierarchy(role: Role): Set<Role> =
        when (role) {
            Role.ADMIN -> setOf(Role.ADMIN, Role.COACH, Role.GUARDIAN)
            Role.COACH -> setOf(Role.COACH, Role.GUARDIAN)
            Role.GUARDIAN -> setOf(Role.GUARDIAN)
            Role.PLAYER -> setOf(Role.PLAYER)
        }

    private fun createAccountsForRoles(account: Account, roles: Set<Role>) =
        roles.forEach { role ->
            when (role) {
                Role.ADMIN -> { createAdmin(account) }
                Role.COACH -> { createCoach(account) }
                Role.GUARDIAN -> { createGuardian(account) }
                Role.PLAYER -> { createPlayer(account) }
            }
        }

    private fun deleteAccountsForRoles(account: Account, roles: Set<Role>) =
        roles.forEach { role ->
            when (role) {
                Role.ADMIN -> { deleteAdmin(account) }
                Role.COACH -> { deleteCoach(account) }
                Role.GUARDIAN -> { deleteGuardian(account) }
                Role.PLAYER -> { deletePlayer(account) }
            }
        }

    private fun updateRole(account: Account, newRole: Role) {
        if (account.role == newRole) return

        val oldRoles = roleHierarchy(account.role)
        val newRoles = roleHierarchy(newRole)

        val addRoles = newRoles - oldRoles
        val removeRoles = oldRoles - newRoles

        deleteAccountsForRoles(account, removeRoles)
        createAccountsForRoles(account, addRoles)

        account.role = newRole
    }
}

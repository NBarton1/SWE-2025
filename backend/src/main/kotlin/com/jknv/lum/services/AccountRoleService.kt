package com.jknv.lum.services

import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.type.Role
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional


@Service
@Transactional
class AccountRoleService (
    private val coachService: CoachService,
    private val guardianService: GuardianService,
    private val adminService: AdminService,
    private val playerService: PlayerService,
) {
    internal fun createAccount(account: Account) {
        val roles = roleHierarchy(account.role)
        createAccountsForRoles(account, roles)
    }

    internal fun updateRole(account: Account, newRole: Role) {
        if (account.role == newRole) return

        val oldRoles = roleHierarchy(account.role)
        val newRoles = roleHierarchy(newRole)

        val addRoles = newRoles - oldRoles
        val removeRoles = oldRoles - newRoles

        deleteAccountsForRoles(account, removeRoles)
        createAccountsForRoles(account, addRoles)

        account.role = newRole
    }

    private fun createAccountsForRoles(account: Account, roles: Set<Role>) =
        roles.forEach { role ->
            when (role) {
                Role.ADMIN -> { adminService.createAdmin(account) }
                Role.COACH -> { coachService.createCoach(account) }
                Role.GUARDIAN -> { guardianService.createGuardian(account) }
                Role.PLAYER -> { playerService.createPlayer(account) }
            }
        }

    private fun deleteAccountsForRoles(account: Account, roles: Set<Role>) =
        roles.forEach { role ->
            when (role) {
                Role.ADMIN -> { account.admin = null }
                Role.COACH -> { account.coach = null }
                Role.GUARDIAN -> { account.guardian = null }
                Role.PLAYER -> { account.player = null }
            }
        }

    private fun roleHierarchy(role: Role): Set<Role> =
        when (role) {
            Role.ADMIN -> setOf(Role.ADMIN, Role.COACH, Role.GUARDIAN)
            Role.COACH -> setOf(Role.COACH, Role.GUARDIAN)
            Role.GUARDIAN -> setOf(Role.GUARDIAN)
            Role.PLAYER -> setOf(Role.PLAYER)
        }
}
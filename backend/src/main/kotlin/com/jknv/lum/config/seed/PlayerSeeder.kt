package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Guardian
import com.jknv.lum.model.entity.Player
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.request.account.AccountCreateRequest
import com.jknv.lum.model.type.Role
import com.jknv.lum.repository.AccountRepository
import com.jknv.lum.repository.GuardianRepository
import com.jknv.lum.repository.PlayerRepository
import com.jknv.lum.repository.TeamRepository
import com.jknv.lum.services.PlayerService
import com.jknv.lum.services.GuardianService
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
@Order(4)
class PlayerSeeder(
    private val playerRepository: PlayerRepository,
    private val guardianRepository: GuardianRepository,
    private val teamRepository: TeamRepository,
    private val accountRepository: AccountRepository,
    private val bCryptPasswordEncoder: BCryptPasswordEncoder,
) : CommandLineRunner {

    @Transactional
    override fun run(vararg args: String?) {
        if (playerRepository.count() == 0L) {
            val guardians = guardianRepository.findAll()
            val teams = teamRepository.findAll()

            val players = listOf(
                playerOf("Player P", "player", guardians[0]),
                playerOf("Diddy Kong", "diddyk", guardians[2], permission = true),
                playerOf("Dixie Kong", "dixiek", guardians[2], teams[0], position = "RB"),
            )

            players.forEach {
                it.account = accountRepository.save(it.account)
                playerRepository.save(it)
            }
            LOGGER.info("Players seeded")
        }
    }

    fun playerOf(name: String, username: String, guardian: Guardian, team: Team? = null, permission: Boolean = false, position: String? = null) : Player =
        Player(
            account = accountOf(name, username),
            guardian = guardian,
            playingTeam = team,
            hasPermission = permission,
            position = position,
        )

    fun accountOf(name: String, username: String) : Account =
        Account(
            name = name,
            username = username,
            password = bCryptPasswordEncoder.encode("password"),
            role = Role.PLAYER,
        )
}

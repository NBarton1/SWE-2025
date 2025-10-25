package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.request.account.AccountCreateRequest
import com.jknv.lum.model.type.Role
import com.jknv.lum.services.PlayerService
import com.jknv.lum.services.GuardianService
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component

@Component
@Order(4)
class PlayerSeeder(
    private val playerService: PlayerService,
    private val guardianService: GuardianService
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        if (playerService.countPlayers() == 0L) {
            val guardians = guardianService.getGuardians()
            val players = listOf(
                Pair(toRequest("Player P", "player"), 3),
                Pair(toRequest("Diddy Kong", "diddyk"), 2),
                Pair(toRequest("Dixie Kong", "dixiek"), 2),
            )

            players.forEach { (player, guardianIdx) -> playerService.createPlayer(player, guardians[guardianIdx].account.username) }
        }
    }

    fun toRequest(name: String, username: String) : AccountCreateRequest =
        AccountCreateRequest(
            name = name,
            username = username,
            password = "password",
            role = Role.PLAYER,
        )
}

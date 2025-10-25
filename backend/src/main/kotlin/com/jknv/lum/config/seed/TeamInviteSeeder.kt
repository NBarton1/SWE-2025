package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.entity.TeamInvite
import com.jknv.lum.model.type.InviteStatus
import com.jknv.lum.services.PlayerService
import com.jknv.lum.services.TeamInviteService
import com.jknv.lum.services.TeamService
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component

@Component
@Order(5)
class TeamInviteSeeder (
    private val teamInviteService: TeamInviteService,
    private val teamService: TeamService,
    private val playerService: PlayerService,
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        if (teamInviteService.countInvites() == 0L) {
            val teams = teamService.getTeams()
            val players = playerService.getPlayers()

            val invites = listOf(
                Pair(2, 0),
                Pair(0, 1),
                Pair(1, 1),
            )

            invites.forEach { (teamIdx, playerIdx) -> teamInviteService.createInvite(teams[teamIdx].id, players[playerIdx].account.id) }
            LOGGER.info("Invites seeded")
        }
    }
}

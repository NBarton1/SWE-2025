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
@Order(2)
class TeamInviteSeeder (
    private val teamInviteService: TeamInviteService,
    private val teamService: TeamService,
    private val playerService: PlayerService,
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        if (teamInviteService.count() == 0L) {
            val teams = teamService.getTeams()
            val players = playerService.getPlayers()

            val invites = listOf(
                TeamInvite(team = teams[0], player = players[0], status = InviteStatus.PENDING),
                TeamInvite(team = teams[1], player = players[0], status = InviteStatus.ACCEPTED),
                TeamInvite(team = teams[2], player = players[0], status = InviteStatus.DECLINED),
            )

            invites.forEach { teamInviteService.create(it) }
            LOGGER.info("Invites seeded")
        }
    }
}
package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.entity.Player
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.entity.TeamInvite
import com.jknv.lum.model.type.InviteStatus
import com.jknv.lum.repository.PlayerRepository
import com.jknv.lum.repository.TeamInviteRepository
import com.jknv.lum.repository.TeamRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
@Order(5)
class TeamInviteSeeder (
    private val teamInviteRepository: TeamInviteRepository,
    private val teamRepository: TeamRepository,
    private val playerRepository: PlayerRepository,
) : CommandLineRunner {

    @Transactional
    override fun run(vararg args: String?) {
        if (teamInviteRepository.count() == 0L) {
            val teams = teamRepository.findAll()
            val players = playerRepository.findAll()

            val invites = listOf(
                inviteOf(teams[2], players[0]),
                inviteOf(teams[0], players[1]),
                inviteOf(teams[2], players[1], InviteStatus.DECLINED)
            )

            invites.forEach { teamInviteRepository.save(it) }
            LOGGER.info("Invites seeded")
        }
    }

    fun inviteOf(team: Team, player: Player, status: InviteStatus = InviteStatus.PENDING) : TeamInvite =
        TeamInvite(
            team = team,
            player = player,
            status = status,
        )
}

package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.entity.TeamInvite
import com.jknv.lum.services.PlayerService
import com.jknv.lum.services.TeamService
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component

@Component
@Order(1)
class TeamSeeder (
    private val teamService: TeamService
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        if (teamService.count() == 0L) {
            val teams = listOf(
                Team(name="DK", win=2, loss=0, draw=0, pointsFor=999, pointsAllowed=0),
                Team(name="Eagles", win=1, loss=1, draw=0, pointsFor=500, pointsAllowed=500),
                Team(name="Chickens", win=0, loss=2, draw=0, pointsFor=0, pointsAllowed=1499)
            )

            teams.forEach { teamService.create(it) }
            LOGGER.info("Teams seeded")
        }
    }
}

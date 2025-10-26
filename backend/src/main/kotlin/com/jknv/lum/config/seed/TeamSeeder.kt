package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.request.team.TeamCreateRequest
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
        if (teamService.countTeams() == 0L) {
            val teams = listOf(
                TeamCreateRequest(name="DK", win=2, loss=0, draw=0, pointsFor=999, pointsAllowed=0),
                TeamCreateRequest(name="Eagles", win=1, loss=1, draw=0, pointsFor=499, pointsAllowed=499),
                TeamCreateRequest(name="Chickens", win=0, loss=2, draw=0, pointsFor=0, pointsAllowed=999)
            )

            teams.forEach { teamService.createTeam(it) }
            LOGGER.info("Teams seeded")
        }
    }
}

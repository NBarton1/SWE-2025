package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.entity.Match
import com.jknv.lum.model.type.MatchType
import com.jknv.lum.services.MatchService
import com.jknv.lum.services.TeamService
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
@Order(2)
class MatchSeeder (
    private val matchService: MatchService,
    private val teamService: TeamService
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        val teams = teamService.getTeams()
        if (matchService.count() == 0L) {
            val matches = listOf(
                Match(homeTeam = teams[0], awayTeam = teams[1], date = LocalDateTime.now(),type = MatchType.PLAYOFF),
                Match(homeTeam = teams[1], awayTeam = teams[2], date = LocalDateTime.now(),type = MatchType.STANDARD),
            )

            matches.forEach { matchService.create(it) }
            LOGGER.info("Matches seeded")
        }
    }
}

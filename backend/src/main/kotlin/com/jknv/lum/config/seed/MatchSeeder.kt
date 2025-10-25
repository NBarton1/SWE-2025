package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.entity.Match
import com.jknv.lum.model.request.match.MatchCreateRequest
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
        if (matchService.countMatches() == 0L) {
            val matches = listOf(
                MatchCreateRequest(homeTeamId = teams[0].id, awayTeamId = teams[1].id, date = LocalDateTime.now(), type = MatchType.PLAYOFF, homeScore = 1000),
                MatchCreateRequest(homeTeamId = teams[1].id, awayTeamId = teams[2].id, date = LocalDateTime.now(), type = MatchType.STANDARD),
            )

            matches.forEach { matchService.createMatch(it) }
            LOGGER.info("Matches seeded")
        }
    }
}

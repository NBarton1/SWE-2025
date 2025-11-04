package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.entity.Match
import com.jknv.lum.model.type.MatchType
import com.jknv.lum.repository.MatchRepository
import com.jknv.lum.repository.TeamRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Component
@Order(2)
class MatchSeeder (
    private val teamRepository: TeamRepository,
    private val matchRepository: MatchRepository,
) : CommandLineRunner {

    @Transactional
    override fun run(vararg args: String?) {
        if (matchRepository.count() == 0L) {
            val teams = teamRepository.findAll()

            val matches = listOf(
                Match(homeTeam = teams[0], awayTeam = teams[1], date = LocalDateTime.now(), type = MatchType.PLAYOFF, homeScore = 1000),
                Match(homeTeam = teams[1], awayTeam = teams[2], date = LocalDateTime.now(), type = MatchType.STANDARD),
            )

            matches.forEach { matchRepository.save(it) }
            LOGGER.info("Matches seeded")
        }
    }
}

package com.jknv.lum.config.seed

import com.jknv.lum.LOGGER
import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Match
import com.jknv.lum.model.entity.Post
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.type.MatchState
import com.jknv.lum.model.type.MatchType
import com.jknv.lum.repository.MatchRepository
import com.jknv.lum.repository.PostRepository
import com.jknv.lum.repository.TeamRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Component
@Order(7)
class MatchSeeder (
    private val teamRepository: TeamRepository,
    private val matchRepository: MatchRepository,
    private val postRepository: PostRepository,
) : CommandLineRunner {

    @Transactional
    override fun run(vararg args: String?) {
        if (matchRepository.count() == 0L) {
            val teams = teamRepository.findAll()

            val matches = listOf(
                matchOf(
                    homeTeam = teams[0],
                    awayTeam = teams[1],
                    date = LocalDateTime.now(),
                    type = MatchType.STANDARD,
                    homeScore = 1000,
                    state = MatchState.FINISHED,
                    awayScore = 0
                ),
                matchOf(
                    homeTeam = teams[1],
                    awayTeam = teams[0],
                    date = LocalDateTime.now(),
                    type = MatchType.STANDARD,
                    awayScore = 1000,
                    state = MatchState.FINISHED,
                    homeScore = 0
                ),
                matchOf(
                    homeTeam = teams[0],
                    awayTeam = teams[2],
                    date = LocalDateTime.now(),
                    type = MatchType.STANDARD,
                    homeScore = 1000,
                    state = MatchState.FINISHED,
                    awayScore = 0
                ),
                matchOf(
                    homeTeam = teams[2],
                    awayTeam = teams[0],
                    date = LocalDateTime.now(),
                    type = MatchType.STANDARD,
                    awayScore = 1000,
                    state = MatchState.FINISHED,
                    homeScore = 0
                ),
                matchOf(
                    homeTeam = teams[1],
                    awayTeam = teams[2],
                    date = LocalDateTime.now(),
                    type = MatchType.STANDARD,
                    homeScore = 100,
                    state = MatchState.FINISHED,
                    awayScore = 0
                ),
                matchOf(
                    homeTeam = teams[2],
                    awayTeam = teams[1],
                    date = LocalDateTime.now(),
                    type = MatchType.STANDARD,
                    awayScore = 100,
                    state = MatchState.FINISHED,
                    homeScore = 0
                ),
            )

            matches.forEach {
                it.post = postRepository.save(Post(match = it, isApproved = true))
                matchRepository.save(it) 
            }
            
            LOGGER.info("Matches seeded")
        }
    }

    fun matchOf(
        homeTeam: Team,
        awayTeam: Team,
        homeScore: Int,
        awayScore: Int,
        date: LocalDateTime,
        type: MatchType,
        state: MatchState
    ) : Match =
        Match (
            homeTeam = homeTeam,
            awayTeam = awayTeam,
            homeScore = homeScore,
            awayScore = awayScore,
            date = date,
            type = type,
            state = state,
        )
}

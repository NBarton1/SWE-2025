package com.jknv.lum.services

import com.jknv.lum.model.entity.Match
import com.jknv.lum.model.request.MatchCreateRequest
import com.jknv.lum.model.request.MatchUpdateRequest
import com.jknv.lum.repository.MatchRepository
import org.springframework.stereotype.Service

@Service
class MatchService (
    val matchRepository: MatchRepository,
    val teamService: TeamService,
) {

    fun createMatch(req: MatchCreateRequest): Match {
        val homeTeam = teamService.getTeamById(req.homeTeamId)
        val awayTeam = teamService.getTeamById(req.awayTeamId)

        val match = Match(
            date = req.date,
            type = req.type,
            homeTeam = homeTeam,
            awayTeam = awayTeam
        )

        return matchRepository.save(match)
    }

    fun updateMatch(req: MatchUpdateRequest): Match {
        val homeTeam = teamService.getTeamById(req.homeTeamId)
        val awayTeam = teamService.getTeamById(req.awayTeamId)

        val match = Match(
            date = req.date,
            type = req.type,
            homeTeam = homeTeam,
            awayTeam = awayTeam
        )

        return matchRepository.save(match)
    }

    fun getMatchById(id: Long): Match {
        return matchRepository.getReferenceById(id)
    }

    fun deleteMatch(id: Long) {
        matchRepository.deleteById(id)
    }

    fun getMatches(): List<Match> {
        return matchRepository.findAll()
    }
}

package com.jknv.lum.services

import com.jknv.lum.model.dto.MatchDTO
import com.jknv.lum.model.entity.Match
import com.jknv.lum.model.request.match.MatchCreateRequest
import com.jknv.lum.model.request.match.MatchUpdateRequest
import com.jknv.lum.repository.MatchRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service

@Service
class MatchService (
    val matchRepository: MatchRepository,
    val teamService: TeamService,
) {

    fun createMatch(req: MatchCreateRequest): MatchDTO {
        val homeTeam = teamService.getTeamById(req.homeTeamId)
        val awayTeam = teamService.getTeamById(req.awayTeamId)

        if (homeTeam == null || awayTeam == null)
            throw EntityNotFoundException()

        val match = req.toEntity(homeTeam, awayTeam)
        return matchRepository.save(match).toDTO()
    }

    fun updateMatch(matchId: Long, req: MatchUpdateRequest): MatchDTO {
        val match = getMatchById(matchId)
            ?: throw EntityNotFoundException("Match not found")

        req.date?.let { match.date = it }
        req.type?.let { match.type = it }

        req.homeTeamId?.let {
            val homeTeam = teamService.getTeamById(it)
                ?: throw EntityNotFoundException("Home team not found")
            match.homeTeam = homeTeam
        }

        req.awayTeamId?.let {
            val awayTeam = teamService.getTeamById(it)
                ?: throw EntityNotFoundException("Away team not found")
            match.awayTeam = awayTeam
        }

        return matchRepository.save(match).toDTO()
    }

    fun deleteMatch(id: Long) =
        matchRepository.deleteById(id)

    fun getMatches(): List<MatchDTO> =
        matchRepository.findAll().map { it.toDTO() }

    fun countMatches(): Long =
        matchRepository.count()

    private fun getMatchById(id: Long): Match? =
        matchRepository.findById(id).orElse(null)
}

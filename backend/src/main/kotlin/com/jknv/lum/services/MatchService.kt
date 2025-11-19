package com.jknv.lum.services

import com.jknv.lum.model.dto.MatchDTO
import com.jknv.lum.model.entity.Match
import com.jknv.lum.model.request.match.MatchCreateRequest
import com.jknv.lum.model.request.match.MatchUpdateRequest
import com.jknv.lum.repository.MatchRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service
import java.time.Duration
import java.time.LocalDateTime

@Service
class MatchService (
    val matchRepository: MatchRepository,
    val teamService: TeamService,
) {

    fun createMatch(req: MatchCreateRequest): MatchDTO {
        if (req.homeTeamId == req.awayTeamId) {
            throw IllegalArgumentException("Match must have different teams")
        }

        val homeTeam = teamService.getTeamById(req.homeTeamId)
        val awayTeam = teamService.getTeamById(req.awayTeamId)

        val match = req.toEntity(homeTeam, awayTeam)
        return matchRepository.save(match).toDTO()
    }

    fun updateMatch(matchId: Long, req: MatchUpdateRequest): MatchDTO {
        val match = getMatchById(matchId)

        req.date?.let { match.date = it }
        req.type?.let { match.type = it }
        req.homeScore?.let { match.homeScore = it }
        req.awayScore?.let { match.awayScore = it }
        req.state?.let { match.state = it }
        req.homeTeamId?.let { match.homeTeam = teamService.getTeamById(it) }
        req.awayTeamId?.let { match.awayTeam = teamService.getTeamById(it) }
        req.timeLeft?.let {
            match.clockBase = req.timeLeft
            match.clockTimestamp = null
        }
        req.toggleClock?.let {
            if (match.clockTimestamp == null) {
                match.clockTimestamp = LocalDateTime.now()
            } else {
                match.clockBase -= Duration.between(match.clockTimestamp, LocalDateTime.now()).seconds.toInt()
                match.clockTimestamp = null
            }
        }

        return matchRepository.save(match).toDTO()
    }

    fun deleteMatch(id: Long) =
        matchRepository.deleteById(id)

    fun getMatch(id: Long): MatchDTO =
        getMatchById(id).toDTO()

    fun getMatches(): List<MatchDTO> =
        matchRepository.findAll().map { it.toDTO() }

    fun countMatches(): Long =
        matchRepository.count()

    internal fun getMatchById(id: Long): Match =
        matchRepository.findById(id).orElseThrow { EntityNotFoundException("Match $id not found") }
}

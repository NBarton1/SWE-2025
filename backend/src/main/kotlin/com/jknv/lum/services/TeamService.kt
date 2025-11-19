package com.jknv.lum.services

import com.jknv.lum.LOGGER
import com.jknv.lum.model.dto.CoachDTO
import com.jknv.lum.model.dto.PlayerDTO
import com.jknv.lum.model.dto.TeamDTO
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.request.team.TeamCreateRequest
import com.jknv.lum.model.type.MatchState
import com.jknv.lum.repository.TeamRepository
import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import kotlin.collections.mutableMapOf

@Service
@Transactional
class TeamService (
    @param:Value($$"${lum.playoff.teams}")
    private val playoffTeams: Int,

    @param:Value($$"${lum.playoff.min-matches}")
    private val minMatchesForBracket: Int,

    private val teamRepository: TeamRepository,
) {
    fun createTeam(req: TeamCreateRequest): TeamDTO =
        teamRepository.save(req.toEntity()).toDTO()

    fun getTeams(): List<TeamDTO> =
        teamRepository.findAll().map { it.toDTO() }

    fun getTeam(id: Long): TeamDTO =
        getTeamById(id).toDTO()

    fun getPlayersByTeam(id: Long): List<PlayerDTO> =
        getTeamById(id).players.map { it.toDTO() }

    fun getCoachesByTeam(id: Long): List<CoachDTO> =
        getTeamById(id).coaches.map { it.toDTO() }

    fun countTeams(): Long =
        teamRepository.count()

    fun getPlayoffTeams(): List<TeamDTO> {
        val teams = teamRepository.findAll()
        val teamsCount = teams.size

        for (team in teams) {
            val matchCounts = mutableMapOf<Long, Int>()

            for (match in (team.homeMatches + team.awayMatches).filter { it.state == MatchState.FINISHED }) {
                val opponentId = if (match.homeTeam == team) {
                    match.awayTeam.id
                } else {
                    match.homeTeam.id
                }

                matchCounts.compute(opponentId) { _, count -> (count ?: 0) + 1 }
            }

            if (matchCounts.size != teamsCount - 1 || matchCounts.values.any { it < minMatchesForBracket }) {
                return listOf()
            }
        }

        return teams.sortedByDescending { it.pct }.take(playoffTeams).map { it.toDTO() }
    }

    internal fun getTeamById(id: Long): Team =
        teamRepository.findById(id).orElseThrow { EntityNotFoundException("Team $id not found") }
}

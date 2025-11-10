package com.jknv.lum.services

import com.jknv.lum.model.dto.CoachDTO
import com.jknv.lum.model.dto.PlayerDTO
import com.jknv.lum.model.dto.TeamDTO
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.request.team.TeamCreateRequest
import com.jknv.lum.repository.TeamRepository
import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
@Transactional
class TeamService (
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

    internal fun getTeamById(id: Long): Team =
        teamRepository.findById(id).orElseThrow { EntityNotFoundException("Team $id not found") }
}

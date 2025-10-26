package com.jknv.lum.services

import com.jknv.lum.model.dto.TeamDTO
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.request.team.TeamCreateRequest
import com.jknv.lum.repository.TeamRepository
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

    internal fun getTeamById(id: Long): Team? =
        teamRepository.findById(id).orElse(null)

    fun countTeams(): Long =
        teamRepository.count()
}
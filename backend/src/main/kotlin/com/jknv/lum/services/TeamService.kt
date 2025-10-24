package com.jknv.lum.services

import com.jknv.lum.model.entity.Team
import com.jknv.lum.repository.TeamRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
@Transactional
class TeamService (
    private val teamRepository: TeamRepository,
) {
    fun createTeam(team: Team): Team {
        return teamRepository.save(team)
    }

    fun getTeams(): List<Team> {
        return teamRepository.findAll()
    }

    fun getTeamById(id: Long): Team? {
        return teamRepository.findById(id).orElse(null)
    }

    fun countTeams(): Long {
        return teamRepository.count()
    }
}
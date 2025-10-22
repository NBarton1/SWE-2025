package com.jknv.lum.services

import com.jknv.lum.model.Team
import com.jknv.lum.repository.TeamRepository
import org.springframework.stereotype.Service

@Service
class TeamService (
    val teamRepository: TeamRepository,
) {

    fun createTeam(team: Team): Team {
        return teamRepository.save(team)
    }

    fun getTeams(): List<Team> {
        return teamRepository.findAll()
    }
}

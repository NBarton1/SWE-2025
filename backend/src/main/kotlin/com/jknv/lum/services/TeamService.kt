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
    fun create(team: Team): Team {
        return teamRepository.save(team)
    }

    fun getTeams(): List<Team> {
        return teamRepository.findAll()
    }

    fun getTeam(id: Long): Team? {
        return teamRepository.findById(id).orElse(null)
    }

    fun count(): Long {
        return teamRepository.count()
    }
}
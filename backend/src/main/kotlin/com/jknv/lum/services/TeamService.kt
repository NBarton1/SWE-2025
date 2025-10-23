package com.jknv.lum.services

import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.entity.TeamInvite
import com.jknv.lum.repository.TeamInviteRepository
import com.jknv.lum.repository.TeamRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
@Transactional
class TeamService (
    val teamRepository: TeamRepository,
    val teamInviteRepository: TeamInviteRepository,
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

    fun invite(team: Team, player: Account): TeamInvite {
        return teamInviteRepository.save(TeamInvite(team = team, player = player))
    }
}
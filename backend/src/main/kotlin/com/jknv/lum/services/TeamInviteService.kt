package com.jknv.lum.services

import com.jknv.lum.model.entity.Player
import com.jknv.lum.model.entity.TeamInvite
import com.jknv.lum.repository.TeamInviteRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
@Transactional
class TeamInviteService (
    private val teamInviteRepository: TeamInviteRepository
) {
    fun createInvite(invite: TeamInvite): TeamInvite {
        return teamInviteRepository.save(invite)
    }

    fun getInvitesByPlayer(player: Player): List<TeamInvite> {
        return teamInviteRepository.findTeamInvitesByPlayer(player)
    }

    fun countInvites(): Long {
        return teamInviteRepository.count()
    }
}
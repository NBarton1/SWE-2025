package com.jknv.lum.repository

import com.jknv.lum.model.entity.Player
import com.jknv.lum.model.entity.TeamInvite
import com.jknv.lum.model.entity.TeamInvitePK
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TeamInviteRepository : JpaRepository<TeamInvite, Long> {
    fun findTeamInvitesByPlayer(player: Player): List<TeamInvite>
    fun findTeamInviteById(id: TeamInvitePK): TeamInvite?
}
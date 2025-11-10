package com.jknv.lum.repository

import com.jknv.lum.model.entity.Player
import com.jknv.lum.model.entity.TeamInvite
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface TeamInviteRepository : JpaRepository<TeamInvite, Long> {
    fun findTeamInvitesByPlayer(player: Player): List<TeamInvite>
    fun findTeamInviteById(id: TeamInvite.PK): Optional<TeamInvite>
}
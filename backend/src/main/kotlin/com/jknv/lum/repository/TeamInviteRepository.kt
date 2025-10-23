package com.jknv.lum.repository

import com.jknv.lum.model.entity.TeamInvite
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TeamInviteRepository : JpaRepository<TeamInvite, Long>
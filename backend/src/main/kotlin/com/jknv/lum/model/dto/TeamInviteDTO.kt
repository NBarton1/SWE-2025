package com.jknv.lum.model.dto

import com.jknv.lum.model.type.InviteStatus

data class TeamInviteDTO (
    var team: TeamSummary,
    var player: AccountSummary,
    var status: InviteStatus,
)
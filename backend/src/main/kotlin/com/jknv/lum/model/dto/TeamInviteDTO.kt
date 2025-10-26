package com.jknv.lum.model.dto

import com.jknv.lum.model.type.InviteStatus

class TeamInviteDTO (
    var team: TeamSummary,
    var player: AccountSummary,
    var status: InviteStatus,
)
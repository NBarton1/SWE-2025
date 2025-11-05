package com.jknv.lum.model.dto

import com.jknv.lum.model.type.InviteStatus

data class TeamInviteDTO (
    var team: TeamDTO,
    var player: AccountDTO,
    var status: InviteStatus,
)
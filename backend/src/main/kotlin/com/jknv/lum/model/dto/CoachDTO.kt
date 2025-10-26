package com.jknv.lum.model.dto

data class CoachDTO (
    var account: AccountSummary,
    var team: TeamSummary?,
    var likes: Int,
    var dislikes: Int,
)

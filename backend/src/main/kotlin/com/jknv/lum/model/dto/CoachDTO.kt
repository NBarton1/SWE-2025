package com.jknv.lum.model.dto

data class CoachDTO (
    var account: AccountSummary,
    var team: TeamSummary? = null,
    var likes: Int = 0,
    var dislikes: Int = 0,
)

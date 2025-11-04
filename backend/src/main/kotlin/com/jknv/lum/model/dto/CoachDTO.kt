package com.jknv.lum.model.dto

data class CoachDTO (
    var account: AccountDTO,
    var team: TeamDTO? = null,
    var likes: Int = 0,
    var dislikes: Int = 0,
)

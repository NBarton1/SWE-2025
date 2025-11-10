package com.jknv.lum.model.dto

data class PlayerDTO(
    val account: AccountDTO,
    val guardian: AccountDTO?,
    val team: TeamDTO?,
    val hasPermission: Boolean,
    val position: String?,
)

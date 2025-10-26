package com.jknv.lum.model.dto

data class PlayerDTO(
    val account: AccountSummary,
    val guardian: AccountSummary,
    val team: TeamSummary?,
    val hasPermission: Boolean,
    val position: String?,
)

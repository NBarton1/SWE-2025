package com.jknv.lum.model.request

import java.time.LocalDateTime

class MatchUpdateRequest (
    val id: Long,
    val date: LocalDateTime,
    val type: Int,
    var homeTeamId: Long,
    var awayTeamId: Long
)

package com.jknv.lum.model.request

import java.sql.Date

class MatchUpdateRequest (
    val id: Long,
    val date: Date,
    val type: Int,
    var homeTeamId: Long,
    var awayTeamId: Long
)

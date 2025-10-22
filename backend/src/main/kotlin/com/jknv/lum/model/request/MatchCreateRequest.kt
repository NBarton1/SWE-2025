package com.jknv.lum.model.request

import java.sql.Date

class MatchCreateRequest (
    val date: Date,
    val type: Int,
    var homeTeamId: Long,
    var awayTeamId: Long
)

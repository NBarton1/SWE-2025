package com.jknv.lum.model.request

import java.time.LocalDateTime


class MatchCreateRequest (
    val date: LocalDateTime,
    val type: Int,
    var homeTeamId: Long,
    var awayTeamId: Long
)

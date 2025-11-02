package com.jknv.lum.model.request.match

import com.jknv.lum.model.type.MatchType
import java.time.LocalDateTime

class MatchUpdateRequest (
    val date: LocalDateTime?,
    val type: MatchType?,
    var homeTeamId: Long?,
    var awayTeamId: Long?,
    val homeScore: Int?,
    val awayScore: Int?,
    val timeLeft: Int?,
)

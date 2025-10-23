package com.jknv.lum.model.request

import com.jknv.lum.model.type.MatchType
import java.time.LocalDateTime

class MatchUpdateRequest (
    val date: LocalDateTime,
    val type: MatchType,
    var homeTeamId: Long,
    var awayTeamId: Long
)

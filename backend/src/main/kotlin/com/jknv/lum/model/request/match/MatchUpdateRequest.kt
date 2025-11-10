package com.jknv.lum.model.request.match

import com.jknv.lum.model.type.MatchState
import com.jknv.lum.model.type.MatchType
import java.time.LocalDateTime

class MatchUpdateRequest (
    val date: LocalDateTime? = null,
    val type: MatchType? = null,
    var homeTeamId: Long? = null,
    var awayTeamId: Long? = null,
    val homeScore: Int? = null,
    val awayScore: Int? = null,
    val timeLeft: Int? = null,
    val toggleClock: Boolean? = null,
    val state: MatchState? = null
)

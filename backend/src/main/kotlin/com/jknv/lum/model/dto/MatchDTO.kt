package com.jknv.lum.model.dto

import com.jknv.lum.model.type.MatchType
import java.time.LocalDateTime

data class MatchDTO (
    val id: Long,
    val date: LocalDateTime,
    val type: MatchType,
    val timeLeft: Int = 0,
    val homeScore: Int = 0,
    val awayScore: Int = 0,
    val homeTeam: TeamDTO,
    val awayTeam: TeamDTO,
)

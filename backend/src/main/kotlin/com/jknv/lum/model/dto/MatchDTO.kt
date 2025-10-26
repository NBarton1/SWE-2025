package com.jknv.lum.model.dto

import com.jknv.lum.model.type.MatchType
import java.time.LocalDateTime

data class MatchDTO (
    val id: Long,
    val date: LocalDateTime,
    val type: MatchType,
    val timeLeft: Int,
    val homeScore: Int,
    val awayScore: Int,
    val homeTeam: TeamSummary,
    val awayTeam: TeamSummary,
)

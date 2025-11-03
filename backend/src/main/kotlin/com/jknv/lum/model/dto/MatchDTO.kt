package com.jknv.lum.model.dto

import com.jknv.lum.model.type.MatchType
import java.time.LocalDateTime

data class MatchDTO (
    val id: Long,
    val date: LocalDateTime,
    val type: MatchType,
    val homeScore: Int = 0,
    val awayScore: Int = 0,
    val homeTeam: TeamSummary,
    val awayTeam: TeamSummary,
    val clockTimestamp: Int = 0,
    val timeRunning: Boolean = false,
)

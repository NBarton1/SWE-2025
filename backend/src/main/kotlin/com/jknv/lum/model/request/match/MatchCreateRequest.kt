package com.jknv.lum.model.request.match

import com.jknv.lum.model.entity.Match
import com.jknv.lum.model.entity.Team
import com.jknv.lum.model.type.MatchType
import java.time.LocalDateTime

class MatchCreateRequest (
    val date: LocalDateTime,
    val type: MatchType,
    val homeTeamId: Long,
    val awayTeamId: Long,
    val timeLeft: Int = 0,
    val homeScore: Int = 0,
    val awayScore: Int = 0,
) {
    fun toEntity(homeTeam: Team, awayTeam: Team): Match {
        return Match(
            date = date,
            type = type,
            homeTeam = homeTeam,
            awayTeam = awayTeam,
            homeScore = homeScore,
            awayScore = awayScore,
            clockTimestamp = null,
        )
    }
}

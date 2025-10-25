package com.jknv.lum.model.request.team

import com.jknv.lum.model.entity.Team

data class TeamCreateRequest(
    val name: String,
    val win: Int = 0,
    val loss: Int = 0,
    val draw: Int = 0,
    val pointsFor: Int = 0,
    val pointsAllowed: Int = 0,
) {
    fun toEntity(): Team {
        return Team(
            name = name,
            win = win,
            loss = loss,
            draw = draw,
            pointsFor = pointsFor,
            pointsAllowed = pointsAllowed,
        )
    }
}

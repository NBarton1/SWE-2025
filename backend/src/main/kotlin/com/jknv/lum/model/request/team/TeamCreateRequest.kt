package com.jknv.lum.model.request.team

import com.jknv.lum.model.entity.Team

data class TeamCreateRequest(
    val name: String,
) {
    fun toEntity(): Team {
        return Team(
            name = name,
        )
    }
}

package com.jknv.lum.model.dto

data class TeamDTO (
    val id: Long,
    val name: String,
    val win: Int = 0,
    val loss: Int = 0,
    val draw: Int = 0,
    val pointsFor: Int = 0,
    val pointsAllowed: Int = 0,
)

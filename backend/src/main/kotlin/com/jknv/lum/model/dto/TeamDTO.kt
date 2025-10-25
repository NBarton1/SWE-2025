package com.jknv.lum.model.dto

data class TeamDTO (
    val id: Long,
    val name: String,
    val win: Int,
    val loss: Int,
    val draw: Int,
    val pointsFor: Int,
    val pointsAllowed: Int,
)

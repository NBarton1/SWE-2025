package com.jknv.lum.model.request.player

data class PlayerCreateRequest (
    val name: String,
    val username: String,
    val password: String,
)
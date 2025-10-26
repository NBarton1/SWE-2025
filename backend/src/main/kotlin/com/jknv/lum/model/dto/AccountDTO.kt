package com.jknv.lum.model.dto

import com.jknv.lum.model.type.Role

data class AccountDTO (
    val id: Long,
    val name: String,
    val username: String,
    val role: Role,
)

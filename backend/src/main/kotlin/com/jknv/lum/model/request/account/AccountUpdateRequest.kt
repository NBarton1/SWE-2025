package com.jknv.lum.model.request.account

import com.jknv.lum.model.type.Role

data class AccountUpdateRequest(
    val name: String?,
    val username: String?,
    val email: String?,
    val password: String?,
    val role: Role?
)

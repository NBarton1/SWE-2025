package com.jknv.lum.model.request.account

import com.jknv.lum.model.type.Role

data class AccountUpdateRequest(
    val name: String? = null,
    val username: String? = null,
    val email: String? = null,
    val password: String? = null,
    val role: Role? = null,
)

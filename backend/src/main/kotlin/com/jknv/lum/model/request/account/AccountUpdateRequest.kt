package com.jknv.lum.model.request.account

data class AccountUpdateRequest(
    val name: String? = null,
    val username: String? = null,
    val email: String? = null,
    val password: String? = null,
)

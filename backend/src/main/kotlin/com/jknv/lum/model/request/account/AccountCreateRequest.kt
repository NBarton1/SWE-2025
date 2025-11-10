package com.jknv.lum.model.request.account

import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.type.Role
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

data class AccountCreateRequest (
    val name: String,
    val username: String,
    val email: String? = null,
    val password: String,
    val role: Role,
) {
    fun toEntity(): Account {
        return Account(
            name = name,
            username = username,
            email = email,
            password = BCryptPasswordEncoder().encode(password),
            role = role,
        )
    }
}

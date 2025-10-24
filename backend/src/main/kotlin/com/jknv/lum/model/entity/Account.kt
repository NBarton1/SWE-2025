package com.jknv.lum.model.entity

import com.fasterxml.jackson.annotation.JsonProperty
import com.jknv.lum.model.request.account.AccountUpdateRequest
import com.jknv.lum.model.type.Role
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

@Entity
@Table(name = "Account")
data class Account(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false, length = 32)
    var name: String,

    @Column(nullable = false, unique = true, length = 32)
    var username: String,

    @Column(nullable = true, columnDefinition = "bytea")
    var picture: ByteArray? = null,

    @param:JsonProperty(access = JsonProperty.Access.WRITE_ONLY) // Prevents password from being written to responses
    @Column(nullable = false, name = "hashed_password")
    var password: String,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    var role: Role = Role.GUARDIAN,
    ) {

    fun updateFromRequest(request: AccountUpdateRequest, passwordEncoder: BCryptPasswordEncoder) = apply {
        request.name?.let { name = it }
        request.username?.let { username = it }
        request.picture?.let { picture = it }
        request.password?.let { password = passwordEncoder.encode(it) }
    }

}
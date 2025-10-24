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

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Account

        if (id != other.id) return false
        if (name != other.name) return false
        if (username != other.username) return false
        if (!picture.contentEquals(other.picture)) return false
        if (password != other.password) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + name.hashCode()
        result = 31 * result + username.hashCode()
        result = 31 * result + picture.contentHashCode()
        result = 31 * result + password.hashCode()
        return result
    }

    fun updateFromRequest(request: AccountUpdateRequest, passwordEncoder: BCryptPasswordEncoder) = apply {
        request.name?.let { name = it }
        request.username?.let { username = it }
        request.picture?.let { picture = it }
        request.password?.let { password = passwordEncoder.encode(it) }
    }

}
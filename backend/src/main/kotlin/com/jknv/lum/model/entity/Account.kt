package com.jknv.lum.model.entity

import com.fasterxml.jackson.annotation.JsonProperty
import com.jknv.lum.model.dto.AccountDTO
import com.jknv.lum.model.dto.AccountSummary
import com.jknv.lum.model.request.account.AccountUpdateRequest
import com.jknv.lum.model.type.Role
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

@Entity
@Table(name = "Account")
data class Account(

    /* columns */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    @Column(nullable = false, length = 32)
    var name: String,

    @Column(nullable = false, unique = true, length = 32)
    var username: String,

    @Column(nullable = true, columnDefinition = "bytea")
    var picture: ByteArray? = null,

    @Column(nullable = false, name = "hashed_password")
    var password: String,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    var role: Role = Role.GUARDIAN,

    /* relationships */

    @OneToOne(mappedBy = "account", cascade = [CascadeType.ALL], orphanRemoval = true)
    var admin: Admin? = null,

    @OneToOne(mappedBy = "account", cascade = [CascadeType.ALL], orphanRemoval = true)
    var coach: Coach? = null,

    @OneToOne(mappedBy = "account", cascade = [CascadeType.ALL], orphanRemoval = true)
    var guardian: Guardian? = null,

    @OneToOne(mappedBy = "account", cascade = [CascadeType.ALL], orphanRemoval = true)
    var player: Player? = null,
) {
    fun toDTO(): AccountDTO {
        return AccountDTO(
            id = id,
            name = name,
            username = username,
            role = role,
        )
    }

    fun toSummary(): AccountSummary {
        return AccountSummary(
            id = id,
            name = name,
            username = username,
        )
    }
}
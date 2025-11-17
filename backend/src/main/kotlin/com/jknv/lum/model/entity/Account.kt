package com.jknv.lum.model.entity

import com.jknv.lum.model.dto.AccountDTO
import com.jknv.lum.model.type.Role
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction

@Entity
@Table(name = "Account")
class Account(

    /* columns */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    @Column(nullable = false, length = 32)
    var name: String,

    @Column(nullable = false, unique = true, length = 32)
    var username: String,

    @Column(nullable = true, length = 32)
    var email: String? = null,

    @Column(nullable = false, name = "hashed_password")
    var password: String,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    var role: Role = Role.GUARDIAN,

    @OneToOne(orphanRemoval = true)
    @JoinColumn(name = "picture_id", nullable = true)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    var picture: Content? = null,

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
            email = email,
            username = username,
            role = role,
            picture = picture?.takeIf { it.isApproved }?.toDTO()
        )
    }
}
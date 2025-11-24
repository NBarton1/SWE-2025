package com.jknv.lum.model.entity

import com.jknv.lum.model.dto.GuardianDTO
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.MapsId
import jakarta.persistence.OneToMany
import jakarta.persistence.OneToOne
import jakarta.persistence.PreRemove
import jakarta.persistence.Table

@Entity
@Table(name = "Guardian")
class Guardian (

    @Id
    @Column(name = "id")
    var id: Long = 0,

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    var account: Account,

    @OneToMany(mappedBy = "guardian", fetch = FetchType.LAZY)
    var children: MutableSet<Player> = mutableSetOf()

) {
    fun toDTO(): GuardianDTO {
        return GuardianDTO(
            account = account.toDTO(),
        )
    }

    fun isGuardianOf(childAccountId: Long?): Boolean {
        return children.any { it.account.id == childAccountId }
    }

    @PreRemove
    fun preRemove() {
        children.forEach { child ->
            child.guardian = null
            child.hasPermission = false
        }
    }
}

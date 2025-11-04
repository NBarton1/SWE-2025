package com.jknv.lum.model.entity

import com.jknv.lum.model.dto.AdminDTO
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.MapsId
import jakarta.persistence.OneToOne
import jakarta.persistence.Table

@Entity
@Table(name = "Admin")
class Admin (

    @Id
    @Column(name = "id")
    var id: Long? = null,

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    var account: Account,
) {
    fun toDTO(): AdminDTO {
        return AdminDTO(
            account = account.toDTO(),
        )
    }
}
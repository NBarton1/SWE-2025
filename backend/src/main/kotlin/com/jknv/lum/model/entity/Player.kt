package com.jknv.lum.model.entity

import com.jknv.lum.model.dto.PlayerDTO
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.MapsId
import jakarta.persistence.OneToOne
import jakarta.persistence.Table


@Entity
@Table(name = "Player")
class Player (

    @Id
    @Column(name = "id")
    var id: Long = 0,

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    var account: Account,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guardian_id", nullable = false)
    var guardian: Guardian,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = true)
    var playingTeam: Team? = null,

    @Column(nullable = false)
    var hasPermission: Boolean = false,

    @Column(nullable = true)
    var position: String? = null,
) {
    fun toDTO() : PlayerDTO {
        return PlayerDTO(
            account = account.toSummary(),
            guardian = guardian.account.toSummary(),
            team = playingTeam?.toSummary(),
            hasPermission = hasPermission,
            position = position,
        )
    }
}

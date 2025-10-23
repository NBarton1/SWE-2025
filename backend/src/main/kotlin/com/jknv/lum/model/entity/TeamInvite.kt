package com.jknv.lum.model.entity

import com.jknv.lum.model.type.InviteStatus
import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.MapsId
import jakarta.persistence.Table

@Entity
@Table(name = "TeamInvite")
data class TeamInvite (

    @EmbeddedId
    var id: TeamInvitePK = TeamInvitePK(),

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("teamId")
    @JoinColumn(name = "team_id", nullable = false)
    var team: Team,

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("playerId")
    @JoinColumn(name = "player_id", nullable = false)
    var player: Account,

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    var status: InviteStatus = InviteStatus.PENDING,

    )

@Embeddable
data class TeamInvitePK (
    var teamId: Long? = null,
    var playerId: Long? = null,
)

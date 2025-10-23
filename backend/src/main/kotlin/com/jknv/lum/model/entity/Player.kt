package com.jknv.lum.model.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.MapsId
import jakarta.persistence.OneToOne
import jakarta.persistence.Table


@Entity
@Table(name = "Player")
data class Player (

    @Id
    @Column(name = "id")
    var id: Long? = null,

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    var account: Account,

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = true)
    var playingTeam: Team? = null,

    @Column(nullable = false)
    var hasPermission: Boolean = false,

    @Column(nullable = true)
    var position: String? = null,
)

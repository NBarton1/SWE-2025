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
@Table(name = "Coach")
data class Coach (

    @Id
    @Column(name = "id")
    var id: Long? = null,

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    var account: Account,

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = true)
    var coachingTeam: Team? = null,

    @Column(nullable = false)
    var likes: Int = 0,

    @Column(nullable = false)
    var dislikes: Int = 0,
)

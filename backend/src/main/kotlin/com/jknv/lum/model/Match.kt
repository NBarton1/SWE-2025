package com.jknv.lum.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "Match")
data class Match (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    @Column(nullable = false)
    var date: LocalDateTime,

    @Column(nullable = false)
    var type: Int,

    @Column
    var timeLeft: Int = 0,

    @Column(nullable = false)
    var homeScore: Int = 0,

    @Column(nullable = false)
    var awayScore: Int = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "home_team_id", nullable = false)
    var homeTeam: Team,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "away_team_id", nullable = false)
    var awayTeam: Team,

    )

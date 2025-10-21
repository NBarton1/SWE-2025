package com.jknv.lum.model

import jakarta.persistence.*
import java.sql.Date

// TODO add users table to postgres
@Entity
@Table(name = "Match")
data class Match (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long,

    @Column(nullable = false)
    var date: Date,

    @Column(nullable = false)
    var type: String,

    @Column(nullable = false)
    var timeLeft: Int,

    @Column(nullable = false)
    var homeScore: Int,

    @Column(nullable = false)
    var awayScore: Int,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "home_team_id", nullable = false)
    var homeTeam: Team,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "away_team_id", nullable = false)
    var awayTeam: Team,

    ) {
}

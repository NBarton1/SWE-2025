package com.jknv.lum.model.entity

import com.fasterxml.jackson.annotation.JsonFormat
import com.jknv.lum.model.dto.MatchDTO
import com.jknv.lum.model.type.MatchType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit

@Entity
@Table(name = "Match")
data class Match (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    var date: LocalDateTime,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    var type: MatchType,

    @Column(nullable = true)
    var timeStarted: LocalDateTime,

    @Column
    var timePrevious: Int = 0,

    @Column(nullable = false)
    var homeScore: Int = 0,

    @Column(nullable = false)
    var awayScore: Int = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "home_team_id", nullable = false)
    var homeTeam: Team,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "away_team_id", nullable = false)
    var awayTeam: Team

) {
    fun toDTO(): MatchDTO {
        return MatchDTO(
            id = id,
            date = date,
            type = type,
            timeLeft = 0, // TODO
            homeScore = homeScore,
            awayScore = awayScore,
            homeTeam = homeTeam.toSummary(),
            awayTeam = awayTeam.toSummary(),
        )
    }

    @PrePersist
    @PreUpdate
    fun truncateToMinutes() {
        date = date.truncatedTo(ChronoUnit.MINUTES)
    }
}
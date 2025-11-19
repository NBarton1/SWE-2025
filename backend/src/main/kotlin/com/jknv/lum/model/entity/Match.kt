package com.jknv.lum.model.entity

import com.fasterxml.jackson.annotation.JsonFormat
import com.jknv.lum.model.dto.MatchDTO
import com.jknv.lum.model.type.MatchState
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
import jakarta.persistence.MapsId
import jakarta.persistence.OneToOne
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import java.time.Duration

@Entity
@Table(name = "Match")
class Match (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    var date: LocalDateTime,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    var type: MatchType,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    var state: MatchState = MatchState.SCHEDULED,

    @Column
    var clockBase: Int = 3600,

    @Column
    var clockTimestamp: LocalDateTime? = null,

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

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    var post: Post? = null

) {
    fun toDTO(): MatchDTO {
        val running = clockTimestamp != null
        val timeRemaining = maxOf(0, if (running) {
            clockBase - Duration.between(clockTimestamp, LocalDateTime.now()).seconds.toInt()
        } else {
            clockBase
        })

        return MatchDTO(
            id = id,
            date = date,
            type = type,
            state = state,
            homeScore = homeScore,
            awayScore = awayScore,
            homeTeam = homeTeam.toDTO(),
            awayTeam = awayTeam.toDTO(),
            clockTimestamp = timeRemaining,
            timeRunning = timeRemaining > 0 && running,
        )
    }

    private fun truncateToMinutes() {
        date = date.truncatedTo(ChronoUnit.MINUTES)
    }

    private fun createPost() {
        post = Post(account = null)
    }

    @PrePersist
    fun perPersist() {
        createPost()
        truncateToMinutes()
    }

    @PreUpdate
    fun preUpdate() {
        truncateToMinutes()
    }
}
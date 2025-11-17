package com.jknv.lum.model.entity

import com.jknv.lum.model.dto.TeamDTO
import com.jknv.lum.model.type.MatchState
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.PostLoad
import jakarta.persistence.PostUpdate
import jakarta.persistence.Table


@Entity
@Table(name = "Team")
class Team (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    @Column(nullable = false, unique = true)
    var name: String,

    @Transient
    var win: Int = 0,

    @Transient
    var loss: Int = 0,

    @Transient
    var draw: Int = 0,

    @Transient
    var pct: Double = 0.0,

    @Transient
    var pointsFor: Int = 0,

    @Transient
    var pointsAllowed: Int = 0,

    @OneToMany(mappedBy = "homeTeam", fetch = FetchType.LAZY)
    var homeMatches: MutableList<Match> = mutableListOf(),

    @OneToMany(mappedBy = "awayTeam", fetch = FetchType.LAZY)
    var awayMatches: MutableList<Match> = mutableListOf(),

    @OneToMany(mappedBy = "playingTeam", fetch = FetchType.LAZY)
    var players: MutableSet<Player> = mutableSetOf(),

    @OneToMany(mappedBy = "coachingTeam", fetch = FetchType.LAZY)
    var coaches: MutableSet<Coach> = mutableSetOf(),
) {
    @PostLoad
    @PostUpdate
    private fun calculateStats() {
        val matches = (homeMatches + awayMatches).filter { it.state == MatchState.FINISHED }

        matches.filter { it.state == MatchState.FINISHED }.forEach {
            val totalScore = it.homeScore + it.awayScore

            val teamScore = if (this == it.homeTeam) {
                it.homeScore
            } else {
                it.awayScore
            }

            val otherScore = totalScore - teamScore

            if (teamScore > otherScore) {
                win++
            } else if (teamScore < otherScore) {
                loss++
            } else {
                draw++
            }

            pointsFor += teamScore
            pointsAllowed += otherScore
        }

        if (matches.isNotEmpty()) {
            pct = (win + 0.5 * draw) / (win + loss + draw)
        }
    }


    fun toDTO(): TeamDTO {

        return TeamDTO(
            id = id,
            name = name,
            win = win,
            loss = loss,
            draw = draw,
            pct = pct,
            pointsFor = pointsFor,
            pointsAllowed = pointsAllowed
        )
    }
}

package com.jknv.lum.model.entity

import com.jknv.lum.model.dto.TeamDTO
import com.jknv.lum.model.dto.TeamSummary
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table


@Entity
@Table(name = "Team")
data class Team (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    @Column(nullable = false, unique = true)
    var name: String,

    @Column(nullable = false)
    var win: Int = 0,

    @Column(nullable = false)
    var loss: Int = 0,

    @Column(nullable = false)
    var draw: Int = 0,

    @Column(nullable = false)
    var pointsFor: Int = 0,

    @Column(nullable = false)
    var pointsAllowed: Int = 0,

    @OneToMany(mappedBy = "playingTeam", fetch = FetchType.LAZY)
    var players: MutableSet<Player> = mutableSetOf(),

    @OneToMany(mappedBy = "coachingTeam", fetch = FetchType.LAZY)
    var coaches: MutableSet<Coach> = mutableSetOf(),
) {
    fun toDTO(): TeamDTO {
        return TeamDTO(
            id = id,
            name = name,
            win = win,
            loss = loss,
            draw = draw,
            pointsFor = pointsFor,
            pointsAllowed = pointsAllowed
        )
    }

    fun toSummary(): TeamSummary {
        return TeamSummary(
            id = id,
            name = name,
        )
    }
}

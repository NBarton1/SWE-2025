package com.jknv.lum.model

import jakarta.persistence.*

@Entity
@Table(name = "Team")
class Team (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long,

    @Column(nullable = false)
    var wins: Int,

    @Column(nullable = false)
    var losses: Int,

    @Column(nullable = false)
    var ties: Int,

    @Column(nullable = false)
    var pointsFor: Int,

    @Column(nullable = false)
    var pointsAllowed: Int,

    @OneToMany(mappedBy = "homeTeam", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    var homeMatches: List<Match> = mutableListOf(),

    @OneToMany(mappedBy = "awayTeam", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    var awayMatches: List<Match> = mutableListOf()

    ) {

}
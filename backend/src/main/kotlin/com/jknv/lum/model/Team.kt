package com.jknv.lum.model

import com.fasterxml.jackson.annotation.JsonManagedReference
import jakarta.persistence.*

@Entity
@Table(name = "Team")
class Team (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long,

    @Column(nullable = false, unique = true)
    var name: String,

    @Column(nullable = false)
    var wins: Int = 0,

    @Column(nullable = false)
    var losses: Int = 0,

    @Column(nullable = false)
    var ties: Int = 0,

    @Column(nullable = false)
    var pointsFor: Int = 0,

    @Column(nullable = false)
    var pointsAllowed: Int = 0
)
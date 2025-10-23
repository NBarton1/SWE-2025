package com.jknv.lum.model.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table


@Entity
@Table(name = "Team")
data class Team (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

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
) {

}

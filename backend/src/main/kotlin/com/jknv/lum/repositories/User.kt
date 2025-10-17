package com.jknv.lum.repositories

import jakarta.persistence.*

// TODO add users table to postgres
@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,

    @Column(nullable = false)
    private val name: String,
)
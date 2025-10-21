package com.jknv.lum.model

import jakarta.persistence.*

// TODO add users table to postgres
@Entity
@Table(name = "Account")
data class Account(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long,

    @Column(nullable = false, length = 32)
    var name: String,

    @Column(nullable = false, unique = true, length = 32)
    var username: String,

    @Column(nullable = true, columnDefinition = "bytea")
    var picture: ByteArray?,

    @Column(nullable = false, name = "hashed_password")
    var password: String,

    ) {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Account

        if (id != other.id) return false
        if (name != other.name) return false
        if (username != other.username) return false
        if (!picture.contentEquals(other.picture)) return false
        if (password != other.password) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + name.hashCode()
        result = 31 * result + username.hashCode()
        result = 31 * result + picture.contentHashCode()
        result = 31 * result + password.hashCode()
        return result
    }

}
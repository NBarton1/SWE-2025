package com.jknv.lum.entities

import jakarta.persistence.*

// TODO add users table to postgres
@Entity
@Table(name = "Account")
data class Account(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,

    @Column(nullable = false)
    val name: String,

    @Column(nullable = false, unique = true)
    val username: String,

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(nullable = false)
    val picture: ByteArray,

//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    val type: AccountType
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Account

        if (id != other.id) return false
        if (name != other.name) return false
        if (username != other.username) return false
        if (!picture.contentEquals(other.picture)) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + name.hashCode()
        result = 31 * result + username.hashCode()
        result = 31 * result + picture.contentHashCode()
        return result
    }
}
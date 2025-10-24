package com.jknv.lum.model.request.account

data class AccountUpdateRequest(
    val name: String?,
    val username: String?,
    val password: String?,
    val picture: ByteArray?,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as AccountUpdateRequest

        if (name != other.name) return false
        if (username != other.username) return false
        if (password != other.password) return false
        if (!picture.contentEquals(other.picture)) return false

        return true
    }

    override fun hashCode(): Int {
        var result = name?.hashCode() ?: 0
        result = 31 * result + (username?.hashCode() ?: 0)
        result = 31 * result + (password?.hashCode() ?: 0)
        result = 31 * result + (picture?.contentHashCode() ?: 0)
        return result
    }
}
package com.jknv.lum.model.entity

import com.jknv.lum.model.dto.FlagDTO
import jakarta.persistence.Embeddable
import jakarta.persistence.EmbeddedId
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.MapsId
import jakarta.persistence.Table
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction

@Entity
@Table(name = "Flag")
class Flag (

    @EmbeddedId
    var id: PK = PK(),

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("postId")
    @JoinColumn(name = "post_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    var post: Post,

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("accountId")
    @JoinColumn(name = "account_id", nullable = false)
    var account: Account,

    ) {

    @Embeddable
    data class PK (
        var postId: Long? = null,
        var accountId: Long? = null,
    )

    fun toDTO(): FlagDTO {
        return FlagDTO(
            post = post.toDTO(),
            account = account.toDTO(),
        )
    }
}
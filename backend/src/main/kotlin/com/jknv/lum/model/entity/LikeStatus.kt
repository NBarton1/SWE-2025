package com.jknv.lum.model.entity

import com.jknv.lum.model.dto.LikeStatusDTO
import com.jknv.lum.model.type.LikeType
import jakarta.persistence.*

@Entity
@Table(
    name = "LikeStatus",
//    uniqueConstraints = [
//        UniqueConstraint(columnNames = ["account_id", "entity_id", "like_type"])
//    ],
//    indexes = [
//        Index(name = "idx_entity_like_liked", columnList = "entity_id, like_type, liked")
//    ],
)
class LikeStatus(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    val account: Account,

    @Column(nullable = false)
    val entityId: Long,

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    val likeType: LikeType,

    @Column(nullable = false)
    var liked: Boolean
) {
    fun toDTO(): LikeStatusDTO {
        return LikeStatusDTO(
            id = id,
            account = account.toDTO(),
            entityId = entityId,
            likeType = likeType,
            liked = liked
        )
    }
}
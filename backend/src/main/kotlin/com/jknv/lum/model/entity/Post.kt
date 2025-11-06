package com.jknv.lum.model.entity

import com.jknv.lum.model.dto.PostDTO
import jakarta.persistence.*


@Entity
@Table(name = "Post")
class Post (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    var account: Account,

    @Column(nullable = false)
    var likeCount: Int = 0,

    @Column(nullable = false)
    var dislikeCount: Int = 0,

    @Column(nullable = false)
    var content: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = true)
    var parentPost: Post? = null,

    @OneToMany(mappedBy = "parentPost", fetch = FetchType.LAZY)
    var children: MutableSet<Post> = mutableSetOf(),
) {
    fun toDTO(): PostDTO {
        return PostDTO(
            id = id,
            content = content,
            likeCount = likeCount,
            dislikeCount = dislikeCount,
        )
    }
}

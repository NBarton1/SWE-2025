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

    @Column
    var textContent: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = true)
    var parentPost: Post? = null,

    @OneToMany(mappedBy = "parentPost", fetch = FetchType.LAZY)
    var children: MutableList<Post> = mutableListOf(),

    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY)
    var media: MutableList<Content> = mutableListOf(),

) {
    fun toDTO(): PostDTO {
        return PostDTO(
            id = id,
            textContent = textContent,
            likeCount = likeCount,
            dislikeCount = dislikeCount,
            media = media.map { it.toDTO() }.toMutableList(),
        )
    }
}

package com.jknv.lum.model.entity

import com.jknv.lum.model.dto.PostDTO
import jakarta.persistence.*
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime


@Entity
@Table(name = "Post")
@EntityListeners(AuditingEntityListener::class)
class Post (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    var account: Account? = null,

    @Column
    var textContent: String = "",

    @CreatedDate
    @Column(updatable = false)
    var creationTime: LocalDateTime? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    var parentPost: Post? = null,

    @OneToMany(mappedBy = "parentPost", fetch = FetchType.LAZY)
    var children: MutableList<Post> = mutableListOf(),

    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY, cascade = [CascadeType.ALL], orphanRemoval = true)
    var media: MutableList<Content> = mutableListOf(),

    @Column(nullable = false)
    var flagCount: Int = 0,

    @OneToOne(fetch = FetchType.LAZY, cascade = [CascadeType.REMOVE])
    @JoinColumn(name = "match_id")
    var match: Match? = null,

    @Column(nullable = false)
    var isApproved: Boolean = false,
) {
    fun toDTO(): PostDTO {
        return PostDTO(
            id = id,
            account = account?.toDTO(),
            textContent = textContent,
            flagCount = flagCount,
            media = media.map { it.toDTO() }.toMutableList(),
            creationTime = creationTime,
            match = match?.toDTO(),
            isApproved = isApproved,
        )
    }
}

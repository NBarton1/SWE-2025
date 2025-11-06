package com.jknv.lum.model.entity

import jakarta.persistence.*


@Entity
@Table(name = "Post")
class Post (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    @Column(nullable = false)
    var likeCount: Int = 0,

    @Column(nullable = false)
    var dislikeCount: Int = 0,

    @Column(nullable = false)
    var content: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id", nullable = true)
    var parentId: Post? = null,

    @OneToMany(mappedBy = "parentId", fetch = FetchType.LAZY)
    var children: MutableSet<Post> = mutableSetOf(),
)

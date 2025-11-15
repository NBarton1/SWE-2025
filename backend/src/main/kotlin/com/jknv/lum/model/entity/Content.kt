package com.jknv.lum.model.entity

import com.jknv.lum.model.dto.ContentDTO
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table

@Entity
@Table(name = "Content")
class Content (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    val filename: String,

    @Column(nullable = false)
    val fileSize: Long,

    @Column(nullable = false)
    val contentType: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = true)
    var post: Post? = null,

) {
    fun toDTO(): ContentDTO {
        return ContentDTO (
            id = id,
            filename = filename,
            contentType = contentType,
            fileSize = fileSize,
            downloadUrl = "http://localhost:8080/api/content/${id}"
        )
    }
}
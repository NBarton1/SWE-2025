package com.jknv.lum.repository

import com.jknv.lum.model.entity.Account
import com.jknv.lum.model.entity.Post
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface PostRepository : JpaRepository<Post, Long> {
    fun findByParentPostIsNull(): List<Post>
    fun findByIsApprovedIsFalseAndAccountId(accountId: Long): MutableList<Post>
}

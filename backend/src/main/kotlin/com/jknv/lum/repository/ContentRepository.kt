package com.jknv.lum.repository

import com.jknv.lum.model.entity.Content
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ContentRepository : JpaRepository<Content, Long>
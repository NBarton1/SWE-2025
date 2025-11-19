package com.jknv.lum.repository

import com.jknv.lum.model.entity.Flag
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface FlagRepository : JpaRepository<Flag, Long> {
    fun getFlagsByPostId(postId: Long): MutableList<Flag>
    fun deleteById(id: Flag.PK)
    fun countFlagsById(id: Flag.PK): Long
    fun countFlagsByPostId(postId: Long): Long
    fun getFlagById(id: Flag.PK): Optional<Flag>
}
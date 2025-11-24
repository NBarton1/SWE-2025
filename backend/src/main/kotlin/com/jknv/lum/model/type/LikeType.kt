package com.jknv.lum.model.type

import com.jknv.lum.model.entity.Coach
import com.jknv.lum.model.entity.Post
import kotlin.reflect.KClass

enum class LikeType(val entityClass: KClass<*>) {
    COACH(Coach::class),
    POST(Post::class),
}